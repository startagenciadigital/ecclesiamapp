export function HeroSection() {
  return (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Imagem de Fundo (Placeholder imitando a referência) */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548625361-ec853f669a7b?q=80&w=2070&auto=format&fit=crop")' }}
      ></div>
      
      {/* Overlay Escuro Adicional para Leitura */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest mb-6">
          Comunidade Católica
        </span>
        
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          A Rede Social das <span className="text-primary">Paróquias</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Conecte-se com sua comunidade local, acompanhe eventos, formações e viva a fé em comunhão, onde quer que você esteja.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-deep hover:opacity-90 transition-opacity">
            Encontrar minha Paróquia
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-glass-bg border border-glass-border text-white font-medium text-lg hover:bg-white/10 transition-colors glass">
            Conhecer o Projeto
          </button>
        </div>
      </div>
    </section>
  );
}
