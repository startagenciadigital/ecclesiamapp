import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as {
  supabaseClient: SupabaseClient | undefined;
};

// Safe fallback proxy to allow Next.js static prerendering to compile without environment variables
const dummyClient = new Proxy({}, {
  get(target, prop) {
    if (prop === "auth") {
      return {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithOtp: () => Promise.resolve({ data: null, error: null }),
        verifyOtp: () => Promise.resolve({ data: null, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      };
    }
    return () => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: null, error: null })
        }),
        limit: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null })
        }),
        maybeSingle: () => Promise.resolve({ data: null, error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null })
      })
    });
  }
}) as any;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("Supabase credentials missing. Using safe fallback client proxy for static build.");
    return dummyClient;
  }

  if (!globalForSupabase.supabaseClient) {
    globalForSupabase.supabaseClient = createBrowserClient(url, anonKey);
  }

  return globalForSupabase.supabaseClient;
}
