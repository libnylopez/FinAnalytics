import React from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import Panel from './ui/Panel';
import Button from './ui/Button';
import StatusLabel, { StatusIcon } from './ui/StatusLabel';
import CashFlowChart from './CashFlowChart';
import { formatMoney, formatMoneyString, formatPercent, formatPayback, isNegativeAmount } from '../utils/format';

// Separadores de la cuadrícula de indicadores: 1 columna (móvil), 2 (tableta) y 4 (escritorio)
const KPI_BORDERS = [
  '',
  'border-t sm:border-t-0 sm:border-l',
  'border-t lg:border-t-0 lg:border-l',
  'border-t sm:border-l lg:border-t-0'
];

export default function DashboardOverview({
  inputs,
  ratios,
  cashFlow,
  validations,
  investmentEvaluation,
  currencySymbol,
  onNavigate
}) {
  const { initialCost, npv, irr, wacc, paybackYears, paybackRecovered } = investmentEvaluation;
  const isViable = npv > 0 && irr > wacc;
  const money = (v) => formatMoney(v, currencySymbol);

  // Puntos de atención: razones fuera de rango y observaciones de la validación
  const ratioAlerts = ratios.filter((r) => r.status !== 'optimal');
  const validationAlerts = validations.filter((v) => v.type !== 'success');
  const alertCount = ratioAlerts.length + validationAlerts.length;

  // Cada indicador muestra su criterio de decisión: el icono y el texto dicen si se cumple.
  const kpis = [
    { label: 'Inversión inicial', value: money(initialCost), note: 'Activos fijos y capital de trabajo' },
    {
      label: 'Valor presente neto',
      value: money(npv),
      negative: isNegativeAmount(npv),
      ok: npv > 0,
      note: npv > 0 ? 'Positivo: crea valor' : 'No es positivo'
    },
    {
      label: 'Tasa interna de retorno',
      value: formatPercent(irr),
      ok: irr > wacc,
      note: irr > wacc ? `Supera el WACC de ${formatPercent(wacc)}` : `No supera el WACC de ${formatPercent(wacc)}`
    },
    {
      label: 'Período de recuperación',
      // Texto corto en la tarjeta; el criterio de abajo indica el horizonte
      value: paybackRecovered ? formatPayback(paybackYears, true) : 'No se recupera',
      ok: paybackRecovered,
      note: paybackRecovered ? 'Dentro del horizonte de 5 años' : 'Fuera del horizonte de 5 años'
    }
  ];

  const assumptions = [
    ['Ventas año 1', money(Number(inputs.salesY1) || 0)],
    ['Ventas año 5', money(Number(inputs.salesY5) || 0)],
    ['Costo de ventas', formatPercent(Number(inputs.costPercentage) || 0)],
    ['Préstamo bancario', money(inputs.bankDebt)],
    ['Tasa de descuento', formatPercent(wacc)],
    ['ISR', formatPercent(Number(inputs.taxRate) || 0)]
  ];

  const VerdictIcon = isViable ? CheckCircle2 : XCircle;

  return (
    <div className="space-y-6">
      {/* Dictamen e indicadores de decisión */}
      <section className="bg-surface border border-line rounded-card shadow-card overflow-hidden" aria-labelledby="verdict-title">
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4 min-w-0">
            <span
              className={`w-11 h-11 rounded-full grid place-items-center shrink-0 ${
                isViable ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
              }`}
            >
              <VerdictIcon className="w-[22px] h-[22px]" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="text-footnote font-medium text-ink-2">Dictamen de viabilidad</div>
              <h2 id="verdict-title" className="font-display text-[20px] leading-7 font-bold tracking-[-0.015em] text-ink">
                {isViable ? 'Proyecto viable' : 'Proyecto no viable'}
              </h2>
              <p className="text-callout text-ink-2 mt-0.5">
                {isViable
                  ? `El VPN es positivo y la TIR (${formatPercent(irr)}) supera la tasa de descuento (${formatPercent(wacc)}).`
                  : `El VPN no es positivo o la TIR (${formatPercent(irr)}) no supera la tasa de descuento (${formatPercent(wacc)}).`}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('evaluation')} className="group">
            Ver evaluación
            <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
          </Button>
        </header>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-line">
          {kpis.map((kpi, i) => (
            <div key={kpi.label} className={`px-6 pt-5 pb-6 border-line ${KPI_BORDERS[i]}`}>
              <dt className="text-footnote font-medium text-ink-2">{kpi.label}</dt>
              <dd className={`mt-2 font-display text-figure font-bold ${kpi.negative ? 'text-negative' : 'text-ink'}`}>
                {kpi.value}
              </dd>
              <dd className="mt-2.5 flex items-center gap-1.5 text-footnote text-ink-2">
                {kpi.ok !== undefined && <StatusIcon status={kpi.ok ? 'optimal' : 'danger'} className="w-4 h-4" />}
                <span>
                  {kpi.ok !== undefined && <span className="sr-only">{kpi.ok ? 'Cumple: ' : 'No cumple: '}</span>}
                  {kpi.note}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil del flujo de caja */}
        <Panel
          className="lg:col-span-2"
          title="Flujo de caja libre"
          description={
            paybackRecovered
              ? `La inversión se recupera en ${formatPayback(paybackYears, true)} dentro del horizonte de 5 años.`
              : 'La inversión no se recupera dentro del horizonte de 5 años.'
          }
          actions={
            <div className="flex items-center gap-4 text-footnote text-ink-2 pt-1" aria-hidden="true">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-chart-1" /> Flujo del año
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-[2px] rounded-full bg-chart-2" /> Acumulado
              </span>
            </div>
          }
          bodyClassName="px-3 pb-4"
        >
          <CashFlowChart
            years={cashFlow.years}
            annual={cashFlow.freeCashFlow}
            cumulative={cashFlow.cumulativeCashFlow}
            paybackYears={paybackYears}
            paybackRecovered={paybackRecovered}
            symbol={currencySymbol}
          />
        </Panel>

        {/* Supuestos del análisis */}
        <Panel
          title="Supuestos"
          description="Datos que alimentan el análisis"
          actions={
            <Button variant="plain" onClick={() => onNavigate('inputs')}>
              Editar
            </Button>
          }
        >
          <dl className="divide-y divide-line">
            {assumptions.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-0">
                <dt className="text-callout text-ink-2">{label}</dt>
                <dd className="text-callout text-ink font-semibold table-number">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      {/* Puntos de atención: una sola línea cuando no hay observaciones */}
      {alertCount === 0 ? (
        <section className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-line rounded-card shadow-card px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-positive/10 grid place-items-center shrink-0">
              <CheckCircle2 className="w-[18px] h-[18px] text-positive" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <p className="text-callout text-ink-2">
              <span className="font-semibold text-ink">Sin puntos de atención.</span> Las 11 razones financieras están dentro de los rangos de referencia.
            </p>
          </div>
          <Button variant="plain" onClick={() => onNavigate('ratios')} className="group">
            Ver razones financieras
            <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
          </Button>
        </section>
      ) : (
        <Panel
          title="Puntos de atención"
          description={`${alertCount} ${alertCount === 1 ? 'observación' : 'observaciones'} por revisar`}
          actions={
            <Button variant="plain" onClick={() => onNavigate('ratios')} className="group">
              Ver razones financieras
              <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
            </Button>
          }
          bodyClassName="pb-1"
        >
          <ul className="divide-y divide-line border-t border-line">
            {validationAlerts.map((v, i) => (
              <li key={`v-${i}`} className="px-6 py-3.5 flex items-start justify-between gap-4 animate-rise-in">
                <span className="text-callout text-ink">{v.message}</span>
                <StatusLabel status={v.type}>{v.type === 'danger' ? 'Error en datos' : 'Revisar datos'}</StatusLabel>
              </li>
            ))}
            {ratioAlerts.map((r) => (
              <li key={r.code} className="px-6 py-3.5 flex items-center justify-between gap-4 animate-rise-in">
                <div className="min-w-0">
                  <div className="text-callout font-medium text-ink">
                    {r.name} <span className="font-normal text-ink-2">· {r.category}</span>
                  </div>
                  <div className="text-footnote text-ink-2 mt-0.5">
                    Valor{' '}
                    <span className="table-number font-medium text-ink">
                      {r.unit === 'Q' ? formatMoneyString(r.value, currencySymbol) : r.value}
                    </span>{' '}
                    · Referencia {r.benchmark}
                  </div>
                </div>
                <StatusLabel status={r.status}>{r.statusLabel}</StatusLabel>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
