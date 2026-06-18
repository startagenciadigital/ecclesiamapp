import { Building2, Search, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

// Mock Data simulando o Banco de Dados e a integração com o Stripe
const MOCK_TENANTS = [
  { id: 1, name: "Catedral de Colatina", slug: "colatina", status: "ativo", users: 1204, mrr: 199.90 },
  { id: 2, name: "Paróquia São José", slug: "sao-jose", status: "ativo", users: 432, mrr: 199.90 },
  { id: 3, name: "Comunidade Nossa Senhora", slug: "nossa-senhora", status: "inadimplente", users: 150, mrr: 0 },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard SaaS</h1>
          <p className="text-zinc-500 mt-2">Visão geral do crescimento da plataforma Ecclesiam.</p>
        </div>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR Card */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Receita Recorrente (MRR)</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">R$ 399,80</h3>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-4 font-medium">
            <TrendingUp size={14} /> +12% esse mês
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Total de Paróquias</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">3</h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Building2 size={20} />
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">2 ativas, 1 com pendência</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Fiéis Conectados</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">1.786</h3>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-purple-600 flex items-center gap-1 mt-4 font-medium">
            <TrendingUp size={14} /> +8% esse mês
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Status do Stripe</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Online</h3>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg animate-pulse">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">Conexão de pagamentos estável</p>
        </div>
      </div>

      {/* Lista de Assinantes (Tenants) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="font-semibold text-zinc-900 dark:text-white">Gerenciamento de Assinantes</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar paróquia..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 uppercase font-semibold text-xs border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Paróquia Assinante</th>
                <th className="px-6 py-4">URL do Tenant</th>
                <th className="px-6 py-4">Pagamento (Stripe)</th>
                <th className="px-6 py-4">Fiéis na Rede</th>
                <th className="px-6 py-4">Plano Atual</th>
                <th className="px-6 py-4 text-right">Estatísticas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {MOCK_TENANTS.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Building2 size={16} />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">/{tenant.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      tenant.status === 'ativo' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {tenant.status === 'ativo' ? 'Fatura Paga' : 'Bloqueado (Inadimplente)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 font-medium">
                    {tenant.users.toLocaleString('pt-BR')} 
                  </td>
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                    {tenant.mrr > 0 ? `R$ ${tenant.mrr.toFixed(2).replace('.', ',')}` : 'Grátis'}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white font-medium transition-colors">Relatórios</button>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium transition-colors">Ver Painel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
