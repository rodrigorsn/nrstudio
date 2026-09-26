import React from 'react';
import {
  LayoutDashboard,
  Building,
  Megaphone,
  BarChart3,
  ShieldAlert,
  ClipboardList,
  FileText,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/company', label: 'Empresa e setores', icon: Building },
    { path: '/campaigns', label: 'Campanhas', icon: Megaphone },
    { path: '/results', label: 'Resultados', icon: BarChart3 },
    { path: '/risk-inventory', label: 'Inventário de riscos', icon: ShieldAlert },
    { path: '/action-plans', label: 'Planos de ação', icon: ClipboardList },
    { path: '/reports', label: 'Relatórios', icon: FileText },
    { path: '/methodology', label: 'Metodologia e fontes', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 min-h-[calc(100vh-57px)] no-print">
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
          Navegação Principal
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-teal-700' : 'text-stone-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer metadata note in sidebar */}
      <div className="p-4 border-t border-stone-200 text-[11px] text-stone-500 space-y-1 bg-stone-50/50">
        <p className="font-semibold text-stone-700">PsicoGestão NR-1 v1.0</p>
        <p className="text-stone-400">Subsídio técnico ao GRO/PGR conforme NR-1.</p>
      </div>
    </aside>
  );
};
