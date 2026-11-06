import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

/**
 * Estado de tres niveles con el mismo significado en toda la aplicación:
 * optimal (favorable) · warning (en observación) · danger (crítico).
 * Siempre combina color, icono y texto: el color nunca es el único indicador.
 */
export const STATUS_STYLES = {
  optimal: { text: 'text-positive', soft: 'bg-positive/10', ring: 'ring-positive/15', icon: CheckCircle2 },
  warning: { text: 'text-warning', soft: 'bg-warning/10', ring: 'ring-warning/15', icon: AlertTriangle },
  danger: { text: 'text-negative', soft: 'bg-negative/10', ring: 'ring-negative/15', icon: XCircle }
};

/** Etiqueta en forma de cápsula (tablas y encabezados). */
export default function StatusLabel({ status, children, className = '', size = 'sm' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.warning;
  const Icon = style.icon;
  const sizing = size === 'md' ? 'h-8 px-3 text-callout gap-1.5' : 'h-6 px-2.5 text-footnote gap-1';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ring-1 ring-inset ${sizing} ${style.soft} ${style.ring} ${style.text} ${className}`}
    >
      <Icon className={size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} strokeWidth={2.25} aria-hidden="true" />
      {children}
    </span>
  );
}

/** Icono de estado sin cápsula, para listas y criterios. */
export function StatusIcon({ status, className = 'w-4 h-4' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.warning;
  const Icon = style.icon;
  return <Icon className={`${className} ${style.text} shrink-0`} strokeWidth={2.25} aria-hidden="true" />;
}
