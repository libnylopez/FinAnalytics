import React, { useEffect, useRef, useState } from 'react';
import { formatMoney } from '../utils/format';

/**
 * Perfil de la inversión: flujo de caja libre de cada año (columnas) y flujo acumulado (línea).
 * Ambas series comparten la misma escala monetaria (un solo eje). El punto donde el acumulado
 * cruza cero es el período de recuperación que calcula el motor.
 * Solo presenta datos ya calculados; no realiza cálculos financieros.
 */

const HEIGHT = 232;
const PAD = { top: 16, right: 12, bottom: 30, left: 64 };
const BAR_MAX = 24;
const RADIUS = 4;
const TOOLTIP_W = 212;

function niceStep(range, targetTicks = 4) {
  const raw = range / targetTicks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
}

function compactMoney(value, symbol) {
  const abs = Math.abs(value);
  const text =
    abs >= 1e6 ? `${(abs / 1e6).toLocaleString('es-GT', { maximumFractionDigits: 1 })}M`
    : abs >= 1e3 ? `${(abs / 1e3).toLocaleString('es-GT', { maximumFractionDigits: 0 })}K`
    : abs.toLocaleString('es-GT', { maximumFractionDigits: 0 });
  return value < 0 ? `(${symbol} ${text})` : `${symbol} ${text}`;
}

/** Columna con extremo de datos redondeado y base recta sobre la línea de cero. */
function barPath(x, w, yBase, yValue) {
  const h = Math.abs(yBase - yValue);
  if (h < 0.5) return '';
  const r = Math.min(RADIUS, h, w / 2);
  if (yValue < yBase) {
    // positiva: crece hacia arriba
    return `M${x},${yBase} V${yValue + r} Q${x},${yValue} ${x + r},${yValue} H${x + w - r} Q${x + w},${yValue} ${x + w},${yValue + r} V${yBase} Z`;
  }
  // negativa: crece hacia abajo
  return `M${x},${yBase} V${yValue - r} Q${x},${yValue} ${x + r},${yValue} H${x + w - r} Q${x + w},${yValue} ${x + w},${yValue - r} V${yBase} Z`;
}

function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

export default function CashFlowChart({ years, annual, cumulative, paybackYears, paybackRecovered, symbol }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);

  const all = [...annual, ...cumulative, 0];
  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  const step = niceStep(rawMax - rawMin || 1);
  const yMin = Math.floor(rawMin / step) * step;
  const yMax = Math.ceil(rawMax / step) * step;
  const ticks = [];
  for (let v = yMin; v <= yMax + step / 2; v += step) ticks.push(v);

  const plotW = Math.max(width - PAD.left - PAD.right, 0);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = plotW / years.length;
  const barW = Math.min(BAR_MAX, band * 0.42);
  const y = (v) => PAD.top + ((yMax - v) / (yMax - yMin || 1)) * plotH;
  const cx = (i) => PAD.left + band * i + band / 2;

  const linePoints = cumulative.map((v, i) => `${cx(i)},${y(v)}`).join(' ');

  // Marca de recuperación: entre el centro del año entero y el siguiente
  const showPayback = paybackRecovered && paybackYears > 0 && paybackYears <= years.length - 1;
  const paybackX = showPayback ? cx(0) + band * paybackYears : 0;

  const summary = years
    .map((yr, i) => `${yr}: flujo ${formatMoney(annual[i], symbol)}, acumulado ${formatMoney(cumulative[i], symbol)}`)
    .join('; ');

  return (
    <div ref={ref} className="relative w-full select-none" onMouseLeave={() => setHover(null)}>
      {width > 0 && (
        <svg width={width} height={HEIGHT} role="img" aria-label={`Flujo de caja libre por año. ${summary}`} className="block">
          {/* Cuadrícula y eje */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? 'rgb(var(--line-strong))' : 'rgb(var(--line))'}
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <text
                x={PAD.left - 10}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="fill-ink-2 text-[11px] table-number"
              >
                {compactMoney(t, symbol)}
              </text>
            </g>
          ))}

          {/* Columna resaltada al pasar el cursor */}
          {hover !== null && (
            <rect x={PAD.left + band * hover} y={PAD.top} width={band} height={plotH} rx="6" fill="rgb(var(--ink) / 0.04)" />
          )}

          {/* Marca del período de recuperación */}
          {showPayback && (
            <g>
              <line x1={paybackX} x2={paybackX} y1={PAD.top} y2={y(0)} stroke="rgb(var(--ink-3))" strokeWidth="1" shapeRendering="crispEdges" />
              <text
                x={paybackX + (paybackX > width - 150 ? -6 : 6)}
                y={PAD.top + 4}
                dy="0.7em"
                textAnchor={paybackX > width - 150 ? 'end' : 'start'}
                className="fill-ink-2 text-[11px] font-medium"
              >
                Recuperación
              </text>
            </g>
          )}

          {/* Flujo anual */}
          {annual.map((v, i) => (
            <path key={years[i]} d={barPath(cx(i) - barW / 2, barW, y(0), y(v))} fill="rgb(var(--chart-1))" />
          ))}

          {/* Flujo acumulado */}
          <polyline points={linePoints} fill="none" stroke="rgb(var(--chart-2))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {cumulative.map((v, i) => (
            <circle
              key={years[i]}
              cx={cx(i)}
              cy={y(v)}
              r={hover === i ? 5 : 4}
              fill="rgb(var(--chart-2))"
              stroke="rgb(var(--surface))"
              strokeWidth="2"
              className="transition-[r] duration-150"
            />
          ))}

          {/* Etiquetas de año */}
          {years.map((yr, i) => (
            <text key={yr} x={cx(i)} y={HEIGHT - 8} textAnchor="middle" className={`text-[11px] ${hover === i ? 'fill-ink font-medium' : 'fill-ink-2'}`}>
              {yr}
            </text>
          ))}

          {/* Zonas de interacción (más amplias que las marcas) */}
          {years.map((yr, i) => (
            <rect
              key={yr}
              x={PAD.left + band * i}
              y={PAD.top}
              width={band}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>
      )}

      {/* Tooltip */}
      {hover !== null && width > 0 && (
        <div
          className="pointer-events-none absolute z-10 w-[212px] rounded-lg border border-line bg-surface shadow-pop px-3 py-2 text-xs animate-fade-in"
          style={{
            top: PAD.top,
            left: Math.min(Math.max(cx(hover) + (hover >= years.length - 2 ? -(TOOLTIP_W + 16) : 16), 0), width - TOOLTIP_W)
          }}
        >
          <div className="font-semibold text-ink mb-1">{years[hover]}</div>
          <div className="flex items-center justify-between gap-4 text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-chart-1" aria-hidden="true" /> Flujo del año
            </span>
            <span className="text-ink table-number font-medium">{formatMoney(annual[hover], symbol)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-ink-2 mt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-chart-2" aria-hidden="true" /> Acumulado
            </span>
            <span className="text-ink table-number font-medium">{formatMoney(cumulative[hover], symbol)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
