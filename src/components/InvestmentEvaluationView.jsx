import React from 'react';
import StatusLabel from './ui/StatusLabel';
import { formatMoney, formatNumber, formatPercent, formatPayback, isNegativeAmount } from '../utils/format';

/**
 * El payback de los escenarios llega como texto ("2.12 años"). El motor devuelve 5
 * tanto si la inversión se recupera al cierre del año 5 como si no se recupera,
 * por eso ese caso se muestra como "5 años o más".
 */
function formatScenarioPayback(text) {
  const years = parseFloat(text);
  if (!Number.isFinite(years)) return { label: text, capped: false };
  if (years >= 5) return { label: '5 años o más', capped: true };
  return { label: `${formatNumber(years)} años`, capped: false };
}

export default function InvestmentEvaluationView({ investmentEvaluation, currencySymbol }) {
  const {
    wacc,
    initialCost,
    npv,
    irr,
    paybackYears,
    discountedPaybackYears,
    paybackRecovered,
    discountedPaybackRecovered,
    scenarios
  } = investmentEvaluation;
  const isViable = npv > 0 && irr > wacc;

  const criteria = [
    {
      name: 'Valor presente neto (VPN)',
      result: formatMoney(npv, currencySymbol),
      negative: isNegativeAmount(npv),
      rule: 'Mayor que cero',
      ok: npv > 0
    },
    {
      name: 'Tasa interna de retorno (TIR)',
      result: formatPercent(irr),
      rule: `Mayor que el WACC (${formatPercent(wacc)})`,
      ok: irr > wacc
    },
    {
      name: 'Período de recuperación simple',
      result: formatPayback(paybackYears, paybackRecovered),
      rule: 'Dentro del horizonte de 5 años',
      ok: paybackRecovered
    },
    {
      name: 'Período de recuperación descontado',
      result: formatPayback(discountedPaybackYears, discountedPaybackRecovered),
      rule: 'Dentro del horizonte de 5 años',
      ok: discountedPaybackRecovered
    }
  ];

  const scenarioRows = scenarios.map((sc) => ({ ...sc, paybackView: formatScenarioPayback(sc.payback) }));
  const anyCapped = scenarioRows.some((sc) => sc.paybackView.capped);

  return (
    <div className="space-y-6">
      {/* Dictamen */}
      <div
        className={`bg-white border border-slate-200 border-l-4 rounded-md px-5 py-4 ${
          isViable ? 'border-l-emerald-600' : 'border-l-rose-600'
        }`}
      >
        <div className={`text-sm font-semibold ${isViable ? 'text-emerald-800' : 'text-rose-800'}`}>
          {isViable ? 'Inversión recomendada' : 'Inversión no recomendada'}
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {isViable
            ? `Con una inversión de ${formatMoney(initialCost, currencySymbol)}, el proyecto genera un VPN de ${formatMoney(npv, currencySymbol)} y una TIR de ${formatPercent(irr)}, superior a la tasa exigida del ${formatPercent(wacc)}.`
            : `Con una inversión de ${formatMoney(initialCost, currencySymbol)}, el proyecto no alcanza la rentabilidad mínima exigida del ${formatPercent(wacc)}. Se recomienda revisar ventas, costos o el monto de inversión.`}
        </p>
      </div>

      {/* Criterios de decisión */}
      <section className="bg-white border border-slate-200 rounded-md">
        <header className="px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-sm font-semibold text-slate-900">Criterios de decisión</h2>
          <p className="text-xs text-slate-500">
            Inversión inicial {formatMoney(initialCost, currencySymbol)} · WACC {formatPercent(wacc)} · Horizonte 5 años
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2.5 px-5 text-left font-medium">Criterio</th>
                <th scope="col" className="py-2.5 px-4 text-right font-medium">Resultado</th>
                <th scope="col" className="py-2.5 px-4 text-left font-medium">Regla</th>
                <th scope="col" className="py-2.5 px-5 text-left font-medium">Evaluación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criteria.map((c) => (
                <tr key={c.name}>
                  <td className="py-3 px-5 text-slate-900 whitespace-nowrap">{c.name}</td>
                  <td
                    className={`py-3 px-4 text-right font-semibold whitespace-nowrap table-number ${
                      c.negative ? 'text-rose-700' : 'text-slate-900'
                    }`}
                  >
                    {c.result}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{c.rule}</td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <StatusLabel status={c.ok ? 'optimal' : 'danger'}>{c.ok ? 'Cumple' : 'No cumple'}</StatusLabel>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Escenarios */}
      <section className="bg-white border border-slate-200 rounded-md">
        <header className="px-5 py-3.5 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Análisis de escenarios</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sensibilidad del proyecto ante variaciones en las ventas proyectadas.</p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-600">
                <th scope="col" className="py-2.5 px-5 text-left font-medium">Escenario</th>
                <th scope="col" className="py-2.5 px-4 text-right font-medium">VPN</th>
                <th scope="col" className="py-2.5 px-4 text-right font-medium">TIR</th>
                <th scope="col" className="py-2.5 px-4 text-right font-medium">Recuperación</th>
                <th scope="col" className="py-2.5 px-4 text-left font-medium">Riesgo</th>
                <th scope="col" className="py-2.5 px-5 text-left font-medium">Decisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scenarioRows.map((sc) => (
                <tr key={sc.id} className="align-top">
                  <td className="py-3 px-5 min-w-[16rem]">
                    <div className="font-medium text-slate-900">{sc.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{sc.description}</div>
                  </td>
                  <td
                    className={`py-3 px-4 text-right whitespace-nowrap table-number ${
                      isNegativeAmount(sc.npv) ? 'text-rose-700' : 'text-slate-900'
                    }`}
                  >
                    {formatMoney(sc.npv, currencySymbol)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap table-number text-slate-900">{formatPercent(sc.irr)}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap table-number text-slate-900">
                    {sc.paybackView.label}
                    {sc.paybackView.capped && <sup className="text-slate-500">*</sup>}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{sc.risk}</td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <StatusLabel status={sc.viable ? 'optimal' : 'danger'}>{sc.viable ? 'Viable' : 'No viable'}</StatusLabel>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {anyCapped && (
          <p className="px-5 py-3 border-t border-slate-200 text-xs text-slate-500">
            * El cálculo se limita al horizonte de 5 años: la inversión se recupera al cierre del año 5 o no se recupera dentro del horizonte.
          </p>
        )}
      </section>
    </div>
  );
}
