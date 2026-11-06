import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw, Calculator } from 'lucide-react';
import Button from './ui/Button';
import Disclosure from './ui/Disclosure';
import StatusLabel, { StatusIcon } from './ui/StatusLabel';
import ActionFeedback, { useActionFeedback } from './ui/ActionFeedback';
import { formatMoney, formatNumber } from '../utils/format';

const SECTORS = ['Manufactura', 'Comercio', 'Servicios'];

/** Campo con etiqueta y texto de ayuda opcional. */
function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-callout font-medium text-ink mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-footnote text-ink-2 mt-1.5 min-h-[18px]">{hint}</p>}
    </div>
  );
}

/** Sección de formulario: título y propósito a la izquierda, campos a la derecha. */
function FormSection({ title, description, aside, children }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-5 py-9 border-b border-line last:border-b-0">
      <div className="lg:col-span-4">
        <h2 className="font-display text-headline font-bold text-ink">{title}</h2>
        {description && <p className="mt-1.5 text-callout text-ink-2 max-w-xs">{description}</p>}
        {aside && <div className="mt-4">{aside}</div>}
      </div>
      <div className="lg:col-span-8 min-w-0">{children}</div>
    </section>
  );
}

/** Lista desplegable nativa con flecha propia. */
function Select({ id, value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select id={id} value={value} onChange={onChange} className="field-input appearance-none pr-9 cursor-pointer">
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-ink-2 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
    </div>
  );
}

/** Campo numérico con prefijo (moneda) o sufijo (%). */
function NumberInput({ id, value, onChange, prefix, suffix, step = 'any', min, invalid = false }) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-body text-ink-2 pointer-events-none">{prefix}</span>
      )}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        value={value}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        className={`field-input text-right table-number ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-body text-ink-2 pointer-events-none">{suffix}</span>
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
  const toolbarFeedback = useActionFeedback();
  const assistantFeedback = useActionFeedback();

  const totalInvestment =
    (Number(inputs.machinery) || 0) + (Number(inputs.furniture) || 0) + (Number(inputs.workingCapital) || 0);

  // Resaltado de campos: refleja en el formulario las mismas condiciones que revisa
  // validateFinancialData (solo presentación; los mensajes provienen del motor).
  const invalid = {
    investment: totalInvestment <= 0,
    costPercentage: (Number(inputs.costPercentage) || 0) >= 100,
    wacc: (Number(inputs.wacc) || 0) <= 0 || (Number(inputs.wacc) || 0) > 60
  };

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
    assistantFeedback.show('Proyección aplicada a los 5 años');
  };

  const salesKeys = ['salesY1', 'salesY2', 'salesY3', 'salesY4', 'salesY5'];
  const totalSales = salesKeys.reduce((sum, key) => sum + (Number(inputs[key]) || 0), 0);

  const problems = validations.filter((v) => v.type !== 'success');

  return (
    <div>
      {/* Acciones del conjunto de datos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <label htmlFor="preset" className="text-callout font-medium text-ink">
            Datos de ejemplo
          </label>
          <Select
            id="preset"
            value=""
            onChange={(e) => {
              const sector = e.target.value;
              if (!sector) return;
              onSectorPreset(sector);
              toolbarFeedback.show(`Ejemplo de ${sector} cargado`);
            }}
            className="w-52"
          >
            <option value="">Seleccionar sector…</option>
            {SECTORS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </Select>
          <span className="text-footnote text-ink-2">Datos simulados con fines académicos.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ActionFeedback {...toolbarFeedback} />
          <Button
            onClick={() => {
              onResetDefaults();
              toolbarFeedback.show('Valores iniciales restablecidos');
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer valores iniciales
          </Button>
        </div>
      </div>

      {/* Estado del conjunto: inversión total y validación, siempre a la vista */}
      <div className="border border-line rounded-[16px]">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 px-5 py-4">
          <div>
            <div className="eyebrow">Inversión inicial</div>
            <div className="mt-1 font-display text-[26px] leading-8 font-semibold tracking-[-0.03em] text-ink table-number">
              {formatMoney(totalInvestment, currencySymbol)}
            </div>
          </div>
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-footnote">
            {[
              ['Maquinaria y equipo', inputs.machinery],
              ['Mobiliario e instalaciones', inputs.furniture],
              ['Capital de trabajo', inputs.workingCapital]
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-2">{label}</dt>
                <dd className="text-callout font-medium text-ink table-number">{formatMoney(Number(value) || 0, currencySymbol)}</dd>
              </div>
            ))}
          </dl>
          <div className="ml-auto" aria-live="polite">
            {problems.length === 0 ? (
              <StatusLabel status="optimal" size="md">Datos consistentes</StatusLabel>
            ) : (
              <StatusLabel status={problems.some((v) => v.type === 'danger') ? 'danger' : 'warning'} size="md">
                {problems.length} {problems.length === 1 ? 'observación' : 'observaciones'}
              </StatusLabel>
            )}
          </div>
        </div>
        {problems.length > 0 && (
          <ul className="border-t border-line px-5 py-3 space-y-2">
            {problems.map((v) => (
              <li key={v.message} className="flex items-start gap-2.5 text-callout text-ink animate-rise-in">
                <StatusIcon status={v.type} className="w-4 h-4 mt-0.5" />
                {v.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Secciones: título y propósito a la izquierda, campos a la derecha */}
      <div className="mt-4">
        <FormSection title="Información de la empresa" description="Identificación de la empresa que se evalúa.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <Field label="Nombre o razón social" htmlFor="companyName">
                <input
                  id="companyName"
                  type="text"
                  value={inputs.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="field-input"
                />
              </Field>
              <Field label="NIT" htmlFor="nit">
                <input
                  id="nit"
                  type="text"
                  value={inputs.nit}
                  onChange={(e) => handleInputChange('nit', e.target.value)}
                  className="field-input"
                />
              </Field>
              <Field label="Ubicación" htmlFor="location">
                <input
                  id="location"
                  type="text"
                  value={inputs.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="field-input"
                />
              </Field>
              <Field label="Sector económico" htmlFor="sector">
                <Select id="sector" value={inputs.sector} onChange={(e) => handleInputChange('sector', e.target.value)}>
                  {SECTORS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
        </FormSection>

        <FormSection title="Inversión inicial" description="Desembolso del año 0 para la puesta en marcha.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Maquinaria y equipo" htmlFor="machinery">
                <NumberInput id="machinery" prefix={currencySymbol} min="0" invalid={invalid.investment} value={inputs.machinery} onChange={(v) => handleInputChange('machinery', v)} />
              </Field>
              <Field label="Mobiliario e instalaciones" htmlFor="furniture">
                <NumberInput id="furniture" prefix={currencySymbol} min="0" invalid={invalid.investment} value={inputs.furniture} onChange={(v) => handleInputChange('furniture', v)} />
              </Field>
              <Field label="Capital de trabajo" htmlFor="workingCapital">
                <NumberInput id="workingCapital" prefix={currencySymbol} min="0" invalid={invalid.investment} value={inputs.workingCapital} onChange={(v) => handleInputChange('workingCapital', v)} />
              </Field>
            </div>
        </FormSection>

        <FormSection
          title="Proyección de ventas"
          description="Ventas anuales estimadas para los 5 años del horizonte."
          aside={
            <div>
              <div className="text-footnote text-ink-2">Total 5 años</div>
              <div className="font-display text-headline font-bold text-ink table-number">{formatMoney(totalSales, currencySymbol)}</div>
            </div>
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
                    hint={growth !== null ? `${growth >= 0 ? '+' : ''}${formatNumber(growth, 1)}% vs. año ${idx}` : ' '}
                  >
                    <NumberInput id={key} prefix={currencySymbol} min="0" value={inputs[key]} onChange={(v) => handleInputChange(key, v)} />
                  </Field>
                );
              })}
            </div>

            {/* Asistente de proyección */}
            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setShowAssistant(!showAssistant)}
                aria-expanded={showAssistant}
                aria-controls="sales-assistant"
                className="flex items-center gap-1.5 text-callout font-medium text-accent hover:text-accent/75 cursor-pointer transition-colors duration-150 rounded-md"
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-200 ease-out ${showAssistant ? 'rotate-90' : ''}`}
                  aria-hidden="true"
                />
                Calcular a partir de precio, unidades y crecimiento
              </button>

              <Disclosure open={showAssistant} id="sales-assistant">
                <div className="mt-4 rounded-[14px] bg-surface-2 border border-line p-5 space-y-5">
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
                      <div className="mt-2 flex items-center gap-1.5 text-footnote">
                        <span className="text-ink-2 mr-0.5">Aplicar</span>
                        {[10, 15, 20].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => {
                              setGrowthRate(rate);
                              handleAutoProjectSales(unitPrice, monthlyUnitsY1, rate);
                            }}
                            className="h-7 px-2.5 rounded-lg border border-line-strong bg-surface text-ink font-medium hover:bg-surface-2 hover:border-ink-3/60 active:scale-[0.96] cursor-pointer transition-[background-color,border-color,transform] duration-150 table-number"
                          >
                            {rate}%
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-footnote text-ink-2">
                      Año 1 = unidades × 12 × precio. Cada año siguiente = año anterior × (1 + crecimiento).
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                      <ActionFeedback {...assistantFeedback} />
                      <Button variant="primary" onClick={() => handleAutoProjectSales()}>
                        <Calculator className="w-4 h-4" />
                        Calcular proyección
                      </Button>
                    </div>
                  </div>
                </div>
              </Disclosure>
            </div>
        </FormSection>

        <FormSection title="Costos y gastos" description="Costo de ventas como porcentaje y gastos operativos anuales.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Costo de ventas" htmlFor="costPercentage" hint="Porcentaje sobre las ventas">
                <NumberInput id="costPercentage" suffix="%" step="0.1" min="0" invalid={invalid.costPercentage} value={inputs.costPercentage} onChange={(v) => handleInputChange('costPercentage', v)} />
              </Field>
              <Field label="Gastos de administración" htmlFor="adminExpenses" hint="Anual; crece 5% por año">
                <NumberInput id="adminExpenses" prefix={currencySymbol} min="0" value={inputs.adminExpenses} onChange={(v) => handleInputChange('adminExpenses', v)} />
              </Field>
              <Field label="Gastos de venta" htmlFor="salesExpenses" hint="Anual; crece 5% por año">
                <NumberInput id="salesExpenses" prefix={currencySymbol} min="0" value={inputs.salesExpenses} onChange={(v) => handleInputChange('salesExpenses', v)} />
              </Field>
            </div>
        </FormSection>

        <FormSection title="Financiamiento" description="Préstamo bancario y su tasa de interés.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Préstamo bancario" htmlFor="bankDebt" hint="Se amortiza 20% por año">
                  <NumberInput id="bankDebt" prefix={currencySymbol} min="0" value={inputs.bankDebt} onChange={(v) => handleInputChange('bankDebt', v)} />
                </Field>
                <Field label="Tasa de interés anual" htmlFor="interestRate">
                  <NumberInput id="interestRate" suffix="%" step="0.1" min="0" value={inputs.interestRate} onChange={(v) => handleInputChange('interestRate', v)} />
                </Field>
              </div>
        </FormSection>

        <FormSection title="Parámetros financieros" description="Rendimiento mínimo exigido e impuesto sobre la renta.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tasa de descuento (WACC)" htmlFor="wacc" hint="Rendimiento mínimo exigido; se usa para el VPN">
                  <NumberInput id="wacc" suffix="%" step="0.1" invalid={invalid.wacc} value={inputs.wacc} onChange={(v) => handleInputChange('wacc', v)} />
                </Field>
                <Field label="Impuesto sobre la renta (ISR)" htmlFor="taxRate">
                  <NumberInput id="taxRate" suffix="%" step="0.1" min="0" value={inputs.taxRate} onChange={(v) => handleInputChange('taxRate', v)} />
                </Field>
              </div>
        </FormSection>
      </div>

      <div className="flex justify-end pt-8 border-t border-line">
        <Button variant="primary" onClick={() => onNavigate('statements')}>
          Ver estados financieros
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
