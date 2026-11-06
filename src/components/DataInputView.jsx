import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import Panel from './ui/Panel';
import Button from './ui/Button';
import { STATUS_STYLES } from './ui/StatusLabel';
import { formatMoney, formatNumber } from '../utils/format';

const SECTORS = ['Manufactura', 'Comercio', 'Servicios'];

const inputClass =
  'w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 table-number ' +
  'focus:outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600';

/** Campo con etiqueta y texto de ayuda opcional. */
function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

/** Campo numérico con prefijo (moneda) o sufijo (%, años). */
function NumberInput({ id, value, onChange, prefix, suffix, step = 'any', min }) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">{prefix}</span>
      )}
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} text-right ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-9' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">{suffix}</span>
      )}
    </div>
  );
}

export default function DataInputView({
  inputs,
  setInputs,
  currencySymbol,
  onSectorPreset,
  onResetDefaults,
  validations,
  onNavigate
}) {
  const [showAssistant, setShowAssistant] = useState(false);
  const [unitPrice, setUnitPrice] = useState(106.67);
  const [monthlyUnitsY1, setMonthlyUnitsY1] = useState(250);
  const [growthRate, setGrowthRate] = useState(17);

  const totalInvestment =
    (Number(inputs.machinery) || 0) + (Number(inputs.furniture) || 0) + (Number(inputs.workingCapital) || 0);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAutoProjectSales = (customPrice = unitPrice, customUnits = monthlyUnitsY1, customGrowth = growthRate) => {
    const priceNum = Number(customPrice) || 0;
    const unitsNum = Number(customUnits) || 0;
    const growthNum = (Number(customGrowth) || 0) / 100;

    const y1 = Math.round(unitsNum * 12 * priceNum);
    const y2 = Math.round(y1 * (1 + growthNum));
    const y3 = Math.round(y2 * (1 + growthNum));
    const y4 = Math.round(y3 * (1 + growthNum));
    const y5 = Math.round(y4 * (1 + growthNum));

    setInputs((prev) => ({
      ...prev,
      salesY1: y1,
      salesY2: y2,
      salesY3: y3,
      salesY4: y4,
      salesY5: y5
    }));
  };

  const salesKeys = ['salesY1', 'salesY2', 'salesY3', 'salesY4', 'salesY5'];
  const totalSales = salesKeys.reduce((sum, key) => sum + (Number(inputs[key]) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="preset" className="text-slate-600">
            Cargar datos de ejemplo
          </label>
          <select
            id="preset"
            value=""
            onChange={(e) => e.target.value && onSectorPreset(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600 cursor-pointer"
          >
            <option value="">Seleccionar sector…</option>
            {SECTORS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500">Datos simulados con fines académicos.</span>
        </div>
        <Button onClick={onResetDefaults}>
          <RotateCcw className="w-4 h-4" />
          Restablecer valores iniciales
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Formulario */}
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Información de la empresa">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre o razón social" htmlFor="companyName">
                <input
                  id="companyName"
                  type="text"
                  value={inputs.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="NIT" htmlFor="nit">
                <input
                  id="nit"
                  type="text"
                  value={inputs.nit}
                  onChange={(e) => handleInputChange('nit', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Ubicación" htmlFor="location">
                <input
                  id="location"
                  type="text"
                  value={inputs.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Sector económico" htmlFor="sector">
                <select
                  id="sector"
                  value={inputs.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {SECTORS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel title="Inversión inicial" description="Desembolso del año 0 para la puesta en marcha.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Maquinaria y equipo" htmlFor="machinery">
                <NumberInput id="machinery" prefix={currencySymbol} min="0" value={inputs.machinery} onChange={(v) => handleInputChange('machinery', v)} />
              </Field>
              <Field label="Mobiliario e instalaciones" htmlFor="furniture">
                <NumberInput id="furniture" prefix={currencySymbol} min="0" value={inputs.furniture} onChange={(v) => handleInputChange('furniture', v)} />
              </Field>
              <Field label="Capital de trabajo" htmlFor="workingCapital">
                <NumberInput id="workingCapital" prefix={currencySymbol} min="0" value={inputs.workingCapital} onChange={(v) => handleInputChange('workingCapital', v)} />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Proyección de ventas"
            description="Ventas anuales estimadas para los 5 años del horizonte."
            actions={
              <span className="text-sm text-slate-500">
                Total: <span className="font-medium text-slate-800 table-number">{formatMoney(totalSales, currencySymbol)}</span>
              </span>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {salesKeys.map((key, idx) => {
                const prev = idx > 0 ? Number(inputs[salesKeys[idx - 1]]) : 0;
                const current = Number(inputs[key]) || 0;
                const growth = prev > 0 ? ((current - prev) / prev) * 100 : null;
                return (
                  <Field
                    key={key}
                    label={`Año ${idx + 1}`}
                    htmlFor={key}
                    hint={growth !== null ? `${growth >= 0 ? '+' : ''}${formatNumber(growth, 1)}% vs. año ${idx}` : ' '}
                  >
                    <NumberInput id={key} prefix={currencySymbol} min="0" value={inputs[key]} onChange={(v) => handleInputChange(key, v)} />
                  </Field>
                );
              })}
            </div>

            {/* Asistente de proyección */}
            <div className="mt-5 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setShowAssistant(!showAssistant)}
                aria-expanded={showAssistant}
                className="flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900 cursor-pointer"
              >
                {showAssistant ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Calcular a partir de precio, unidades y crecimiento
              </button>

              {showAssistant && (
                <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Precio promedio por unidad" htmlFor="unitPrice">
                      <NumberInput id="unitPrice" prefix={currencySymbol} step="0.01" min="0" value={unitPrice} onChange={setUnitPrice} />
                    </Field>
                    <Field
                      label="Unidades al mes (año 1)"
                      htmlFor="monthlyUnits"
                      hint={`${formatNumber((Number(monthlyUnitsY1) || 0) * 12, 0)} unidades al año`}
                    >
                      <NumberInput id="monthlyUnits" min="0" value={monthlyUnitsY1} onChange={setMonthlyUnitsY1} />
                    </Field>
                    <Field label="Crecimiento anual" htmlFor="growthRate">
                      <NumberInput id="growthRate" suffix="%" step="1" value={growthRate} onChange={setGrowthRate} />
                      <div className="mt-1.5 flex items-center gap-1 text-xs">
                        <span className="text-slate-500 mr-1">Aplicar:</span>
                        {[10, 15, 20].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => {
                              setGrowthRate(rate);
                              handleAutoProjectSales(unitPrice, monthlyUnitsY1, rate);
                            }}
                            className="px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            {rate}%
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Año 1 = unidades × 12 × precio. Cada año siguiente = año anterior × (1 + crecimiento).
                    </p>
                    <Button variant="primary" onClick={() => handleAutoProjectSales()}>
                      Calcular proyección
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Costos y gastos">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Costo de ventas" htmlFor="costPercentage" hint="Porcentaje sobre las ventas">
                <NumberInput id="costPercentage" suffix="%" step="0.1" min="0" value={inputs.costPercentage} onChange={(v) => handleInputChange('costPercentage', v)} />
              </Field>
              <Field label="Gastos de administración" htmlFor="adminExpenses" hint="Anual; crece 5% por año">
                <NumberInput id="adminExpenses" prefix={currencySymbol} min="0" value={inputs.adminExpenses} onChange={(v) => handleInputChange('adminExpenses', v)} />
              </Field>
              <Field label="Gastos de venta" htmlFor="salesExpenses" hint="Anual; crece 5% por año">
                <NumberInput id="salesExpenses" prefix={currencySymbol} min="0" value={inputs.salesExpenses} onChange={(v) => handleInputChange('salesExpenses', v)} />
              </Field>
            </div>
          </Panel>

          <Panel title="Financiamiento">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Préstamo bancario" htmlFor="bankDebt" hint="Se amortiza 20% por año">
                <NumberInput id="bankDebt" prefix={currencySymbol} min="0" value={inputs.bankDebt} onChange={(v) => handleInputChange('bankDebt', v)} />
              </Field>
              <Field label="Tasa de interés anual" htmlFor="interestRate">
                <NumberInput id="interestRate" suffix="%" step="0.1" min="0" value={inputs.interestRate} onChange={(v) => handleInputChange('interestRate', v)} />
              </Field>
            </div>
          </Panel>

          <Panel title="Parámetros financieros">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tasa de descuento (WACC)" htmlFor="wacc" hint="Rendimiento mínimo exigido; se usa para el VPN">
                <NumberInput id="wacc" suffix="%" step="0.1" value={inputs.wacc} onChange={(v) => handleInputChange('wacc', v)} />
              </Field>
              <Field label="Impuesto sobre la renta (ISR)" htmlFor="taxRate">
                <NumberInput id="taxRate" suffix="%" step="0.1" min="0" value={inputs.taxRate} onChange={(v) => handleInputChange('taxRate', v)} />
              </Field>
            </div>
          </Panel>

          <div className="flex justify-end">
            <Button variant="primary" onClick={() => onNavigate('statements')}>
              Ver estados financieros
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Columna lateral: resumen y validación */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <Panel title="Inversión inicial">
            <dl className="space-y-2 text-sm">
              {[
                ['Maquinaria y equipo', inputs.machinery],
                ['Mobiliario e instalaciones', inputs.furniture],
                ['Capital de trabajo', inputs.workingCapital]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-slate-800 table-number">{formatMoney(Number(value) || 0, currencySymbol)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pt-2 mt-1 border-t border-slate-200 font-semibold">
                <dt className="text-slate-900">Total (I₀)</dt>
                <dd className="text-slate-900 table-number">{formatMoney(totalInvestment, currencySymbol)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Validación de datos">
            <ul className="space-y-3">
              {validations.map((v, i) => {
                const style = STATUS_STYLES[v.type === 'success' ? 'optimal' : v.type] || STATUS_STYLES.warning;
                return (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${style.dot}`} aria-hidden="true" />
                    <span className={v.type === 'success' ? 'text-slate-700' : style.text}>{v.message}</span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
