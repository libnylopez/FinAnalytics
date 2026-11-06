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
  'group relative z-[1] flex items-center gap-3 h-9 rounded-[10px] text-callout whitespace-nowrap text-left cursor-pointer ' +
  'transition-[color,background-color,transform] duration-180 ease-out active:scale-[0.97]';

/**
 * Navegación sobre el lienzo (sin panel propio), al estilo de las herramientas de productividad.
 * La sección activa es una pastilla elevada que se desliza, con un riel del degradado de marca.
 * En escritorio se puede contraer a solo iconos.
 */
export default function Sidebar({ activeTab, setActiveTab, onOpenTeamModal, collapsed = false }) {
  const navRef = useRef(null);
  const indicator = useIndicator(navRef, '[aria-current="page"]', `${activeTab}-${collapsed}`);

  return (
    <aside
      className={`flex flex-col shrink-0 border-b border-line lg:border-b-0 lg:h-screen lg:sticky lg:top-0 print:hidden
        transition-[width] duration-240 ease-emphasis ${collapsed ? 'lg:w-[76px]' : 'lg:w-[248px]'}`}
    >
      {/* Identidad: el isotipo comparte eje con los iconos y el nombre con las etiquetas */}
      <div className="flex items-center gap-[10px] h-[60px] px-5 lg:pl-[22px] overflow-hidden">
        <RajilMark size={28} title={collapsed ? 'RAJIL' : undefined} />
        <div className={`min-w-0 transition-opacity duration-180 ${collapsed ? 'lg:opacity-0 lg:pointer-events-none' : ''}`}>
          <RajilWordmark capHeight={12} />
          <span className="sr-only">RAJIL</span>
        </div>
      </div>

      {/* Navegación */}
      <nav
        ref={navRef}
        className="relative flex lg:flex-col gap-0.5 overflow-x-auto lg:overflow-x-visible px-3 pb-3 lg:pt-3 lg:pb-4 lg:flex-1 [scrollbar-width:none]"
        aria-label="Secciones"
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 rounded-[10px] bg-surface shadow-raised ring-1 ring-line duration-[300ms] ease-spring"
          style={indicator}
        >
          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-brand-gradient" />
        </span>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={collapsed ? item.label : undefined}
              title={collapsed ? item.label : undefined}
              className={`${itemBase} px-3 ${collapsed ? 'lg:justify-center lg:px-0' : ''} ${
                isActive ? 'text-ink font-semibold' : 'text-ink-2 font-medium hover:bg-ink/[0.05] hover:text-ink'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-[color,transform] duration-180 ease-out ${
                  isActive ? 'text-accent' : 'text-ink-3 group-hover:text-ink-2'
                }`}
                strokeWidth={isActive ? 2.2 : 1.9}
              />
              <span className={collapsed ? 'lg:sr-only' : ''}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Información del proyecto */}
      <div className="hidden lg:block px-3 py-4">
        <button
          type="button"
          onClick={onOpenTeamModal}
          aria-label={collapsed ? 'Equipo del proyecto' : undefined}
          title={collapsed ? 'Equipo del proyecto' : undefined}
          className={`${itemBase} w-full px-3 font-medium text-ink-2 hover:bg-ink/[0.05] hover:text-ink ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <Users className="w-[18px] h-[18px] text-ink-3 group-hover:text-ink-2 transition-colors duration-180" strokeWidth={1.9} />
          <span className={collapsed ? 'sr-only' : ''}>Equipo del proyecto</span>
        </button>
      </div>
    </aside>
  );
}
