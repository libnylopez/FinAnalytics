import React from 'react';
import { ChevronRight } from 'lucide-react';
import Panel from './ui/Panel';
import Button from './ui/Button';
import StatusLabel from './ui/StatusLabel';
import { formatMoney, formatMoneyString, formatPercent, formatPayback, isNegativeAmount } from '../utils/format';

export default function DashboardOverview({
  inputs,
  ratios,
  validations,
  investmentEvaluation,
  currencySymbol,
  onNavigate
}) {
  const { initialCost, npv, irr, wacc, paybackYears, paybackRecovered } = investmentEvaluation;
  const isViable = npv > 0 && irr > wacc;

  // Puntos de atención: razones fuera de rango y observaciones de la validación
  const ratioAlerts = ratios.filter((r) => r.status !== 'optimal');
  const validationAlerts = validations.filter((v) => v.type !== 'success');

  const kpis = [
    {
      label: 'Inversión inicial',
      value: formatMoney(initialCost, currencySymbol),
      detail: 'Activos fijos y capital de trabajo'
    },
    {
      label: 'Valor presente neto (VPN)',
      value: formatMoney(npv, currencySymbol),
      tone: npv > 0 ? 'text-emerald-700' : isNegativeAmount(npv) ? 'text-rose-700' : 'text-slate-900',
      detail: `Descontado al ${formatPercent(wacc)}`
    },
    {
      label: 'Tasa interna de retorno (TIR)',
      value: formatPercent(irr),
      tone: irr > wacc ? 'text-emerald-700' : 'text-rose-700',
      detail: `WACC ${formatPercent(wacc)}`
    },
    {
      label: 'Período de recuperación',
      value: formatPayback(paybackYears, paybackRecovered),
      tone: paybackRecovered ? 'text-slate-900' : 'text-rose-700',
      detail: 'Horizonte de evaluación: 5 años'
    }
  ];

  const sales = [inputs.salesY1, inputs.salesY5].map((v) => Number(v) || 0);

  return (
    <div className="space-y-6">
      {/* Indicadores principales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-md overflow-hidden">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white px-5 py-4">
            <div className="text-xs font-medium text-slate-500">{kpi.label}</div>
            <div className={`mt-1.5 text-xl font-semibold table-number ${kpi.tone || 'text-slate-900'}`}>{kpi.value}</div>
            <div className="mt-1 text-xs text-slate-500">{kpi.detail}</div>
          </div>
        ))}
      </section>

      {/* Dictamen */}
      <div
        className={`bg-white border border-slate-200 border-l-4 rounded-md px-5 py-4 ${
          isViable ? 'border-l-emerald-600' : 'border-l-rose-600'
        }`}
      >
        <div className={`text-sm font-semibold ${isViable ? 'text-emerald-800' : 'text-rose-800'}`}>
          {isViable ? 'El proyecto es financieramente viable' : 'El proyecto no es viable en las condiciones actuales'}
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {isViable
            ? `El VPN es positivo y la TIR (${formatPercent(irr)}) supera la tasa de descuento (${formatPercent(wacc)}).`
            : `El VPN no es positivo o la TIR (${formatPercent(irr)}) no supera la tasa de descuento (${formatPercent(wacc)}). Revise ventas, costos o el monto de inversión.`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Puntos de atención */}
        <Panel
          title="Puntos de atención"
          className="lg:col-span-2"
          bodyClassName=""
          actions={
            <Button variant="link" onClick={() => onNavigate('ratios')}>
              Ver razones financieras <ChevronRight className="w-4 h-4" />
            </Button>
          }
        >
          {ratioAlerts.length === 0 && validationAlerts.length === 0 ? (
            <p className="px-5 py-4 text-sm text-slate-600">
              No hay observaciones: las 11 razones financieras están dentro de los rangos de referencia.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {validationAlerts.map((v, i) => (
                <li key={`v-${i}`} className="px-5 py-3 flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-700">{v.message}</span>
                  <StatusLabel status={v.type} className="shrink-0">
                    {v.type === 'danger' ? 'Error en datos' : 'Revisar datos'}
                  </StatusLabel>
                </li>
              ))}
              {ratioAlerts.map((r) => (
                <li key={r.code} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-800">
                      {r.name} <span className="text-slate-500">({r.category})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Valor: <span className="table-number">{r.unit === 'Q' ? formatMoneyString(r.value, currencySymbol) : r.value}</span> · Referencia: {r.benchmark}
                    </div>
                  </div>
                  <StatusLabel status={r.status} className="shrink-0">{r.statusLabel}</StatusLabel>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Supuestos del análisis */}
        <Panel
          title="Supuestos del análisis"
          actions={
            <Button variant="link" onClick={() => onNavigate('inputs')}>
              Editar
            </Button>
          }
        >
          <dl className="space-y-2.5 text-sm">
            {[
              ['Ventas año 1', formatMoney(sales[0], currencySymbol)],
              ['Ventas año 5', formatMoney(sales[1], currencySymbol)],
              ['Costo de ventas', formatPercent(Number(inputs.costPercentage) || 0)],
              ['Préstamo bancario', formatMoney(inputs.bankDebt, currencySymbol)],
              ['Tasa de descuento (WACC)', formatPercent(wacc)],
              ['ISR', formatPercent(Number(inputs.taxRate) || 0)]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-slate-900 font-medium table-number">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}
