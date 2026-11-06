import React, { useEffect, useId, useRef, useState } from 'react';
import { formatMoney, formatPayback } from '../utils/format';

/**
 * Perfil de la inversión: flujo de caja libre de cada año (columnas) y flujo acumulado (línea).
 * Ambas series comparten la misma escala monetaria (un solo eje). El punto donde el acumulado
 * cruza cero es el período de recuperación que calcula el motor.
 *
 * Solo presenta datos ya calculados. Cuando los datos cambian, la geometría se interpola
 * durante 240 ms; las cifras del tooltip y de las etiquetas siempre son los valores reales.
 */

const HEIGHT = 262;
const PAD = { top: 38, right: 16, bottom: 32, left: 68 };
const BAR_MAX = 24;
const RADIUS = 4;
const TOOLTIP_W = 220;
const TWEEN_MS = 240;

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
    return `M${x},${yBase} V${yValue + r} Q${x},${yValue} ${x + r},${yValue} H${x + w - r} Q${x + w},${yValue} ${x + w},${yValue + r} V${yBase} Z`;
  }
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

/** Interpola un arreglo numérico hacia su nuevo valor (solo para dibujar). */
function useTweened(values) {
  const [shown, setShown] = useState(values);
  const fromRef = useRef(values);
  const key = values.join('|');
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = fromRef.current;
    if (reduce || from.length !== values.length) {
      fromRef.current = values;
      setShown(values);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const ease = (t) => 1 - (1 - t) ** 3;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / TWEEN_MS);
      const k = ease(t);
      const next = values.map((v, i) => from[i] + (v - from[i]) * k);
      fromRef.current = next;
      setShown(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return shown;
}

export default function CashFlowChart({ years, annual, cumulative, paybackYears, paybackRecovered, symbol }) {
  const [ref, width] = useWidth();
  const gid = useId().replace(/:/g, '');
  const [hover, setHover] = useState(null);
  const shownAnnual = useTweened(annual);
  const shownCumulative = useTweened(cumulative);

  // La escala se calcula con los valores reales para que los ejes no oscilen
  const all = [...annual, ...cumulative, 0];
  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  const step = niceStep(rawMax - rawMin || 1);
  const yMin = Math.floor(rawMin / step) * step;
  const yMax = Math.ceil(rawMax / step) * step;
  const ticks = [];
  for (let v = yMin; v <= yMax + step / 2; v += step) ticks.push(v);

  const compact = width < 520;
  const plotW = Math.max(width - PAD.left - PAD.right, 0);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = plotW / years.length;
  const barW = Math.min(BAR_MAX, band * 0.4);
  const y = (v) => PAD.top + ((yMax - v) / (yMax - yMin || 1)) * plotH;
  const cx = (i) => PAD.left + band * i + band / 2;

  const linePoints = shownCumulative.map((v, i) => `${cx(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  // Lavado suave bajo el acumulado, hasta la línea de cero (≈10 % de opacidad)
  const areaPath =
    `M${cx(0).toFixed(1)},${y(0).toFixed(1)} ` +
    shownCumulative.map((v, i) => `L${cx(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ') +
    ` L${cx(shownCumulative.length - 1).toFixed(1)},${y(0).toFixed(1)} Z`;
  const last = cumulative.length - 1;

  const showPayback = paybackRecovered && paybackYears > 0 && paybackYears <= years.length - 1;
  const paybackX = showPayback ? cx(0) + band * paybackYears : 0;
  const paybackLabel = `Recuperación · ${formatPayback(paybackYears, true)}`;
  // La etiqueta se coloca del lado donde cabe; si no cabe en ninguno se omite
  // (la descripción de la tarjeta ya indica el período de recuperación).
  const LABEL_W = 166;
  const fitsRight = paybackX + 8 + LABEL_W <= width - PAD.right;
  const fitsLeft = paybackX - 8 - LABEL_W >= PAD.left;
  const labelRight = !fitsRight && fitsLeft;
  const showPaybackLabel = fitsRight || fitsLeft;

  const summary = years
    .map((yr, i) => `${yr}: flujo ${formatMoney(annual[i], symbol)}, acumulado ${formatMoney(cumulative[i], symbol)}`)
    .join('; ');

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') setHover((h) => (h === null ? 0 : Math.min(years.length - 1, h + 1)));
    else if (e.key === 'ArrowLeft') setHover((h) => (h === null ? 0 : Math.max(0, h - 1)));
    else if (e.key === 'Escape') setHover(null);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      className="relative w-full select-none rounded-xl outline-offset-4"
      onMouseLeave={() => setHover(null)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={() => setHover((h) => (h === null ? 0 : h))}
      onBlur={() => setHover(null)}
      aria-label="Gráfica de flujo de caja. Use las flechas izquierda y derecha para recorrer los años."
    >
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
                stroke={t === 0 ? 'rgb(var(--ink-3))' : 'rgb(var(--line))'}
                strokeOpacity={t === 0 ? 0.7 : 1}
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <text x={PAD.left - 12} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink-2 text-caption table-number">
                {compactMoney(t, symbol)}
              </text>
            </g>
          ))}

          {/* Columna resaltada y guía vertical al recorrer la gráfica */}
          {hover !== null && (
            <g className="animate-fade-in">
              <rect x={PAD.left + band * hover + 4} y={PAD.top - 8} width={band - 8} height={plotH + 8} rx="8" fill="rgb(var(--ink) / 0.045)" />
            </g>
          )}

          {/* Marca del período de recuperación */}
          {showPayback && (
            <g>
              <line x1={paybackX} x2={paybackX} y1={PAD.top - 6} y2={y(0)} stroke="rgb(var(--ink-3))" strokeWidth="1" strokeOpacity="0.8" shapeRendering="crispEdges" />
              <circle cx={paybackX} cy={y(0)} r="3" fill="rgb(var(--ink))" />
              {showPaybackLabel && (
                <g>
                  <rect
                    x={labelRight ? paybackX - 8 - LABEL_W : paybackX + 8}
                    y={PAD.top - 14}
                    width={LABEL_W}
                    height="24"
                    rx="8"
                    fill="rgb(var(--surface))"
                    stroke="rgb(var(--line-strong))"
                  />
                  <text
                    x={(labelRight ? paybackX - 8 - LABEL_W : paybackX + 8) + LABEL_W / 2}
                    y={PAD.top - 2}
                    dy="0.35em"
                    textAnchor="middle"
                    className="fill-ink text-caption font-semibold table-number"
                  >
                    {paybackLabel}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Flujo anual */}
          {shownAnnual.map((v, i) => (
            <path
              key={years[i]}
              d={barPath(cx(i) - barW / 2, barW, y(0), y(v))}
              fill="rgb(var(--chart-1))"
              fillOpacity={hover === null || hover === i ? 1 : 0.55}
              className="transition-[fill-opacity] duration-180"
            />
          ))}

          {/* Flujo acumulado */}
          <defs>
            <linearGradient id={`wash-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgb(var(--chart-2))" stopOpacity="0.14" />
              <stop offset="1" stopColor="rgb(var(--chart-2))" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#wash-${gid})`} />
          <polyline points={linePoints} fill="none" stroke="rgb(var(--chart-2))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {shownCumulative.map((v, i) => (
            <circle
              key={years[i]}
              cx={cx(i)}
              cy={y(v)}
              r={hover === i ? 5.5 : 4}
              fill="rgb(var(--chart-2))"
              stroke="rgb(var(--surface))"
              strokeWidth="2"
              className="transition-[r] duration-180 ease-out"
            />
          ))}

          {/* Etiqueta directa selectiva: valor final del acumulado */}
          {!compact && (
            <>
              <g>
                <rect
                  x={cx(last) - 30}
                  y={y(shownCumulative[last]) - 36}
                  width="60"
                  height="22"
                  rx="7"
                  fill="rgb(var(--chart-2) / 0.12)"
                  stroke="rgb(var(--chart-2) / 0.35)"
                />
                <text x={cx(last)} y={y(shownCumulative[last]) - 25} dy="0.35em" textAnchor="middle" className="fill-ink text-caption font-semibold table-number">
                  {compactMoney(cumulative[last], symbol)}
                </text>
              </g>
            </>
          )}

          {/* Etiquetas de año */}
          {years.map((yr, i) => (
            <text
              key={yr}
              x={cx(i)}
              y={HEIGHT - 8}
              textAnchor="middle"
              className={`text-caption transition-colors duration-150 ${hover === i ? 'fill-ink font-semibold' : 'fill-ink-2'}`}
            >
              {compact ? yr.replace('Año ', 'A') : yr}
            </text>
          ))}

          {/* Zonas de interacción (más amplias que las marcas) */}
          {years.map((yr, i) => (
            <rect key={yr} x={PAD.left + band * i} y={0} width={band} height={HEIGHT} fill="transparent" onMouseEnter={() => setHover(i)} />
          ))}
        </svg>
      )}

      {/* Tooltip */}
      {hover !== null && width > 0 && (
        <div
          key={hover}
          className="pointer-events-none absolute z-10 rounded-xl border border-line bg-surface/95 backdrop-blur-md shadow-pop px-3.5 py-2.5 text-footnote animate-fade-in"
          style={{
            width: TOOLTIP_W,
            top: PAD.top - 4,
            left: Math.min(Math.max(cx(hover) + (hover >= years.length - 2 ? -(TOOLTIP_W + 18) : 18), 0), width - TOOLTIP_W)
          }}
        >
          <div className="font-semibold text-ink mb-1.5">{years[hover]}</div>
          <div className="flex items-center justify-between gap-4 text-ink-2">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-chart-1" aria-hidden="true" /> Flujo del año
            </span>
            <span className={`table-number font-medium ${annual[hover] < 0 ? 'text-negative' : 'text-ink'}`}>{formatMoney(annual[hover], symbol)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-ink-2 mt-1">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-chart-2" aria-hidden="true" /> Acumulado
            </span>
            <span className={`table-number font-medium ${cumulative[hover] < 0 ? 'text-negative' : 'text-ink'}`}>
              {formatMoney(cumulative[hover], symbol)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
