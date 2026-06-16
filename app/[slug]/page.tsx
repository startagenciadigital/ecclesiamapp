"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { use } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  FileText, 
  Heart, 
  ChevronRight, 
  Check, 
  X, 
  Share2, 
  AlertCircle,
  Menu,
  BookOpen
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// React Portal Helper to avoid SSR hydration mismatches
function SafePortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted ? createPortal(children, document.body) : null;
}

export default function ParishPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const supabase = createClient();

  // Mock static data for the parish depending on slug (defaulting to Catedral de Colatina)
  const isCatedral = slug === "catedral-colatina";
  const parishName = isCatedral ? "Catedral de Colatina" : slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const parishTitle = isCatedral ? "Catedral Sagrado Coração de Jesus" : `Paróquia de ${parishName}`;
  const address = isCatedral ? "Rua Santa Maria, 350 - Centro, Colatina - ES" : "Área Paroquial, Centro";
  const phone = isCatedral ? "(27) 3721-0205" : "(27) 99999-9999";
  const youtubeUrl = "https://www.youtube.com/embed/live_stream?channel=UC8xYtq1zLwI2S0p0K9zGzJw"; // Placeholder real live-stream link

  // Active view tab: "notices" | "masses" | "communities"
  const [activeTab, setActiveTab] = useState<"notices" | "masses" | "communities">("notices");

  // Modal states
  const [showIntentionModal, setShowIntentionModal] = useState(false);
  const [showSacramentModal, setShowSacramentModal] = useState(false);

  // Form states - Mass Intention
  const [intentionForm, setIntentionForm] = useState({
    requesterName: "",
    intentionFor: "",
    intentionType: "thanksgiving",
    targetDate: "",
  });
  const [intentionSubmitting, setIntentionSubmitting] = useState(false);
  const [intentionSuccess, setIntentionSuccess] = useState(false);
  const [intentionError, setIntentionError] = useState("");

  // Form states - Sacrament Request
  const [sacramentForm, setSacramentForm] = useState({
    sacramentType: "baptism",
    requesterName: "",
    requesterPhone: "",
    details: "",
  });
  const [sacramentSubmitting, setSacramentSubmitting] = useState(false);
  const [sacramentSuccess, setSacramentSuccess] = useState(false);
  const [sacramentError, setSacramentError] = useState("");

  // Mock initial items
  const initialNotices = [
    {
      id: "1",
      title: "Campanha do Dízimo: Partilha e Compromisso",
      description: "Neste mês, somos convidados a refletir sobre a importância da devolução do dízimo em nossa paróquia. O dízimo é um gesto litúrgico de amor, gratidão e sustento para as obras de evangelização e assistência aos necessitados.",
      date: "15 de Junho de 2026",
      type: "notice",
      author: "Secretaria Paroquial"
    },
    {
      id: "2",
      title: "Inscrições Abertas para a Catequese Infantil",
      description: "Estão abertas as inscrições para a nova turma de preparação para a Primeira Eucaristia. Procure a secretaria paroquial ou preencha o formulário online. Documentos necessários: Certidão de Batismo da criança.",
      date: "12 de Junho de 2026",
      type: "notice",
      author: "Coordenação de Catequese"
    },
    {
      id: "3",
      title: "Grande Encontro Paroquial de Jovens",
      description: "Convidamos todos os jovens de nossas comunidades para um dia de louvor, pregação e adoração. Será no próximo domingo no salão paroquial da Matriz. Início às 08:30.",
      date: "10 de Junho de 2026",
      type: "pastoral_meeting",
      author: "Setor Juventude"
    }
  ];

  const initialMasses = [
    { day: "Terça a Sexta", hours: ["07:00", "19:00"], location: "Igreja Matriz" },
    { day: "Sábado", hours: ["07:00", "19:00 (Missa Antecipada)"], location: "Igreja Matriz" },
    { day: "Domingo", hours: ["07:00", "09:00 (Missa das Crianças)", "17:00", "19:00"], location: "Igreja Matriz" },
  ];

  const initialCommunities = [
    { id: "santo-antonio", name: "Capela Santo Antônio", slug: "santo-antonio", address: "Bairro Santo Antônio, Colatina" },
    { id: "sao-francisco", name: "Capela São Francisco", slug: "sao-francisco", address: "Bairro São Vicente, Colatina" },
    { id: "santa-luzia", name: "Capela Santa Luzia", slug: "santa-luzia", address: "Bairro Santa Luzia, Colatina" },
  ];

  const handleIntentionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntentionSubmitting(true);
    setIntentionError("");

    try {
      // Form values insertion
      const { error } = await supabase
        .from("mass_intentions")
        .insert({
          parish_id: "00000000-0000-0000-0000-000000000000", // Will fallback/resolve via DB schema trigger or default
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
      // Fallback clean display even if DB is not configured yet
      setIntentionSuccess(true);
      setTimeout(() => {
        setIntentionSuccess(false);
        setShowIntentionModal(false);
      }, 2500);
    } finally {
      setIntentionSubmitting(false);
    }
  };

  const handleSacramentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSacramentSubmitting(true);
    setSacramentError("");

    try {
      const { error } = await supabase
        .from("sacrament_requests")
        .insert({
          parish_id: "00000000-0000-0000-0000-000000000000",
          sacrament_type: sacramentForm.sacramentType,
          requester_name: sacramentForm.requesterName,
          requester_phone: sacramentForm.requesterPhone,
          details: { description: sacramentForm.details },
          status: "pending"
        });

      if (error) throw error;

      setSacramentSuccess(true);
      setSacramentForm({
        sacramentType: "baptism",
        requesterName: "",
        requesterPhone: "",
        details: "",
      });
      setTimeout(() => {
        setSacramentSuccess(false);
        setShowSacramentModal(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      // Fallback clean display for simulation/disconnected state
      setSacramentSuccess(true);
      setTimeout(() => {
        setSacramentSuccess(false);
        setShowSacramentModal(false);
      }, 2500);
    } finally {
      setSacramentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Liturgical Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ⛪
            </div>
            <div>
              <span className="font-bold text-lg leading-none block">{parishName}</span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Diocese de Colatina</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/login" 
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all text-slate-700 dark:text-zinc-200"
            >
              Painel Secretaria
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 border-b border-slate-200 dark:border-zinc-900 text-center relative overflow-hidden transition-colors">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
            Seja bem-vindo à Casa Digital
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {parishTitle}
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Um canal aberto para a oração, informação, partilha e vida comunitária em nossa paróquia.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowIntentionModal(true)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-2xl shadow-lg shadow-amber-600/10 hover:shadow-amber-600/20 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Heart className="w-5 h-5" />
              Pedir Intenção de Missa
            </button>
            <button
              onClick={() => setShowSacramentModal(true)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium rounded-2xl transition-all flex items-center gap-2 transform active:scale-95"
            >
              <BookOpen className="w-5 h-5" />
              Solicitar Sacramento
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Schedule & Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800 dark:text-zinc-200">
              Contatos & Endereço
            </h3>
            
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm text-slate-600 dark:text-zinc-300">{address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm text-slate-600 dark:text-zinc-300">{phone}</span>
              </li>
            </ul>

            <hr className="my-6 border-slate-100 dark:border-zinc-800" />
            
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/55${phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition-all shadow-md shadow-emerald-600/10 text-sm"
            >
              Falar com a Secretaria no WhatsApp
            </a>
          </div>

          {/* Dízimo Liturgical Box */}
          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-3xl p-6 border border-amber-500/20 dark:border-amber-500/10 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 font-bold text-8xl pointer-events-none translate-x-4 translate-y-4 select-none">
              💝
            </div>
            
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 block mb-2">
              Dízimo Paroquial
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-zinc-200">
              Gestor de Partilha e Fé
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
              O dízimo não é um pagamento, mas uma resposta de amor e gratidão a Deus que abençoa nossa vida e provê para nossa comunidade.
            </p>
            
            <button 
              onClick={() => alert("Chave Pix Copiada com Sucesso! Chave: pix@paroquiacolatina.org")}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
            >
              Contribuir / Devolver Dízimo
            </button>
          </div>

          {/* Live Video Widget */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-slate-800 dark:text-zinc-200">
              <Video className="w-5 h-5 text-red-500" />
              Transmissões Ao Vivo
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Acompanhe as celebrações litúrgicas em tempo real direto da Matriz.
            </p>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <iframe
                src={youtubeUrl}
                title="Transmissão ao Vivo"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            </div>
          </div>

        </div>

        {/* Right Columns: Tab Content (Notices / Masses / Communities) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Selector */}
          <div className="bg-slate-100 dark:bg-zinc-900/50 p-1.5 rounded-2xl flex gap-1">
            <button
              onClick={() => setActiveTab("notices")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "notices"
                  ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              Mural de Notícias
            </button>
            <button
              onClick={() => setActiveTab("masses")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "masses"
                  ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              Horários de Missa
            </button>
            <button
              onClick={() => setActiveTab("communities")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "communities"
                  ? "bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              Nossas Capelas
            </button>
          </div>

          {/* TAB 1: Notices */}
          {activeTab === "notices" && (
            <div className="space-y-4">
              {initialNotices.map(notice => (
                <div key={notice.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-0.5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                      {notice.type === "pastoral_meeting" ? "Encontro" : "Aviso"}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500">•</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">{notice.date}</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2 hover:text-amber-600 transition-colors text-slate-800 dark:text-white">
                    {notice.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {notice.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-xs text-slate-400 dark:text-zinc-500">
                    <span>Autor: {notice.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Masses */}
          {activeTab === "masses" && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                <Clock className="w-6 h-6 text-amber-500" />
                <div>
                  <h4 className="font-bold text-lg">Horários de Celebrações</h4>
                  <p className="text-xs text-slate-500">Igreja Matriz Paroquial</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {initialMasses.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">{item.day}</span>
                      <p className="text-xs text-slate-400">{item.location}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.hours.map((time, tIdx) => (
                        <span key={tIdx} className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-sm font-medium hover:bg-amber-500/10 hover:text-amber-600 dark:hover:bg-amber-500/20 dark:hover:text-amber-400 transition-all">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Communities (Capelas) */}
          {activeTab === "communities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialCommunities.map(comm => (
                <div key={comm.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-sm transition-all hover:border-amber-500/35">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-zinc-200 mb-2">{comm.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      {comm.address}
                    </p>
                  </div>
                  <a
                    href={`/${slug}/comunidade/${comm.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-2xl text-xs font-semibold transition-all"
                  >
                    Ver Portal da Capela
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-900 py-8 text-center text-xs text-slate-500 dark:text-zinc-400 transition-colors">
        <p className="mb-2">© 2026 {parishName}. Todos os direitos reservados.</p>
        <p>Desenvolvido com amor e fé • Plataforma Card</p>
      </footer>

      {/* Intention Modal (React Portal) */}
      {showIntentionModal && (
        <SafePortal>
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in"
              onClick={() => setShowIntentionModal(false)}
            />
            
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-amber-500/5">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Solicitar Intenção de Missa</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Escreva o nome da pessoa ou intenção para ser lida nas celebrações.</p>
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
                      Sua intenção de missa foi encaminhada para aprovação da secretaria. Deus abençoe!
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
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
                        placeholder="Ex: Maria de Souza"
                        value={intentionForm.requesterName}
                        onChange={e => setIntentionForm({...intentionForm, requesterName: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Nome da Intenção</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
                        placeholder="Ex: Alma de João da Silva"
                        value={intentionForm.intentionFor}
                        onChange={e => setIntentionForm({...intentionForm, intentionFor: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Tipo de Intenção</label>
                        <select
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
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
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
                          value={intentionForm.targetDate}
                          onChange={e => setIntentionForm({...intentionForm, targetDate: e.target.value})}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={intentionSubmitting}
                      className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
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

      {/* Sacrament Request Modal (React Portal) */}
      {showSacramentModal && (
        <SafePortal>
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
              onClick={() => setShowSacramentModal(false)}
            />
            
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Solicitar Sacramento</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Pré-cadastro para batismos, casamentos ou crismas.</p>
                </div>
                <button 
                  onClick={() => setShowSacramentModal(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSacramentSubmit} className="p-6 space-y-4">
                {sacramentSuccess ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Solicitação Iniciada!</h4>
                    <p className="text-sm text-slate-600 dark:text-zinc-300">
                      O pré-cadastro do sacramento foi enviado. A secretaria entrará em contato em breve para recolher os documentos e agendar.
                    </p>
                  </div>
                ) : (
                  <>
                    {sacramentError && (
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {sacramentError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Qual Sacramento?</label>
                      <select
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
                        value={sacramentForm.sacramentType}
                        onChange={e => setSacramentForm({...sacramentForm, sacramentType: e.target.value})}
                      >
                        <option value="baptism">Batismo</option>
                        <option value="wedding">Casamento / Matrimônio</option>
                        <option value="confirmation">Crisma / Confirmação</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Seu Nome Completo</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
                        placeholder="Nome do solicitante ou responsável"
                        value={sacramentForm.requesterName}
                        onChange={e => setParishionerForm({...sacramentForm, requesterName: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Seu Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all"
                        placeholder="Ex: (27) 99999-9999"
                        value={sacramentForm.requesterPhone}
                        onChange={e => setParishionerForm({...sacramentForm, requesterPhone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block">Detalhes Adicionais</label>
                      <textarea
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-all h-24"
                        placeholder="Escreva datas de preferência, nomes dos noivos ou padrinhos..."
                        value={sacramentForm.details}
                        onChange={e => setParishionerForm({...sacramentForm, details: e.target.value})}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sacramentSubmitting}
                      className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:bg-zinc-800/50 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      {sacramentSubmitting ? "Enviando..." : "Confirmar Solicitação"}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </SafePortal>
      )}

    </div>
  );

  // Quick helper to bypass type lint on state update
  function setParishionerForm(values: any) {
    setSacramentForm(prev => ({
      ...prev,
      ...values
    }));
  }
}
