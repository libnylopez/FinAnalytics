import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import StatusLabel from './ui/StatusLabel';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
        <p className="text-slate-600">Calculadas con las cifras proyectadas del año 1.</p>
        <div className="flex flex-wrap items-center gap-4">
          <StatusLabel status="optimal">{counts.optimal} adecuadas</StatusLabel>
          <StatusLabel status="warning">{counts.warning} en observación</StatusLabel>
          <StatusLabel status="danger">{counts.danger} críticas</StatusLabel>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-md overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-300 text-slate-600">
              <th scope="col" className="py-2.5 px-5 text-left font-medium">Razón</th>
              <th scope="col" className="py-2.5 px-4 text-right font-medium whitespace-nowrap">Valor</th>
              <th scope="col" className="py-2.5 px-4 text-left font-medium whitespace-nowrap">Referencia</th>
              <th scope="col" className="py-2.5 px-5 text-left font-medium whitespace-nowrap">Diagnóstico</th>
            </tr>
          </thead>
          {CATEGORIES.map((category) => (
            <tbody key={category}>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th colSpan={4} scope="colgroup" className="py-2 px-5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {category}
                </th>
              </tr>
              {ratios
                .filter((r) => r.category === category)
                .map((r) => (
                  <React.Fragment key={r.code}>
                    <tr className="border-b border-slate-100 align-top">
                      <td className="py-3 px-5 min-w-[18rem]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-slate-900">{r.name}</div>
                            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">{r.interpretation}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFormula(r.code)}
                            aria-expanded={!!openFormulas[r.code]}
                            className="shrink-0 inline-flex items-center gap-0.5 text-xs text-navy-700 hover:text-navy-900 cursor-pointer"
                          >
                            {openFormulas[r.code] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            Fórmula
                          </button>
                        </div>
                        {openFormulas[r.code] && (
                          <div className="mt-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5">
                            {r.formula}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900 whitespace-nowrap table-number">
                        {displayValue(r)}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{r.benchmark}</td>
                      <td className="py-3 px-5 whitespace-nowrap">
                        <StatusLabel status={r.status}>{r.statusLabel}</StatusLabel>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          ))}
        </table>
      </section>

      <p className="text-xs text-slate-500">
        El balance general de referencia (activos, pasivos y patrimonio) se estima a partir de los datos ingresados.
      </p>
    </div>
  );
}
