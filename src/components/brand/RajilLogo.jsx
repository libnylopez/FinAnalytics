import React from 'react';
import { RAJIL_PATHS } from './rajilGeometry';
import { RAJIL_WORDMARK } from './rajilWordmark';

/**
 * Isotipo RAJIL. Toma el color del token de marca (--rajil), que se ajusta en modo oscuro.
 * Es decorativo por defecto; pase `title` para que tenga nombre accesible.
 */
export function RajilMark({ size = 32, className = 'text-rajil', title }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path fill="currentColor" d={RAJIL_PATHS.hook} />
      <path fill="currentColor" d={RAJIL_PATHS.block} />
    </svg>
  );
}

/** Nombre RAJIL en contornos. `capHeight` es la altura de las mayúsculas en píxeles. */
export function RajilWordmark({ capHeight = 12, className = 'text-rajil-ink' }) {
  const width = (RAJIL_WORDMARK.width * capHeight) / 100;
  const scale = (RAJIL_WORDMARK.scale * capHeight) / 100;
  return (
    <svg
      viewBox={`0 0 ${width.toFixed(2)} ${capHeight}`}
      width={width.toFixed(2)}
      height={capHeight}
      className={`shrink-0 overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" transform={`scale(${scale})`} d={RAJIL_WORDMARK.d} />
    </svg>
  );
}

/**
 * Logotipo horizontal: isotipo + nombre. La altura de mayúscula del nombre es ~47 % de la
 * altura visible del isotipo, y la separación equivale a medio trazo del isotipo.
 */
export default function RajilLogo({ size = 32, className = '' }) {
  const capHeight = Math.round(size * 0.34);
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: Math.round(size * 0.22) }}>
      <RajilMark size={size} />
      <RajilWordmark capHeight={capHeight} />
      <span className="sr-only">RAJIL</span>
    </span>
  );
}
