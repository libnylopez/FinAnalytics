import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  Scale,
  Calculator,
  FileText,
  Users
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'inputs', label: 'Datos de la empresa', icon: Building2 },
  { id: 'statements', label: 'Estados financieros', icon: FileSpreadsheet },
  { id: 'ratios', label: 'Razones financieras', icon: Scale },
  { id: 'evaluation', label: 'Evaluación de inversión', icon: Calculator },
  { id: 'reports', label: 'Reportes', icon: FileText }
];

export default function Sidebar({ activeTab, setActiveTab, onOpenTeamModal }) {
  return (
    <aside className="bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 lg:w-60 lg:h-screen lg:sticky lg:top-0 print:hidden">
      {/* Identificación */}
      <div className="px-5 pt-5 pb-4 lg:border-b border-slate-200">
        <div className="text-base font-bold tracking-tight text-navy-900">FinAnalytics</div>
        <div className="text-xs text-slate-500 mt-0.5 leading-snug">
          <span>Contabilidad Financiera</span>
          <span className="lg:hidden"> · </span>
          <span className="lg:block">UVG Sololá</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex lg:flex-col gap-1 overflow-x-auto px-3 pb-3 lg:py-4 lg:flex-1" aria-label="Secciones">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex items-center gap-3 whitespace-nowrap px-3 py-2 rounded text-sm text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-navy-50 text-navy-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="hidden lg:block absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-navy-800" aria-hidden="true" />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-navy-800' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Información del proyecto */}
      <div className="hidden lg:block px-3 py-3 border-t border-slate-200">
        <button
          type="button"
          onClick={onOpenTeamModal}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Users className="w-4 h-4 text-slate-400" />
          <span>Equipo del proyecto</span>
        </button>
      </div>
    </aside>
  );
}
