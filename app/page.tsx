import { PublicHeader } from "@/components/layout/PublicHeader";
import { HeroSection } from "@/components/layout/HeroSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-public-bg">
      <PublicHeader />
      <HeroSection />
      
      {/* Exemplo de Seção de Conteúdo Pós-Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-public-text-main mb-4">
            Destaques da Comunidade
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card Mockup 1 */}
          <div className="public-card rounded-2xl overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                Artigo
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Como viver bem o tempo atual
              </h3>
              <p className="text-public-text-dim text-sm line-clamp-3">
                Uma reflexão sobre a importância deste momento litúrgico e como podemos nos preparar espiritualmente.
              </p>
            </div>
          </div>

          {/* Card Mockup 2 */}
          <div className="public-card rounded-2xl overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                Formação
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Estudo Bíblico Semanal
              </h3>
              <p className="text-public-text-dim text-sm line-clamp-3">
                Participe do nosso encontro semanal para aprofundar o conhecimento nas Sagradas Escrituras em comunidade.
              </p>
            </div>
          </div>

          {/* Card Mockup 3 */}
          <div className="public-card rounded-2xl overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                Aviso
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                Horários das Celebrações
              </h3>
              <p className="text-public-text-dim text-sm line-clamp-3">
                Confira a programação atualizada das Santas Missas e confissões para esta semana na sua paróquia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
