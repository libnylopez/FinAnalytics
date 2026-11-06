import React from 'react';
import Panel from './ui/Panel';
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

const th = 'py-2.5 text-xs font-medium whitespace-nowrap';

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
  const money = (v) => formatMoney(v, currencySymbol);

  const criteria = [
    {
      name: 'Valor presente neto (VPN)',
      result: money(npv),
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
    <div className="space-y-5">
      {/* Dictamen y criterios de decisión */}
      <Panel
        title={isViable ? 'Inversión recomendada' : 'Inversión no recomendada'}
        description={
          isViable
            ? `Con una inversión de ${money(initialCost)}, el proyecto genera un VPN de ${money(npv)} y una TIR de ${formatPercent(irr)}, superior a la tasa exigida del ${formatPercent(wacc)}.`
            : `Con una inversión de ${money(initialCost)}, el proyecto no alcanza la rentabilidad mínima exigida del ${formatPercent(wacc)}. Se recomienda revisar ventas, costos o el monto de inversión.`
        }
        actions={
          <StatusLabel status={isViable ? 'optimal' : 'danger'} size="md">
            {isViable ? 'Viable' : 'No viable'}
          </StatusLabel>
        }
        bodyClassName="px-0 pb-0"
      >
        <div className="overflow-x-auto border-t border-line mt-1">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">Criterios de decisión</caption>
            <thead>
              <tr className="bg-surface-2 text-ink-2">
                <th scope="col" className={`${th} px-5 text-left`}>Criterio</th>
                <th scope="col" className={`${th} px-4 text-right`}>Resultado</th>
                <th scope="col" className={`${th} px-4 text-left`}>Regla</th>
                <th scope="col" className={`${th} px-5 text-left`}>Evaluación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {criteria.map((c) => (
                <tr key={c.name}>
                  <td className="py-3.5 px-5 text-ink whitespace-nowrap">{c.name}</td>
                  <td
                    className={`py-3.5 px-4 text-right text-[15px] font-semibold whitespace-nowrap table-number ${
                      c.negative ? 'text-negative' : 'text-ink'
                    }`}
                  >
                    {c.result}
                  </td>
                  <td className="py-3.5 px-4 text-ink-2 whitespace-nowrap">{c.rule}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <StatusLabel status={c.ok ? 'optimal' : 'danger'}>{c.ok ? 'Cumple' : 'No cumple'}</StatusLabel>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-3 border-t border-line text-xs text-ink-2">
          Inversión inicial {money(initialCost)} · WACC {formatPercent(wacc)} · Horizonte de 5 años
        </p>
      </Panel>

      {/* Escenarios */}
      <Panel
        title="Análisis de escenarios"
        description="Sensibilidad del proyecto ante variaciones en las ventas proyectadas."
        bodyClassName="px-0 pb-0"
      >
        <div className="overflow-x-auto border-t border-line mt-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-surface-2 text-ink-2">
                <th scope="col" className={`${th} px-5 text-left`}>Escenario</th>
                <th scope="col" className={`${th} px-4 text-right`}>VPN</th>
                <th scope="col" className={`${th} px-4 text-right`}>TIR</th>
                <th scope="col" className={`${th} px-4 text-right`}>Recuperación</th>
                <th scope="col" className={`${th} px-4 text-left`}>Riesgo</th>
                <th scope="col" className={`${th} px-5 text-left`}>Decisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {scenarioRows.map((sc) => (
                <tr key={sc.id} className="align-top transition-colors duration-100 hover:bg-surface-2/60">
                  <td className="py-3.5 px-5 min-w-[16rem]">
                    <div className="font-medium text-ink">{sc.name}</div>
                    <div className="text-xs text-ink-2 mt-0.5">{sc.description}</div>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right whitespace-nowrap table-number font-medium ${
                      isNegativeAmount(sc.npv) ? 'text-negative' : 'text-ink'
                    }`}
                  >
                    {money(sc.npv)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap table-number text-ink">{formatPercent(sc.irr)}</td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap table-number text-ink">
                    {sc.paybackView.label}
                    {sc.paybackView.capped && <sup className="text-ink-2">*</sup>}
                  </td>
                  <td className="py-3.5 px-4 text-ink-2 whitespace-nowrap">{sc.risk}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <StatusLabel status={sc.viable ? 'optimal' : 'danger'}>{sc.viable ? 'Viable' : 'No viable'}</StatusLabel>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {anyCapped && (
          <p className="px-5 py-3 border-t border-line text-xs text-ink-2">
            * El cálculo se limita al horizonte de 5 años: la inversión se recupera al cierre del año 5 o no se recupera dentro del horizonte.
          </p>
        )}
      </Panel>
    </div>
  );
}
