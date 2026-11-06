import React, { useState } from 'react';
import SegmentedControl from './ui/SegmentedControl';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SegmentedControl
          mode="tabs"
          ariaLabel="Estado financiero"
          options={STATEMENTS}
          value={activeStatement}
          onChange={setActiveStatement}
        />
        <label className="flex items-center gap-2 text-[13px] text-ink-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showFormulas}
            onChange={(e) => setShowFormulas(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          Mostrar fórmulas
        </label>
      </div>

      {/* Documento */}
      <section className="bg-surface border border-line rounded-card shadow-card overflow-hidden" role="tabpanel" aria-label={current.title}>
        <header className="px-5 pt-4 pb-3.5">
          <h2 className="text-[15px] font-semibold text-ink">{current.title}</h2>
          <p className="text-[13px] text-ink-2 mt-0.5">
            Cifras en {currencySymbol === 'Q' ? 'quetzales (Q)' : 'dólares ($)'} · Proyección anual a 5 años
          </p>
        </header>

        <div className="overflow-x-auto border-t border-line">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-surface-2 text-ink-2">
                <th scope="col" className="sticky left-0 z-10 bg-surface-2 py-2.5 px-5 text-left text-xs font-medium min-w-[10.5rem] sm:min-w-[15rem]">
                  Concepto
                </th>
                {showFormulas && (
                  <th scope="col" className="py-2.5 px-4 text-left text-xs font-medium min-w-[14rem]">Fórmula</th>
                )}
                {data.years.map((yr) => (
                  <th key={yr} scope="col" className="py-2.5 px-4 text-right text-xs font-medium whitespace-nowrap">
                    {yr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const isHeading = row.isTotal || row.isSubtotal || row.isBold;
                const rowClass = row.isTotal
                  ? 'font-semibold text-ink border-t border-line-strong'
                  : row.isSubtotal
                  ? 'font-semibold text-ink border-t border-line'
                  : row.isBold
                  ? 'font-medium text-ink'
                  : 'text-ink';
                return (
                  <tr key={row.id} className={`group ${rowClass} transition-colors duration-100 hover:bg-surface-2`}>
                    <td
                      className={`sticky left-0 z-10 bg-surface group-hover:bg-surface-2 transition-colors duration-100 py-2.5 px-5 ${
                        isHeading ? '' : 'pl-9 text-ink-2'
                      }`}
                    >
                      {row.label}
                    </td>
                    {showFormulas && (
                      <td className="py-2.5 px-4 text-xs font-normal text-ink-2">{row.formula}</td>
                    )}
                    {row.values.map((val, idx) => (
                      <td
                        key={idx}
                        className={`py-2.5 px-4 text-right whitespace-nowrap table-number ${
                          isNegativeAmount(val) ? 'text-negative' : ''
                        } ${row.isTotal ? 'border-b-[3px] border-double border-ink-3' : ''}`}
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

        <footer className="px-5 py-3 border-t border-line text-xs text-ink-2">
          {activeStatement === 'income'
            ? 'Las líneas marcadas con (-) se restan. Las cifras entre paréntesis son negativas.'
            : 'Flujo libre = utilidad neta + depreciación ± variación del capital de trabajo. Las cifras entre paréntesis son salidas de efectivo.'}
        </footer>
      </section>
    </div>
  );
}
