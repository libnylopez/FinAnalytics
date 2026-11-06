import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import StatusLabel from './ui/StatusLabel';
import Disclosure from './ui/Disclosure';
import { formatMoneyString } from '../utils/format';

const CATEGORIES = ['Liquidez', 'Rentabilidad', 'Endeudamiento'];

export default function RatiosDashboardView({ ratios, currencySymbol }) {
  const [openFormulas, setOpenFormulas] = useState({});

  const toggleFormula = (code) => setOpenFormulas((prev) => ({ ...prev, [code]: !prev[code] }));

  const counts = {
    optimal: ratios.filter((r) => r.status === 'optimal').length,
    warning: ratios.filter((r) => r.status === 'warning').length,
    danger: ratios.filter((r) => r.status === 'danger').length
  };

  const displayValue = (r) => {
    if (r.unit === 'Q') return formatMoneyString(r.value, currencySymbol);
    if (r.unit === 'veces') return `${r.value} veces`;
    return r.value;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[13px] text-ink-2">Calculadas con las cifras proyectadas del año 1.</p>
        <div className="flex flex-wrap items-center gap-2">
          {/* Solo se muestran los estados presentes */}
          {counts.optimal > 0 && <StatusLabel status="optimal">{counts.optimal} adecuadas</StatusLabel>}
          {counts.warning > 0 && <StatusLabel status="warning">{counts.warning} en observación</StatusLabel>}
          {counts.danger > 0 && <StatusLabel status="danger">{counts.danger} críticas</StatusLabel>}
        </div>
      </div>

      <section className="bg-surface border border-line rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-ink-2 border-b border-line">
                <th scope="col" className="py-3 px-5 text-left text-xs font-medium">Razón</th>
                <th scope="col" className="py-3 px-4 text-right text-xs font-medium whitespace-nowrap">Valor</th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium whitespace-nowrap">Referencia</th>
                <th scope="col" className="py-3 px-5 text-left text-xs font-medium whitespace-nowrap">Diagnóstico</th>
              </tr>
            </thead>
            {CATEGORIES.map((category) => (
              <tbody key={category}>
                <tr className="bg-surface-2 border-b border-line">
                  <th colSpan={4} scope="colgroup" className="py-2 px-5 text-left text-[13px] font-semibold text-ink">
                    {category}
                  </th>
                </tr>
                {ratios
                  .filter((r) => r.category === category)
                  .map((r) => {
                    const open = !!openFormulas[r.code];
                    return (
                      <tr key={r.code} className="border-b border-line last:border-b-0 align-top transition-colors duration-100 hover:bg-surface-2/60">
                        <td className="py-3.5 px-5 min-w-[18rem]">
                          <div className="font-medium text-ink">{r.name}</div>
                          <p className="text-xs text-ink-2 mt-0.5 max-w-xl leading-relaxed">{r.interpretation}</p>
                          <button
                            type="button"
                            onClick={() => toggleFormula(r.code)}
                            aria-expanded={open}
                            aria-controls={`formula-${r.code}`}
                            className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-accent hover:text-accent/80 cursor-pointer transition-colors duration-150 rounded"
                          >
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${open ? 'rotate-90' : ''}`}
                              aria-hidden="true"
                            />
                            Fórmula
                          </button>
                          <Disclosure open={open} id={`formula-${r.code}`}>
                            <div className="mt-2 inline-block text-xs text-ink bg-surface-2 border border-line rounded-md px-2.5 py-1.5">
                              {r.formula}
                            </div>
                          </Disclosure>
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-ink whitespace-nowrap table-number">
                          {displayValue(r)}
                        </td>
                        <td className="py-3.5 px-4 text-ink-2 whitespace-nowrap">{r.benchmark}</td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <StatusLabel status={r.status}>{r.statusLabel}</StatusLabel>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <p className="text-xs text-ink-2">
        El balance general de referencia (activos, pasivos y patrimonio) se estima a partir de los datos ingresados.
      </p>
    </div>
  );
}
