import React, { useState } from 'react';
import { formatMoney, isNegativeAmount } from '../utils/format';

const STATEMENTS = [
  { id: 'income', label: 'Estado de resultados', title: 'Estado de resultados proyectado' },
  { id: 'cashflow', label: 'Flujo de caja', title: 'Flujo de caja libre proyectado' }
];

export default function FinancialStatementsView({ incomeStatement, cashFlow, currencySymbol }) {
  const [activeStatement, setActiveStatement] = useState('income');
  const [showFormulas, setShowFormulas] = useState(false);

  const current = STATEMENTS.find((s) => s.id === activeStatement);
  const data = activeStatement === 'income' ? incomeStatement : cashFlow;

  return (
    <div className="space-y-4">
      {/* Selector de estado y opciones */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-300">
        <div className="flex gap-6" role="tablist">
          {STATEMENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activeStatement === s.id}
              onClick={() => setActiveStatement(s.id)}
              className={`-mb-px pb-2.5 text-sm border-b-2 transition-colors cursor-pointer ${
                activeStatement === s.id
                  ? 'border-navy-800 text-navy-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 pb-2.5 text-sm text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showFormulas}
            onChange={(e) => setShowFormulas(e.target.checked)}
            className="rounded border-slate-300 text-navy-800 focus:ring-navy-600"
          />
          Mostrar fórmulas
        </label>
      </div>

      {/* Documento */}
      <section className="bg-white border border-slate-200 rounded-md">
        <header className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">{current.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cifras en {currencySymbol === 'Q' ? 'quetzales (Q)' : 'dólares ($)'} · Proyección anual a 5 años
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2.5 px-5 text-left font-medium min-w-[16rem]">Concepto</th>
                {showFormulas && (
                  <th scope="col" className="py-2.5 px-4 text-left font-medium min-w-[14rem]">Fórmula</th>
                )}
                {data.years.map((yr) => (
                  <th key={yr} scope="col" className="py-2.5 px-4 text-right font-medium whitespace-nowrap">
                    {yr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const rowClass = row.isTotal
                  ? 'font-semibold text-slate-900 border-t border-slate-400'
                  : row.isSubtotal
                  ? 'font-semibold text-slate-900 border-t border-slate-200'
                  : 'text-slate-700';
                return (
                  <tr key={row.id} className={`${rowClass} hover:bg-slate-50`}>
                    <td className={`py-2 px-5 ${!row.isTotal && !row.isSubtotal ? 'pl-8' : ''}`}>{row.label}</td>
                    {showFormulas && (
                      <td className="py-2 px-4 text-xs font-normal text-slate-500">{row.formula}</td>
                    )}
                    {row.values.map((val, idx) => (
                      <td
                        key={idx}
                        className={`py-2 px-4 text-right whitespace-nowrap table-number ${
                          isNegativeAmount(val) ? 'text-rose-700' : ''
                        } ${row.isTotal ? 'border-b-[3px] border-double border-slate-500' : ''}`}
                      >
                        {formatMoney(val, currencySymbol)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="px-5 py-3 border-t border-slate-200 text-xs text-slate-500">
          {activeStatement === 'income'
            ? 'Las líneas marcadas con (-) se restan. Las cifras entre paréntesis son negativas.'
            : 'Flujo libre = utilidad neta + depreciación ± variación del capital de trabajo. Las cifras entre paréntesis son salidas de efectivo.'}
        </footer>
      </section>
    </div>
  );
}
