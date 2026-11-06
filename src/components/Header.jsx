import React, { useEffect, useState } from 'react';
import { Users, Monitor, Sun, Moon } from 'lucide-react';
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

/** Indica si la página se desplazó, para mostrar el borde inferior de la barra superior. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

export default function Header({ title, companyData, currency, setCurrency, theme, setTheme, onOpenTeamModal }) {
  const scrolled = useScrolled();

  return (
    <header
      className={`glass-bar relative lg:sticky lg:top-0 z-20 px-4 sm:px-8 pt-6 pb-4 lg:pt-7 lg:pb-5 print:hidden
        border-b transition-[border-color,box-shadow,background-color] duration-240 ${
          scrolled
            ? 'border-line lg:bg-canvas/80 lg:backdrop-blur-xl lg:backdrop-saturate-150 lg:shadow-[0_1px_12px_-6px_rgb(16_24_40/0.12)]'
            : 'border-transparent'
        }`}
    >
      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 key={title} className="font-display text-[26px] leading-8 sm:text-title font-bold text-ink animate-fade-in">
            {title}
          </h1>
          <p className="text-callout text-ink-2 mt-1.5 truncate">
            <span className="text-ink font-medium">{companyData.companyName}</span>
            {companyData.sector ? <span> · {companyData.sector}</span> : null}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 shrink-0">
          {/* Símbolo monetario: solo cambia el símbolo mostrado, no convierte cantidades */}
          <div className="flex items-center gap-2">
            <span className="text-footnote text-ink-2">Símbolo</span>
            <SegmentedControl
              ariaLabel="Símbolo monetario (no convierte montos)"
              options={CURRENCIES}
              value={currency}
              onChange={setCurrency}
            />
          </div>

          <span className="hidden sm:block w-px h-5 bg-line-strong" aria-hidden="true" />

          <SegmentedControl ariaLabel="Apariencia" options={THEMES} value={theme} onChange={setTheme} />

          {/* En pantallas pequeñas el acceso al equipo está aquí */}
          <button
            type="button"
            onClick={onOpenTeamModal}
            className="lg:hidden h-9 w-9 grid place-items-center rounded-[10px] text-ink-2 bg-ink/[0.06] hover:bg-ink/10 hover:text-ink cursor-pointer transition-colors duration-150"
            aria-label="Equipo del proyecto"
            title="Equipo del proyecto"
          >
            <Users className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
