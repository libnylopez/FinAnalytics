import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';
import StatusLabel, { StatusIcon } from './ui/StatusLabel';
import CashFlowChart from './CashFlowChart';
import { formatMoney, formatMoneyString, formatPercent, formatPayback, isNegativeAmount } from '../utils/format';

/* -------------------------------------------------------------------------- */
/* Piezas compartidas                                                          */
/* -------------------------------------------------------------------------- */

function Criterion({ ok, children }) {
  return (
    <div className="flex items-center gap-1.5 text-footnote text-ink-2">
      {ok !== undefined && <StatusIcon status={ok ? 'optimal' : 'danger'} className="w-4 h-4" />}
      <span>
        {ok !== undefined && <span className="sr-only">{ok ? 'Cumple: ' : 'No cumple: '}</span>}
        {children}
      </span>
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="flex items-center gap-4 text-footnote text-ink-2" aria-hidden="true">
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-[3px] bg-chart-1" /> Flujo del año
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-4 h-[2px] rounded-full bg-chart-2" /> Acumulado
      </span>
    </div>
  );
}

/** Puntos de atención ordenados por relevancia: errores de datos, luego críticos, luego observaciones. */
function Attention({ validationAlerts, ratioAlerts, currencySymbol, onNavigate, compact = false }) {
  const rank = { danger: 0, warning: 1 };
  const items = [
    ...validationAlerts.map((v, i) => ({ key: `v-${i}`, status: v.type, title: v.message, label: v.type === 'danger' ? 'Error en datos' : 'Revisar datos' })),
    ...ratioAlerts.map((r) => ({
      key: r.code,
      status: r.status,
      title: r.name,
      detail: `${r.category} · Valor ${r.unit === 'Q' ? formatMoneyString(r.value, currencySymbol) : r.value} · Referencia ${r.benchmark}`,
      label: r.statusLabel
    }))
  ].sort((a, b) => rank[a.status] - rank[b.status]);

  if (items.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2.5 text-callout text-ink-2">
          <CheckCircle2 className="w-[18px] h-[18px] text-positive shrink-0" strokeWidth={2.2} aria-hidden="true" />
          <span>
            <span className="font-semibold text-ink">Sin puntos de atención.</span> Las 11 razones financieras están dentro de los rangos de referencia.
          </span>
        </p>
        <Button variant="plain" onClick={() => onNavigate('ratios')} className="group">
          Ver razones financieras
          <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <h2 className="font-display text-headline font-bold text-ink">
          {items.length} {items.length === 1 ? 'punto de atención' : 'puntos de atención'}
        </h2>
        <Button variant="plain" onClick={() => onNavigate('ratios')} className="group">
          Ver razones financieras
          <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
        </Button>
      </div>
      <ul className="divide-y divide-line border-y border-line">
        {items.slice(0, compact ? 4 : items.length).map((it) => (
          <li key={it.key} className="py-3 flex items-center justify-between gap-4 animate-rise-in">
            <div className="min-w-0">
              <div className="text-callout font-medium text-ink">{it.title}</div>
              {it.detail && <div className="text-footnote text-ink-2 mt-0.5">{it.detail}</div>}
            </div>
            <StatusLabel status={it.status}>{it.label}</StatusLabel>
          </li>
        ))}
      </ul>
      {compact && items.length > 4 && <p className="text-footnote text-ink-2 mt-2">y {items.length - 4} más en Razones financieras.</p>}
    </div>
  );
}

/** Supuestos: franja compacta y secundaria (no compite con los indicadores). */
function Assumptions({ rows, onNavigate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="eyebrow">Supuestos del análisis</div>
        <Button variant="plain" onClick={() => onNavigate('inputs')}>Editar</Button>
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-line border border-line rounded-[14px] overflow-hidden">
        {rows.map(([label, value]) => (
          <div key={label} className="bg-surface px-4 py-3">
            <dt className="text-footnote text-ink-2">{label}</dt>
            <dd className="text-callout font-semibold text-ink table-number mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Resumen                                                                     */
/* -------------------------------------------------------------------------- */

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

  const ratioAlerts = ratios.filter((r) => r.status !== 'optimal');
  const validationAlerts = validations.filter((v) => v.type !== 'success');

  // Titulares construidos solo con resultados del motor
  // La cifra nunca se parte entre líneas
  const headline = isViable ? (
    <>
      El proyecto es viable y crea <span className="whitespace-nowrap">{money(npv)}</span> de valor.
    </>
  ) : (
    'El proyecto no alcanza la rentabilidad exigida.'
  );
  const narrative = isViable
    ? `Con una inversión de ${money(initialCost)}, la TIR de ${formatPercent(irr)} supera la tasa de descuento de ${formatPercent(wacc)}${
        paybackRecovered ? ` y la inversión se recupera en ${formatPayback(paybackYears, true)}` : ''
      }.`
    : `Con una inversión de ${money(initialCost)}, el VPN es de ${money(npv)} y la TIR de ${formatPercent(irr)} no supera la tasa de descuento de ${formatPercent(wacc)}. Revise ventas, costos o el monto de inversión.`;
  const positiveYear = cashFlow.cumulativeCashFlow.findIndex((v) => v >= 0);
  const chartHeadline =
    positiveYear > 0
      ? `El flujo acumulado se vuelve positivo en el año ${positiveYear}.`
      : 'El flujo acumulado no se vuelve positivo en el horizonte de 5 años.';
  const today = new Date().toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });

  const metrics = {
    npv: { label: 'Valor presente neto', value: money(npv), negative: isNegativeAmount(npv), ok: npv > 0, note: npv > 0 ? 'Positivo: crea valor' : 'No es positivo' },
    irr: {
      label: 'Tasa interna de retorno',
      value: formatPercent(irr),
      ok: irr > wacc,
      note: irr > wacc ? `Supera el WACC de ${formatPercent(wacc)}` : `No supera el WACC de ${formatPercent(wacc)}`
    },
    payback: {
      label: 'Período de recuperación',
      value: paybackRecovered ? formatPayback(paybackYears, true) : 'No se recupera',
      ok: paybackRecovered,
      note: paybackRecovered ? 'Dentro del horizonte de 5 años' : 'Fuera del horizonte de 5 años'
    },
    investment: { label: 'Inversión inicial', value: money(initialCost), note: 'Activos fijos y capital de trabajo' }
  };

  const assumptions = [
    ['Ventas año 1', money(Number(inputs.salesY1) || 0)],
    ['Ventas año 5', money(Number(inputs.salesY5) || 0)],
    ['Costo de ventas', formatPercent(Number(inputs.costPercentage) || 0)],
    ['Préstamo bancario', money(inputs.bankDebt)],
    ['Tasa de descuento', formatPercent(wacc)],
    ['ISR', formatPercent(Number(inputs.taxRate) || 0)]
  ];

  const chart = (
    <CashFlowChart
      years={cashFlow.years}
      annual={cashFlow.freeCashFlow}
      cumulative={cashFlow.cumulativeCashFlow}
      paybackYears={paybackYears}
      paybackRecovered={paybackRecovered}
      symbol={currencySymbol}
    />
  );
  const verdict = (
    <StatusLabel status={isViable ? 'optimal' : 'danger'} size="md">
      {isViable ? 'Proyecto viable' : 'Proyecto no viable'}
    </StatusLabel>
  );
  const toEvaluation = (
    <Button variant="secondary" size="sm" onClick={() => onNavigate('evaluation')} className="group">
      Ver evaluación
      <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
    </Button>
  );
  const shared = { validationAlerts, ratioAlerts, currencySymbol, onNavigate };

  // Composición «Informe editorial»: titular con la conclusión, franja de decisión,
  // flujo de caja como sección con su propia conclusión, supuestos y puntos de atención.
  const order = ['npv', 'irr', 'payback', 'investment'];
  return (
    <div className="space-y-14">
      <header>
        <div className="eyebrow">Dictamen · {inputs.sector} · {today}</div>
        <h1 className="mt-4 font-display text-[34px] leading-[40px] sm:text-[46px] sm:leading-[52px] font-semibold tracking-[-0.035em] text-ink text-balance max-w-4xl">
          {headline}
        </h1>
        <p className="mt-4 text-[17px] leading-7 text-ink-2 max-w-3xl text-pretty">{narrative}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {verdict}
          {toEvaluation}
        </div>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-line rounded-[16px] overflow-hidden">
        {order.map((k, i) => {
          const m = metrics[k];
          return (
            <div
              key={k}
              className={`px-5 py-5 border-line ${i > 0 ? 'border-t sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:border-l' : ''} ${
                i >= 2 ? 'sm:border-t lg:border-t-0' : ''
              } ${i === 2 ? 'lg:border-l' : ''} ${k === 'npv' ? 'bg-accent/[0.035]' : ''}`}
            >
              <dt className="eyebrow">{m.label}</dt>
              <dd className={`mt-3 font-display text-[30px] leading-9 font-semibold tracking-[-0.03em] whitespace-nowrap ${m.negative ? 'text-negative' : 'text-ink'}`}>
                {m.value}
              </dd>
              <dd className="mt-2.5">
                <Criterion ok={m.ok}>{m.note}</Criterion>
              </dd>
            </div>
          );
        })}
      </dl>

      <section className="border-t border-line pt-10" aria-labelledby="cf-title">
        <div className="eyebrow">Flujo de caja libre</div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 id="cf-title" className="font-display text-[26px] leading-8 sm:text-[30px] sm:leading-9 font-semibold tracking-[-0.025em] text-ink max-w-2xl">
            {chartHeadline}
          </h2>
          <ChartLegend />
        </div>
        <div className="mt-6 -mx-2">{chart}</div>
      </section>

      <section className="border-t border-line pt-10">
        <Assumptions rows={assumptions} onNavigate={onNavigate} />
      </section>

      <section className="border-t border-line pt-8">
        <Attention {...shared} />
      </section>
    </div>
  );
}
