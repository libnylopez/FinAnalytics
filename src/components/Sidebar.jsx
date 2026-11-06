import React, { useRef } from 'react';
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
import useIndicator from '../hooks/useIndicator';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'inputs', label: 'Datos de la empresa', icon: Building2 },
  { id: 'statements', label: 'Estados financieros', icon: FileSpreadsheet },
  { id: 'ratios', label: 'Razones financieras', icon: Scale },
  { id: 'evaluation', label: 'Evaluación de inversión', icon: Calculator },
  { id: 'reports', label: 'Reportes', icon: FileText }
];

const itemBase =
  'group relative z-[1] flex items-center gap-3 h-10 px-3 rounded-[10px] text-callout whitespace-nowrap text-left cursor-pointer ' +
  'transition-colors duration-180 ease-out';

export default function Sidebar({ activeTab, setActiveTab, onOpenTeamModal }) {
  const navRef = useRef(null);
  // La selección se desliza entre secciones en lugar de saltar
  const indicator = useIndicator(navRef, '[aria-current="page"]', activeTab);

  return (
    <aside className="bg-sidebar border-b lg:border-b-0 lg:border-r border-line flex flex-col shrink-0 lg:w-[264px] lg:h-screen lg:sticky lg:top-0 print:hidden">
      {/* Identidad */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3 lg:px-6 lg:pt-7 lg:pb-7">
        <RajilMark size={36} />
        <div className="min-w-0">
          <div className="pb-1.5">
            <RajilWordmark capHeight={13} />
            <span className="sr-only">RAJIL</span>
          </div>
          <div className="text-caption text-ink-2">Contabilidad Financiera · UVG</div>
        </div>
      </div>

      {/* Navegación */}
      <nav
        ref={navRef}
        className="relative flex lg:flex-col gap-0.5 overflow-x-auto px-3 pb-3 lg:px-4 lg:pb-4 lg:flex-1 [scrollbar-width:none]"
        aria-label="Secciones"
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 rounded-[10px] bg-accent/[0.09] ring-1 ring-inset ring-accent/[0.08] duration-240 ease-emphasis"
          style={indicator}
        />
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
                isActive ? 'text-accent font-semibold' : 'text-ink-2 font-medium hover:bg-ink/[0.045] hover:text-ink'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors duration-180 ${
                  isActive ? 'text-accent' : 'text-ink-3 group-hover:text-ink-2'
                }`}
                strokeWidth={isActive ? 2.2 : 1.9}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Información del proyecto */}
      <div className="hidden lg:block px-4 py-4 border-t border-line">
        <button
          type="button"
          onClick={onOpenTeamModal}
          className={`${itemBase} w-full font-medium text-ink-2 hover:bg-ink/[0.045] hover:text-ink`}
        >
          <Users className="w-[18px] h-[18px] text-ink-3 group-hover:text-ink-2 transition-colors duration-180" strokeWidth={1.9} />
          <span>Equipo del proyecto</span>
        </button>
      </div>
    </aside>
  );
}
