import React, { useEffect, useState } from 'react';
import { Users, Monitor, Sun, Moon, PanelLeft, ChevronRight } from 'lucide-react';
import SegmentedControl from './ui/SegmentedControl';

const CURRENCIES = [
  { id: 'GTQ', label: 'Q', title: 'Mostrar cifras con el símbolo Q. No convierte montos.' },
  { id: 'USD', label: '$', title: 'Mostrar cifras con el símbolo $. No convierte montos.' }
];

// En pantallas anchas cada opción muestra su nombre junto al icono
const THEMES = [
  { id: 'system', label: 'Apariencia automática (según el sistema)', shortLabel: 'Auto', icon: Monitor, iconOnly: true },
  { id: 'light', label: 'Apariencia clara', shortLabel: 'Claro', icon: Sun, iconOnly: true },
  { id: 'dark', label: 'Apariencia oscura', shortLabel: 'Oscuro', icon: Moon, iconOnly: true }
];

/** Indica si la página se desplazó, para mostrar el fondo de la barra de herramientas. */
function useScrolled(threshold = 4) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/**
 * Barra de herramientas compacta: ubicación (empresa / módulo) y controles globales.
 * El título grande de cada módulo vive dentro de la hoja de trabajo, no aquí.
 */
export default function Header({
  title,
  companyData,
  currency,
  setCurrency,
  theme,
  setTheme,
  onOpenTeamModal,
  sidebarCollapsed,
  onToggleSidebar
}) {
  const scrolled = useScrolled();

  return (
    <header
      className={`glass-bar lg:sticky lg:top-0 z-20 print:hidden transition-[background-color,box-shadow] duration-240 ${
        scrolled ? 'lg:bg-canvas/80 lg:backdrop-blur-xl lg:backdrop-saturate-150 lg:shadow-[0_1px_0_rgb(var(--line))]' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 sm:px-5 lg:pl-1 lg:pr-5 py-3 min-h-[60px]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Mostrar barra lateral completa' : 'Contraer barra lateral'}
            aria-pressed={sidebarCollapsed}
            title={sidebarCollapsed ? 'Mostrar barra lateral' : 'Contraer barra lateral'}
            className="hidden lg:grid place-items-center w-9 h-9 rounded-[10px] text-ink-2 hover:bg-ink/[0.06] hover:text-ink active:scale-95 cursor-pointer transition-[background-color,color,transform] duration-150"
          >
            <PanelLeft className="w-[18px] h-[18px]" strokeWidth={1.9} />
          </button>
          <nav aria-label="Ubicación" className="flex items-center gap-1.5 min-w-0 text-callout">
            <span className="text-ink-2 truncate max-w-[42vw] sm:max-w-[320px]">{companyData.companyName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-ink-3 shrink-0" aria-hidden="true" />
            <span key={title} aria-current="page" className="font-semibold text-ink whitespace-nowrap animate-fade-in">
              {title}
            </span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* Símbolo monetario: solo cambia el símbolo mostrado, no convierte cantidades */}
          <div className="flex items-center gap-2">
            <span className="text-footnote text-ink-2">Símbolo</span>
            <SegmentedControl ariaLabel="Símbolo monetario (no convierte montos)" options={CURRENCIES} value={currency} onChange={setCurrency} size="sm" />
          </div>
          <span className="hidden sm:block w-px h-5 bg-line-strong" aria-hidden="true" />
          <SegmentedControl ariaLabel="Apariencia" options={THEMES} value={theme} onChange={setTheme} size="sm" />

          {/* En pantallas pequeñas el acceso al equipo está aquí */}
          <button
            type="button"
            onClick={onOpenTeamModal}
            className="lg:hidden h-8 w-8 grid place-items-center rounded-[9px] text-ink-2 bg-ink/[0.06] hover:bg-ink/10 hover:text-ink cursor-pointer transition-colors duration-150"
            aria-label="Equipo del proyecto"
            title="Equipo del proyecto"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
