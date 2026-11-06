import React from 'react';
import { Users, Monitor, Sun, Moon } from 'lucide-react';
import SegmentedControl from './ui/SegmentedControl';

const CURRENCIES = [
  { id: 'GTQ', label: 'Q', title: 'Mostrar cifras con el símbolo Q. No convierte montos.' },
  { id: 'USD', label: '$', title: 'Mostrar cifras con el símbolo $. No convierte montos.' }
];

const THEMES = [
  { id: 'system', label: 'Apariencia automática (según el sistema)', icon: Monitor, iconOnly: true },
  { id: 'light', label: 'Apariencia clara', icon: Sun, iconOnly: true },
  { id: 'dark', label: 'Apariencia oscura', icon: Moon, iconOnly: true }
];

export default function Header({ title, companyData, currency, setCurrency, theme, setTheme, onOpenTeamModal }) {
  return (
    <header className="px-4 sm:px-8 pt-6 sm:pt-8 pb-1 print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-ink leading-tight">{title}</h1>
          <p className="text-[13px] text-ink-2 mt-1 truncate">
            {companyData.companyName}
            {companyData.sector ? ` · ${companyData.sector}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Símbolo monetario: solo cambia el símbolo mostrado, no convierte cantidades */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-2">
              Símbolo
            </span>
            <SegmentedControl
              ariaLabel="Símbolo monetario (no convierte montos)"
              options={CURRENCIES}
              value={currency}
              onChange={setCurrency}
              size="sm"
            />
          </div>

          <SegmentedControl ariaLabel="Apariencia" options={THEMES} value={theme} onChange={setTheme} size="sm" />

          {/* En pantallas pequeñas el acceso al equipo está aquí */}
          <button
            type="button"
            onClick={onOpenTeamModal}
            className="lg:hidden h-7 w-8 grid place-items-center rounded-[7px] text-ink-2 hover:bg-ink/[0.06] hover:text-ink cursor-pointer transition-colors duration-150"
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
