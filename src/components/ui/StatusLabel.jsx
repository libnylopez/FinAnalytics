import React from 'react';

/**
 * Indicador de estado de tres niveles, con el mismo significado en toda la aplicación:
 * optimal (favorable) · warning (en observación) · danger (crítico).
 */
export const STATUS_STYLES = {
  optimal: { dot: 'bg-emerald-600', text: 'text-emerald-700' },
  warning: { dot: 'bg-amber-500', text: 'text-amber-700' },
  danger: { dot: 'bg-rose-600', text: 'text-rose-700' }
};

export default function StatusLabel({ status, children, className = '' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.warning;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.text} ${className}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} aria-hidden="true" />
      {children}
    </span>
  );
}
