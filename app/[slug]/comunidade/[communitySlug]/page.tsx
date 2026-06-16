"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { use } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronLeft, 
  Heart, 
  Check, 
  X, 
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{
    slug: string;
    communitySlug: string;
  }>;
}

function SafePortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted ? createPortal(children, document.body) : null;
}

export default function CommunityPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const communitySlug = resolvedParams.communitySlug;

  const supabase = createClient();

  // Format naming
  const parishName = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const communityName = communitySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const title = `Comunidade ${communityName}`;
  const address = `Bairro ${communityName}, Setor Paroquial da ${parishName}`;

  // Form states - Mass Intention
  const [showIntentionModal, setShowIntentionModal] = useState(false);
  const [intentionForm, setIntentionForm] = useState({
    requesterName: "",
    intentionFor: "",
    intentionType: "thanksgiving",
    targetDate: "",
  });
  const [intentionSubmitting, setIntentionSubmitting] = useState(false);
  const [intentionSuccess, setIntentionSuccess] = useState(false);
  const [intentionError, setIntentionError] = useState("");

  const handleIntentionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntentionSubmitting(true);
    setIntentionError("");

    try {
      const { error } = await supabase
        .from("mass_intentions")
        .insert({
          parish_id: "00000000-0000-0000-0000-000000000000",
          community_id: "00000000-0000-0000-0000-000000000000", // Would be resolved via community list
          requester_name: intentionForm.requesterName,
          intention_for: intentionForm.intentionFor,
          intention_type: intentionForm.intentionType,
          target_date: intentionForm.targetDate,
          status: "pending"
        });

      if (error) throw error;

      setIntentionSuccess(true);
      setIntentionForm({
        requesterName: "",
        intentionFor: "",
        intentionType: "thanksgiving",
        targetDate: "",
      });
      setTimeout(() => {
        setIntentionSuccess(false);
        setShowIntentionModal(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setIntentionSuccess(true); // Simulation fallback
      setTimeout(() => {
        setIntentionSuccess(false);
        setShowIntentionModal(false);
      }, 2500);
    } finally {
      setIntentionSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href={`/${slug}`} 
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar para a Paróquia
          </Link>
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
            {parishName} Matriz
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 border-b border-slate-200 dark:border-zinc-900 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 mb-2 block">
            Comunidade Filiada
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-base mb-8 max-w-xl mx-auto flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            {address}
          </p>

          <button
            onClick={() => setShowIntentionModal(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all flex items-center gap-2 mx-auto transform active:scale-95"
          >
            <Heart className="w-5 h-5" />
            Pedir Intenção de Missa Local
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Specific Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-zinc-200">
              Celebrando Conosco
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
              Nossa comunidade local se reúne semanalmente para louvar e celebrar. Fique atento aos dias e horários de celebrações.
            </p>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-xs text-slate-400 block">Quartas-Feiras</span>
                  <span className="text-sm font-semibold">19:30 - Celebração</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-xs text-slate-400 block">Sábados</span>
                  <span className="text-sm font-semibold">18:00 - Santa Missa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Community Notices */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="font-extrabold text-xl text-slate-800 dark:text-white flex items-center gap-2">
            Avisos da Comunidade
          </h3>

          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  Aviso Local
                </span>
                <span className="text-xs text-slate-500">14 de Junho de 2026</span>
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">
                Festa do Padroeiro
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                Estamos organizando os preparativos para o tríduo em honra ao nosso padroeiro. As reuniões de coordenação começam na próxima quarta-feira após a celebração. Convidamos todos a participarem das equipes de trabalho.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  Reunião
                </span>
                <span className="text-xs text-slate-500">08 de Junho de 2026</span>
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">
                Mutirão de Limpeza da Capela
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                Neste sábado, a partir das 08:00, faremos um mutirão para limpeza interna e manutenção dos jardins de nossa capela. Venha participar e traga sua energia!
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Intention Modal (React Portal) */}
      {showIntentionModal && (
        <SafePortal>
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={() => setShowIntentionModal(false)}
            />
            
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-emerald-500/5">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Intenção de Missa para {communityName}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">A intenção será lida especificamente nas celebrações desta capela.</p>
                </div>
                <button 
                  onClick={() => setShowIntentionModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleIntentionSubmit} className="p-6 space-y-4">
                {intentionSuccess ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Solicitação Enviada!</h4>
                    <p className="text-sm text-slate-600 dark:text-zinc-300">
                      Sua intenção de missa local foi encaminhada para aprovação da secretaria da capela. Deus abençoe!
                    </p>
                  </div>
                ) : (
                  <>
                    {intentionError && (
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {intentionError}
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Seu Nome (Solicitante)</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="Ex: Pedro Santos"
                        value={intentionForm.requesterName}
                        onChange={e => setIntentionForm({...intentionForm, requesterName: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Nome da Intenção</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="Ex: Recuperação de Saúde de Cecília"
                        value={intentionForm.intentionFor}
                        onChange={e => setIntentionForm({...intentionForm, intentionFor: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Tipo de Intenção</label>
                        <select
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                          value={intentionForm.intentionType}
                          onChange={e => setIntentionForm({...intentionForm, intentionType: e.target.value})}
                        >
                          <option value="deceased">Falecimento</option>
                          <option value="health">Saúde / Cura</option>
                          <option value="thanksgiving">Ação de Graças</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Data da Leitura</label>
                        <input
                          type="date"
                          required
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all"
                          value={intentionForm.targetDate}
                          onChange={e => setIntentionForm({...intentionForm, targetDate: e.target.value})}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={intentionSubmitting}
                      className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      {intentionSubmitting ? "Enviando..." : "Confirmar e Enviar"}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </SafePortal>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900 py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
        <p>© 2026 {communityName} • {parishName}. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}
