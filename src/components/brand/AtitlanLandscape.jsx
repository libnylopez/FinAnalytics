import React, { useId } from 'react';
import { LAKE_PATHS, LAKE_VIEWBOX } from './atitlanPaths';

/**
 * Lago de Atitlán desde Panajachel: ilustración vectorial estática y decorativa.
 * Los colores salen del token --lake (azul suave en claro, azul profundo en oscuro).
 *
 * Capas, de atrás hacia adelante: crestas lejanas, volcán y cordilleras (silueta medida en
 * la foto de referencia), orillas cercanas, lago con degradado y reflejos horizontales.
 * `layers="minimal"` deja solo la silueta y la línea del agua.
 */
export default function AtitlanLandscape({ className = '', layers = 'premium', fade = 'left', fit = 'slice' }) {
  const id = useId().replace(/:/g, '');
  const { width, height, water } = LAKE_VIEWBOX;
  const minimal = layers === 'minimal';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={fit === 'meet' ? 'xMaxYMax meet' : 'xMidYMax slice'}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`water-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--lake))" stopOpacity={minimal ? 0.05 : 0.11} />
          <stop offset="1" stopColor="rgb(var(--lake))" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`fade-${id}`} x1={fade === 'left' ? '0' : '1'} y1="0" x2={fade === 'left' ? '1' : '0'} y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`mask-${id}`}>
          <rect width={width} height={height} fill={fade === 'none' ? '#fff' : `url(#fade-${id})`} />
        </mask>
      </defs>

      <g mask={`url(#mask-${id})`}>
        {!minimal && <path d={LAKE_PATHS.far} fill="rgb(var(--lake))" fillOpacity="0.07" />}
        <path d={LAKE_PATHS.main} fill="rgb(var(--lake))" fillOpacity={minimal ? 0.1 : 0.12} />
        {!minimal && (
          <>
            <path d={LAKE_PATHS.nearLeft} fill="rgb(var(--lake))" fillOpacity="0.1" />
            <path d={LAKE_PATHS.nearRight} fill="rgb(var(--lake))" fillOpacity="0.1" />
          </>
        )}
        {/* Lago */}
        <rect x="0" y={water} width={width} height={height - water} fill={`url(#water-${id})`} />
        <line x1="0" x2={width} y1={water + 0.5} y2={water + 0.5} stroke="rgb(var(--lake))" strokeOpacity={minimal ? 0.18 : 0.22} strokeWidth="1.5" />
        {!minimal && (
          <g stroke="rgb(var(--lake))" strokeLinecap="round" strokeWidth="2">
            {/* Reflejo del volcán sobre el agua, sin movimiento */}
            <line x1="690" x2="830" y1={water + 14} y2={water + 14} strokeOpacity="0.16" />
            <line x1="718" x2="802" y1={water + 26} y2={water + 26} strokeOpacity="0.12" />
            <line x1="742" x2="778" y1={water + 38} y2={water + 38} strokeOpacity="0.09" />
            <line x1="250" x2="470" y1={water + 22} y2={water + 22} strokeOpacity="0.07" />
            <line x1="1150" x2="1390" y1={water + 32} y2={water + 32} strokeOpacity="0.07" />
          </g>
        )}
      </g>
    </svg>
  );
}
