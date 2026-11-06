import React from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
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
    {
      label: 'Inversión inicial',
      value: money(initialCost),
      note: 'Activos fijos y capital de trabajo'
    },
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
    ['Tasa de descuento (WACC)', formatPercent(wacc)],
    ['ISR', formatPercent(Number(inputs.taxRate) || 0)]
  ];

  return (
    <div className="space-y-5">
      {/* Dictamen e indicadores de decisión */}
      <Panel
        title="Evaluación del proyecto"
        description={
          isViable
            ? `El VPN es positivo y la TIR (${formatPercent(irr)}) supera la tasa de descuento (${formatPercent(wacc)}).`
            : `El VPN no es positivo o la TIR (${formatPercent(irr)}) no supera la tasa de descuento (${formatPercent(wacc)}). Revise ventas, costos o el monto de inversión.`
        }
        actions={
          <StatusLabel status={isViable ? 'optimal' : 'danger'} size="md">
            {isViable ? 'Proyecto viable' : 'Proyecto no viable'}
          </StatusLabel>
        }
        bodyClassName="px-0 pb-0"
      >
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-line mt-1">
          {kpis.map((kpi, i) => (
            <div
              key={kpi.label}
              className={`px-5 py-5 border-line ${KPI_BORDERS[i]}`}
            >
              <dt className="text-[13px] text-ink-2">{kpi.label}</dt>
              <dd
                className={`mt-1.5 text-[26px] leading-8 font-semibold tracking-tight ${
                  kpi.negative ? 'text-negative' : 'text-ink'
                }`}
              >
                {kpi.value}
              </dd>
              <dd className="mt-2 flex items-center gap-1.5 text-xs text-ink-2">
                {kpi.ok !== undefined && <StatusIcon status={kpi.ok ? 'optimal' : 'danger'} className="w-3.5 h-3.5" />}
                <span>
                  {kpi.ok !== undefined && <span className="sr-only">{kpi.ok ? 'Cumple: ' : 'No cumple: '}</span>}
                  {kpi.note}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Perfil del flujo de caja */}
        <Panel
          className="lg:col-span-2"
          title="Flujo de caja libre"
          description={
            paybackRecovered
              ? `La inversión se recupera en ${formatPayback(paybackYears, true)}.`
              : 'La inversión no se recupera dentro del horizonte de 5 años.'
          }
          actions={
            <div className="flex items-center gap-4 text-xs text-ink-2" aria-hidden="true">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-chart-1" /> Flujo del año
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 rounded-full bg-chart-2" /> Acumulado
              </span>
            </div>
          }
          bodyClassName="px-3 pb-3"
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
          actions={
            <Button variant="plain" onClick={() => onNavigate('inputs')}>
              Editar
            </Button>
          }
        >
          <dl className="divide-y divide-line">
            {assumptions.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm first:pt-1">
                <dt className="text-ink-2">{label}</dt>
                <dd className="text-ink font-medium table-number">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      {/* Puntos de atención */}
      <Panel
        title="Puntos de atención"
        description={alertCount > 0 ? `${alertCount} ${alertCount === 1 ? 'observación' : 'observaciones'} por revisar` : undefined}
        actions={
          <Button variant="plain" onClick={() => onNavigate('ratios')}>
            Ver razones financieras <ChevronRight className="w-4 h-4" />
          </Button>
        }
        bodyClassName="px-0 pb-1"
      >
        {alertCount === 0 ? (
          <div className="flex items-center gap-3 px-5 pb-4 pt-1">
            <span className="w-9 h-9 rounded-full bg-positive/10 grid place-items-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-positive" aria-hidden="true" />
            </span>
            <p className="text-sm text-ink-2">
              Sin observaciones. Las 11 razones financieras están dentro de los rangos de referencia.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-t border-line">
            {validationAlerts.map((v, i) => (
              <li key={`v-${i}`} className="px-5 py-3 flex items-start justify-between gap-4">
                <span className="text-sm text-ink">{v.message}</span>
                <StatusLabel status={v.type}>{v.type === 'danger' ? 'Error en datos' : 'Revisar datos'}</StatusLabel>
              </li>
            ))}
            {ratioAlerts.map((r) => (
              <li key={r.code} className="px-5 py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-ink">
                    {r.name} <span className="text-ink-2">· {r.category}</span>
                  </div>
                  <div className="text-xs text-ink-2 mt-0.5">
                    Valor{' '}
                    <span className="table-number text-ink">
                      {r.unit === 'Q' ? formatMoneyString(r.value, currencySymbol) : r.value}
                    </span>{' '}
                    · Referencia {r.benchmark}
                  </div>
                </div>
                <StatusLabel status={r.status}>{r.statusLabel}</StatusLabel>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
