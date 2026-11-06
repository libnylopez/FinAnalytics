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
import { RajilMark, RajilWordmark } from './brand/RajilLogo';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'inputs', label: 'Datos de la empresa', icon: Building2 },
  { id: 'statements', label: 'Estados financieros', icon: FileSpreadsheet },
  { id: 'ratios', label: 'Razones financieras', icon: Scale },
  { id: 'evaluation', label: 'Evaluación de inversión', icon: Calculator },
  { id: 'reports', label: 'Reportes', icon: FileText }
];

const itemBase =
  'group relative flex items-center gap-3 h-9 px-3 rounded-lg text-sm whitespace-nowrap text-left cursor-pointer ' +
  'transition-colors duration-150 ease-out';

export default function Sidebar({ activeTab, setActiveTab, onOpenTeamModal }) {
  return (
    <aside className="bg-sidebar border-b lg:border-b-0 lg:border-r border-line flex flex-col shrink-0 lg:w-64 lg:h-screen lg:sticky lg:top-0 print:hidden">
      {/* Identidad */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 lg:pt-6 lg:pb-6">
        <RajilMark size={34} />
        <div className="min-w-0 leading-tight">
          <div className="pt-0.5 pb-[3px]">
            <RajilWordmark capHeight={12} />
            <span className="sr-only">RAJIL</span>
          </div>
          <div className="text-xs text-ink-2 mt-0.5">Contabilidad Financiera · UVG</div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex lg:flex-col gap-1 overflow-x-auto px-3 pb-3 lg:pb-4 lg:flex-1" aria-label="Secciones">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`${itemBase} ${
                isActive ? 'bg-accent/10 text-accent font-semibold' : 'text-ink-2 hover:bg-ink/[0.05] hover:text-ink'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
                  isActive ? 'text-accent' : 'text-ink-3 group-hover:text-ink-2'
                }`}
                strokeWidth={isActive ? 2.25 : 2}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Información del proyecto */}
      <div className="hidden lg:block px-3 py-3 border-t border-line">
        <button
          type="button"
          onClick={onOpenTeamModal}
          className={`${itemBase} w-full text-ink-2 hover:bg-ink/[0.05] hover:text-ink`}
        >
          <Users className="w-[18px] h-[18px] text-ink-3 group-hover:text-ink-2 transition-colors duration-150" />
          <span>Equipo del proyecto</span>
        </button>
      </div>
    </aside>
  );
}
