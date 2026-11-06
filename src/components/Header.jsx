import React from 'react';
import { Users } from 'lucide-react';

const CURRENCIES = [
  { id: 'GTQ', label: 'Q' },
  { id: 'USD', label: '$' }
];

export default function Header({ title, companyData, currency, setCurrency, onOpenTeamModal }) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 truncate">
            {companyData.companyName}
            {companyData.sector ? ` · ${companyData.sector}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de símbolo monetario (no convierte montos) */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Moneda</span>
            <div className="inline-flex rounded border border-slate-300 overflow-hidden" role="group" aria-label="Símbolo monetario">
              {CURRENCIES.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCurrency(c.id)}
                  aria-pressed={currency === c.id}
                  title={c.id}
                  className={`px-3 py-1 text-sm font-medium cursor-pointer transition-colors ${
                    idx > 0 ? 'border-l border-slate-300' : ''
                  } ${currency === c.id ? 'bg-navy-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* En pantallas pequeñas el acceso al equipo está aquí */}
          <button
            type="button"
            onClick={onOpenTeamModal}
            className="lg:hidden p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
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
