import Link from 'next/link';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950 border-b border-slate-800 text-slate-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* O brasão/ícone usará a cor dourada como padrão de nobreza, ou a litúrgica se preferir */}
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold font-serif text-xl shadow-md transition-transform group-hover:scale-105">
            {process.env.NEXT_PUBLIC_TENANT_NAME ? process.env.NEXT_PUBLIC_TENANT_NAME.charAt(0) : "P"}
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            {process.env.NEXT_PUBLIC_TENANT_NAME || "Sua Paróquia"}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
            O Projeto
          </Link>
          <Link href="/paroquias" className="text-sm font-medium hover:text-primary transition-colors">
            Paróquias
          </Link>
          <Link href="/comunidades" className="text-sm font-medium hover:text-primary transition-colors">
            Comunidades
          </Link>
          <Link href="/formacao" className="text-sm font-medium hover:text-primary transition-colors">
            Formação
          </Link>
        </nav>

        {/* Auth / Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Entrar
          </Link>
          <Link 
            href="/cadastro" 
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-premium hover:opacity-90 transition-opacity"
          >
            Participar
          </Link>
        </div>
      </div>
    </header>
  );
}
