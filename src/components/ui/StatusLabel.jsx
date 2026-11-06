import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

/**
 * Estado de tres niveles con el mismo significado en toda la aplicación:
 * optimal (favorable) · warning (en observación) · danger (crítico).
 * Siempre combina color, icono y texto: el color nunca es el único indicador.
 */
export const STATUS_STYLES = {
  optimal: { text: 'text-positive', soft: 'bg-positive/10', icon: CheckCircle2 },
  warning: { text: 'text-warning', soft: 'bg-warning/10', icon: AlertTriangle },
  danger: { text: 'text-negative', soft: 'bg-negative/10', icon: XCircle }
};

/** Etiqueta en forma de cápsula (tablas y encabezados). */
export default function StatusLabel({ status, children, className = '', size = 'sm' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.warning;
  const Icon = style.icon;
  const sizing = size === 'md' ? 'px-2.5 py-1 text-[13px] gap-1.5' : 'px-2 py-0.5 text-xs gap-1';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizing} ${style.soft} ${style.text} ${className}`}
    >
      <Icon className={size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} aria-hidden="true" />
      {children}
    </span>
  );
}

/** Icono de estado sin cápsula, para listas y criterios. */
export function StatusIcon({ status, className = 'w-4 h-4' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.warning;
  const Icon = style.icon;
  return <Icon className={`${className} ${style.text} shrink-0`} aria-hidden="true" />;
}
