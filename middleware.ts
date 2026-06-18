import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se as variáveis de ambiente do Supabase não estiverem prontas, prossegue normalmente
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  
  if (error && error.message.includes("Refresh Token")) {
    console.warn("Token de refresh inválido detectado no middleware. Limpando cookies e redirecionando.");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    
    const cleanResponse = NextResponse.redirect(redirectUrl);
    
    // Remove os cookies de autenticação do Supabase para evitar loops
    const supabaseCookies = request.cookies.getAll().filter(c => c.name.startsWith("sb-"));
    supabaseCookies.forEach(c => {
      cleanResponse.cookies.delete(c.name);
    });
    
    return cleanResponse;
  }

  // --- BYPASS DE DESENVOLVIMENTO ---
  // Permite acesso direto à rota de superadmin no ambiente local para testes de interface
  if (process.env.NODE_ENV === "development" && path.startsWith("/superadmin")) {
    return response;
  }
  // ---------------------------------

  // Proteção de rotas gerais que exigem login
  if (!user && (path.startsWith("/dashboard") || path.startsWith("/admin") || path.startsWith("/onboarding") || path.startsWith("/superadmin"))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // Proteção rigorosa específica para rotas de Super Admin
  if (user && path.startsWith("/superadmin")) {
    // Verifica na tabela user_roles se o usuário possui a role superadmin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "superadmin")
      .maybeSingle();

    if (!roleData) {
      // Usuário logado, mas NÃO é superadmin. Redireciona para fora da área restrita.
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
