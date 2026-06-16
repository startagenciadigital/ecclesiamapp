"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  BookOpen, 
  Calendar, 
  Users, 
  TrendingUp, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  FileText,
  User,
  Phone,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function DashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Stats Counters
  const [stats, setStats] = useState({
    intentionsPending: 12,
    sacramentsPending: 5,
    activeCommunities: 3,
    totalNotices: 8
  });

  // Data lists
  const [intentions, setIntentions] = useState<any[]>([
    {
      id: "1",
      requester_name: "Maria de Souza",
      intention_for: "Alma de João da Silva",
      intention_type: "deceased",
      target_date: "2026-06-18",
      status: "pending"
    },
    {
      id: "2",
      requester_name: "José Ferreira",
      intention_for: "Recuperação de Saúde de Cecília",
      intention_type: "health",
      target_date: "2026-06-19",
      status: "approved"
    },
    {
      id: "3",
      requester_name: "Ana Cláudia",
      intention_for: "Ação de Graças pela Família",
      intention_type: "thanksgiving",
      target_date: "2026-06-20",
      status: "read"
    }
  ]);

  const [sacraments, setSacraments] = useState<any[]>([
    {
      id: "1",
      sacrament_type: "baptism",
      requester_name: "Carlos Eduardo da Silva",
      requester_phone: "(27) 99888-7766",
      details: { description: "Batismo do bebê Lucas, nascido em 10/01/2026. Padrinhos: Roberta e Marcos." },
      status: "pending",
      created_at: "2026-06-15"
    },
    {
      id: "2",
      sacrament_type: "wedding",
      requester_name: "Roberto e Amanda",
      requester_phone: "(27) 99777-6655",
      details: { description: "Casamento pretendido para Novembro de 2026. Já possuem data pré-reservada no curso de noivos." },
      status: "analyzing",
      created_at: "2026-06-14"
    },
    {
      id: "3",
      sacrament_type: "confirmation",
      requester_name: "Juliana Andrade",
      requester_phone: "(27) 99666-5544",
      details: { description: "Inscrição de Crisma de jovem com 16 anos." },
      status: "scheduled",
      created_at: "2026-06-12"
    }
  ]);

  // Tab Filtering
  const [sacramentFilter, setSacramentFilter] = useState("all");
  const [intentionFilter, setIntentionFilter] = useState("all");

  // Load real data if available from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [intentionsRes, sacramentsRes, communitiesRes] = await Promise.all([
          supabase.from("mass_intentions").select("*").order("created_at", { ascending: false }).limit(20),
          supabase.from("sacrament_requests").select("*").order("created_at", { ascending: false }).limit(20),
          supabase.from("communities").select("id", { count: "exact" })
        ]);

        if (intentionsRes.data && intentionsRes.data.length > 0) {
          setIntentions(intentionsRes.data);
        }
        if (sacramentsRes.data && sacramentsRes.data.length > 0) {
          setSacraments(sacramentsRes.data);
        }

        // Compute dynamic stats based on data loaded
        const intPending = (intentionsRes.data ?? intentions).filter((i: any) => i.status === "pending").length;
        const sacPending = (sacramentsRes.data ?? sacraments).filter((s: any) => s.status === "pending" || s.status === "analyzing").length;
        const commCount = communitiesRes.count ?? stats.activeCommunities;

        setStats({
          intentionsPending: intPending,
          sacramentsPending: sacPending,
          activeCommunities: commCount,
          totalNotices: 8
        });

      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  // Update Status Handlers
  const handleUpdateIntentionStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic state update
      setIntentions(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      
      const { error } = await supabase
        .from("mass_intentions")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSacramentStatus = async (id: string, newStatus: string) => {
    try {
      setSacraments(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      
      const { error } = await supabase
        .from("sacrament_requests")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered lists
  const filteredSacraments = sacraments.filter(s => {
    if (sacramentFilter === "all") return true;
    return s.status === sacramentFilter;
  });

  const filteredIntentions = intentions.filter(i => {
    if (intentionFilter === "all") return true;
    return i.status === intentionFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text-primary)] font-sans flex transition-colors duration-200">
      
      {/* Sidebar Layout */}
      <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⛪</span>
            <div>
              <span className="font-extrabold text-sm block tracking-wider uppercase">Casa Digital</span>
              <span className="text-[10px] text-slate-400">Secretaria Paroquial</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-amber-600 rounded-xl text-sm font-semibold text-white shadow-sm">
            <TrendingUp className="w-5 h-5" />
            Dashboard Geral
          </Link>
          <a href="/catedral-colatina" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-semibold transition-all">
            <FileText className="w-5 h-5" />
            Ver Portal Público
          </a>
        </nav>

        <div className="p-6 border-t border-slate-800 text-xs text-slate-400">
          <span>Logado como Secretaria</span>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header */}
        <header className="h-16 border-b border-[var(--dash-border)] bg-[var(--dash-surface)] flex items-center justify-between px-6 shrink-0 transition-colors">
          <h1 className="text-xl font-bold tracking-tight">Gestão Paroquial</h1>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--dash-bg)] hover:bg-[var(--dash-hover-bg)] transition-all border border-[var(--dash-border)]">
              Sair
            </Link>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="flex-1 p-6 space-y-8 max-w-6xl w-full mx-auto">
          
          {/* KPI Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Intenções Pendentes", value: stats.intentionsPending, icon: Heart, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Sacramentos Pendentes", value: stats.sacramentsPending, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Capelas Ativas", value: stats.activeCommunities, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Avisos Publicados", value: stats.totalNotices, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[var(--dash-surface)] p-6 rounded-2xl border border-[var(--dash-border)] flex items-center justify-between shadow-sm transition-all hover:scale-[1.01]">
                <div>
                  <span className="text-xs font-semibold text-[var(--dash-text-secondary)] block mb-1">{stat.label}</span>
                  <span className="text-3xl font-extrabold">{stat.value}</span>
                </div>
                <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Table Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* PANEL 1: Sacrament Requests */}
            <div className="bg-[var(--dash-surface)] rounded-3xl border border-[var(--dash-border)] shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Solicitações de Sacramentos
                  </h3>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">Pedidos de batismo, casamento e crisma dos fiéis.</p>
                </div>
                
                {/* Filter pill */}
                <div className="flex gap-1 bg-[var(--dash-bg)] p-1 rounded-xl border border-[var(--dash-border)] self-start sm:self-auto">
                  {["all", "pending", "scheduled"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSacramentFilter(tab)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all capitalize ${
                        sacramentFilter === tab 
                          ? "bg-[var(--dash-surface)] text-slate-800 dark:text-white shadow-sm"
                          : "text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
                      }`}
                    >
                      {tab === "all" ? "Todos" : tab === "pending" ? "Pendentes" : "Agendados"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-x-auto divide-y divide-[var(--dash-border)]">
                {filteredSacraments.length === 0 ? (
                  <p className="text-sm text-[var(--dash-text-muted)] text-center py-12">Nenhuma solicitação encontrada.</p>
                ) : (
                  filteredSacraments.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col gap-3 hover:bg-[var(--dash-hover-bg)] transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {item.sacrament_type === "baptism" ? "Batismo" : item.sacrament_type === "wedding" ? "Casamento" : "Crisma"}
                        </span>
                        
                        {/* Status Label */}
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          item.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                          item.status === "analyzing" ? "bg-purple-500/10 text-purple-600" :
                          item.status === "scheduled" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"
                        }`}>
                          {item.status === "pending" ? "Pendente" :
                           item.status === "analyzing" ? "Análise" :
                           item.status === "scheduled" ? "Agendado" : "Cancelado"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm block flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />
                          {item.requester_name}
                        </span>
                        <span className="text-xs text-[var(--dash-text-secondary)] block flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />
                          {item.requester_phone}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--dash-text-secondary)] bg-[var(--dash-bg)] p-3 rounded-xl border border-[var(--dash-border)] leading-relaxed">
                        {item.details.description}
                      </p>

                      {/* Action buttons */}
                      {item.status === "pending" && (
                        <div className="flex gap-2 justify-end mt-2">
                          <button
                            onClick={() => handleUpdateSacramentStatus(item.id, "scheduled")}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Aprovar & Agendar
                          </button>
                          <button
                            onClick={() => handleUpdateSacramentStatus(item.id, "cancelled")}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-350 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-[var(--dash-text-primary)] flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PANEL 2: Mass Intentions */}
            <div className="bg-[var(--dash-surface)] rounded-3xl border border-[var(--dash-border)] shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[var(--dash-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-amber-500" />
                    Intenções de Missa Recentes
                  </h3>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">Orações solicitadas pelos fiéis para as celebrações.</p>
                </div>
                
                {/* Filter pill */}
                <div className="flex gap-1 bg-[var(--dash-bg)] p-1 rounded-xl border border-[var(--dash-border)] self-start sm:self-auto">
                  {["all", "pending", "approved"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setIntentionFilter(tab)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all capitalize ${
                        intentionFilter === tab 
                          ? "bg-[var(--dash-surface)] text-slate-800 dark:text-white shadow-sm"
                          : "text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)]"
                      }`}
                    >
                      {tab === "all" ? "Todas" : tab === "pending" ? "Pendentes" : "Aprovadas"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-x-auto divide-y divide-[var(--dash-border)]">
                {filteredIntentions.length === 0 ? (
                  <p className="text-sm text-[var(--dash-text-muted)] text-center py-12">Nenhuma intenção encontrada.</p>
                ) : (
                  filteredIntentions.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col gap-2 hover:bg-[var(--dash-hover-bg)] transition-colors">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          item.intention_type === "deceased" ? "bg-red-500/10 text-red-600" :
                          item.intention_type === "health" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                        }`}>
                          {item.intention_type === "deceased" ? "Falecimento" :
                           item.intention_type === "health" ? "Saúde" : "Ação de Graças"}
                        </span>
                        
                        <span className="text-xs text-[var(--dash-text-secondary)] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Leitura: {item.target_date}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm block">Intenção: {item.intention_for}</span>
                        <span className="text-xs text-[var(--dash-text-secondary)] block">Solicitado por: {item.requester_name}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--dash-border)]/50">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                          item.status === "pending" ? "text-amber-500" :
                          item.status === "approved" ? "text-blue-500" : "text-emerald-500"
                        }`}>
                          Status: {item.status === "pending" ? "Pendente" : item.status === "approved" ? "Aprovado" : "Lido"}
                        </span>

                        {item.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateIntentionStatus(item.id, "approved")}
                              className="text-xs font-semibold px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleUpdateIntentionStatus(item.id, "cancelled")}
                              className="text-xs font-semibold px-2.5 py-1 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-350 dark:hover:bg-zinc-750 text-[var(--dash-text-primary)] rounded-lg flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Recusar
                            </button>
                          </div>
                        )}
                        {item.status === "approved" && (
                          <button
                            onClick={() => handleUpdateIntentionStatus(item.id, "read")}
                            className="text-xs font-semibold px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Marcar como Lido
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
