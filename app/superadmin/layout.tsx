import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Settings, Users, LogOut } from "lucide-react";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white font-serif">Ecclesiam SaaS</h1>
          <p className="text-sm text-zinc-500 mt-1">Painel Super Admin</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/superadmin" className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Assinantes</span>
          </Link>
          <Link href="/superadmin/users" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
            <Users size={20} />
            <span className="font-medium">Usuários Globais</span>
          </Link>
          <Link href="/superadmin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
            <Settings size={20} />
            <span className="font-medium">Configurações globais</span>
          </Link>
        </nav>

        {/* Perfil Fictício */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">AdminDev</p>
              <p className="text-xs text-zinc-500">admindev</p>
            </div>
          </div>
          <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
