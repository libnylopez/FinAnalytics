import React from 'react';
import { FileSpreadsheet, Printer } from 'lucide-react';
import Button from './ui/Button';
import { exportToCSV } from '../utils/financialEngine';
import { formatMoney, formatPercent, formatPayback } from '../utils/format';

const TEAM = [
  { name: 'Natán Saquic', role: 'Líder de proyecto', area: 'Backend y lógica financiera' },
  { name: 'Danilo Bulux', role: 'Desarrollador principal', area: 'Frontend y experiencia de usuario' },
  { name: 'Alexis Rosales', role: 'Desarrollador', area: 'Módulo de reportes y exportación' },
  { name: 'Elian Rosales', role: 'Control de calidad', area: 'QA y modelado de datos' }
];

function SectionTitle({ number, children }) {
  return (
    <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-300 pb-1.5 mb-3">
      {number}. {children}
    </h2>
  );
}

export default function ReportsView({
  inputs,
  incomeStatement,
  cashFlow,
  ratios,
  investmentEvaluation,
  currencySymbol
}) {
  const {
    npv,
    irr,
    wacc,
    initialCost,
    paybackYears,
    discountedPaybackYears,
    paybackRecovered,
    discountedPaybackRecovered,
    scenarios
  } = investmentEvaluation;
  const isViable = npv > 0 && irr > wacc;
  const pessimistic = scenarios.find((s) => s.id === 'pessimistic');
  const money = (v) => formatMoney(v, currencySymbol);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = exportToCSV(
      inputs,
      incomeStatement,
      cashFlow,
      ratios,
      investmentEvaluation,
      currencySymbol
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FinAnalytics_${inputs.companyName.replace(/\s+/g, '_')}_Reporte.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const indicators = [
    ['Valor presente neto (VPN)', money(npv), 'Mayor que cero', npv > 0],
    ['Tasa interna de retorno (TIR)', formatPercent(irr), `Mayor que el WACC (${formatPercent(wacc)})`, irr > wacc],
    ['Período de recuperación simple', formatPayback(paybackYears, paybackRecovered), 'Dentro de 5 años', paybackRecovered],
    ['Período de recuperación descontado', formatPayback(discountedPaybackYears, discountedPaybackRecovered), 'Dentro de 5 años', discountedPaybackRecovered]
  ];

  const ratioAlerts = ratios.filter((r) => r.status !== 'optimal');

  return (
    <div className="space-y-4">
      {/* Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-slate-600">Vista previa del dictamen. Use “Imprimir / PDF” y elija “Guardar como PDF”.</p>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportCSV}>
            <FileSpreadsheet className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button variant="primary" onClick={handleDownloadPDF}>
            <Printer className="w-4 h-4" />
            Imprimir / PDF
          </Button>
        </div>
      </div>

      {/* Documento */}
      <article className="bg-white border border-slate-200 rounded-md max-w-4xl mx-auto px-6 py-8 sm:px-12 sm:py-10 text-slate-800 space-y-8 print:border-0 print:p-0 print:max-w-none">
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-800 pb-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">FinAnalytics</div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Dictamen financiero</h1>
          </div>
          <div className="text-xs text-slate-600 sm:text-right leading-relaxed">
            <div>Universidad del Valle de Guatemala · Campus Sololá</div>
            <div>Contabilidad Financiera</div>
            <div>Fecha: {new Date().toLocaleDateString('es-GT')}</div>
          </div>
        </header>

        {/* Datos generales */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {[
            ['Empresa', inputs.companyName],
            ['NIT', inputs.nit],
            ['Sector', inputs.sector],
            ['Ubicación', inputs.location],
            ['Inversión inicial', money(initialCost)],
            ['Tasa de descuento (WACC)', `${formatPercent(wacc)} anual`]
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-1.5">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900 text-right table-number">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="avoid-break">
          <SectionTitle number={1}>Dictamen</SectionTitle>
          <p className="text-sm leading-relaxed text-justify">
            Con base en las proyecciones financieras de <strong>{inputs.companyName}</strong>, el proyecto de inversión
            presenta condiciones <strong>{isViable ? 'favorables' : 'desfavorables'}</strong>.{' '}
            {isViable
              ? `El valor presente neto es positivo (${money(npv)}) y la tasa interna de retorno (${formatPercent(irr)}) supera la tasa de descuento exigida (${formatPercent(wacc)}).`
              : `El rendimiento proyectado no supera la tasa de descuento exigida (${formatPercent(wacc)}): el VPN es de ${money(npv)} y la TIR de ${formatPercent(irr)}.`}
          </p>
        </section>

        <section className="avoid-break">
          <SectionTitle number={2}>Indicadores de decisión</SectionTitle>
          <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-400 text-slate-600">
                <th scope="col" className="py-2 pr-4 text-left font-medium">Indicador</th>
                <th scope="col" className="py-2 px-4 text-right font-medium">Resultado</th>
                <th scope="col" className="py-2 px-4 text-left font-medium">Criterio</th>
                <th scope="col" className="py-2 pl-4 text-left font-medium">Evaluación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {indicators.map(([name, result, rule, ok]) => (
                <tr key={name}>
                  <td className="py-2 pr-4">{name}</td>
                  <td className="py-2 px-4 text-right font-medium table-number whitespace-nowrap">{result}</td>
                  <td className="py-2 px-4 text-slate-600">{rule}</td>
                  <td className={`py-2 pl-4 font-medium ${ok ? 'text-emerald-700' : 'text-rose-700'}`}>{ok ? 'Cumple' : 'No cumple'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>

        <section className="avoid-break">
          <SectionTitle number={3}>Recomendaciones</SectionTitle>
          <ol className="list-decimal pl-5 space-y-2.5 text-sm leading-relaxed">
            <li>
              <strong>Decisión sobre la inversión.</strong>{' '}
              {isViable
                ? `Se recomienda realizar la inversión de ${money(initialCost)} en activos fijos y capital de trabajo; el flujo libre proyectado recupera el capital en ${formatPayback(paybackYears, paybackRecovered)}.`
                : `Se aconseja replantear el proyecto, ajustando el volumen de ventas o reduciendo costos operativos, ya que en las condiciones actuales no alcanza la tasa de descuento del ${formatPercent(wacc)}.`}
            </li>
            <li>
              <strong>Liquidez.</strong> Mantener los plazos de cobro a clientes entre 30 y 45 días para conservar la
              capacidad de pago a corto plazo y cumplir con los compromisos bancarios.
              {ratioAlerts.length > 0 &&
                ` Revisar los indicadores fuera de rango: ${ratioAlerts.map((r) => r.name).join(', ')}.`}
            </li>
            <li>
              <strong>Riesgo.</strong> En el escenario pesimista (ventas 20% menores), el VPN estimado es de{' '}
              {money(pessimistic?.npv)}, por lo que el proyecto {pessimistic?.npv > 0 ? 'conserva su viabilidad' : 'dejaría de ser viable'} ante
              una caída de la demanda.
            </li>
          </ol>
        </section>

        {/* Firmas */}
        <section className="pt-10 avoid-break">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
            {TEAM.map((m) => (
              <div key={m.name} className="border-t border-slate-400 pt-2">
                <div className="font-semibold text-slate-900 text-sm">{m.name}</div>
                <div className="text-slate-600">{m.role}</div>
                <div className="text-slate-500">{m.area}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-8">
            Catedrática: Licda. Gloria León · Contabilidad Financiera · Universidad del Valle de Guatemala, Campus Sololá
          </p>
        </section>
      </article>
    </div>
  );
}
