import React, { useRef } from 'react';
import useIndicator from '../../hooks/useIndicator';

/**
 * Control segmentado al estilo macOS, con selección que se desliza entre opciones.
 * - mode="tabs": cambia de vista (role tablist / tab).
 * - mode="toggle": selección de una opción (botones con aria-pressed).
 * Cada opción: { id, label, icon?, iconOnly?, shortLabel?, title? }.
 * `shortLabel` se muestra solo en pantallas anchas junto al icono (ej. "Auto").
 */
export default function SegmentedControl({ options, value, onChange, mode = 'toggle', ariaLabel, size = 'md', className = '' }) {
  const ref = useRef(null);
  const thumb = useIndicator(ref, '[data-selected="true"]', value);
  const isTabs = mode === 'tabs';
  const height = size === 'sm' ? 'h-8' : 'h-9';

  return (
    <div
      ref={ref}
      role={isTabs ? 'tablist' : 'group'}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center p-[3px] rounded-[11px] bg-ink/[0.06] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 rounded-[8px] bg-segment shadow-segment duration-240 ease-emphasis"
        style={thumb}
      />
      {options.map((opt) => {
        const selected = opt.id === value;
        const Icon = opt.icon;
        const iconOnly = Icon && opt.iconOnly;
        return (
          <button
            key={opt.id}
            type="button"
            data-selected={selected}
            role={isTabs ? 'tab' : undefined}
            aria-selected={isTabs ? selected : undefined}
            aria-pressed={isTabs ? undefined : selected}
            aria-label={iconOnly ? opt.label : undefined}
            title={opt.title || (iconOnly ? opt.label : undefined)}
            onClick={() => onChange(opt.id)}
            className={`relative z-[1] ${height} inline-flex items-center justify-center gap-1.5 rounded-[8px] text-callout font-medium cursor-pointer
              transition-colors duration-180 ease-out select-none ${iconOnly && !opt.shortLabel ? 'w-9' : 'px-3'} ${
              selected ? 'text-ink' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
            {!iconOnly && <span className="whitespace-nowrap">{opt.label}</span>}
            {iconOnly && opt.shortLabel && (
              <span className="hidden xl:inline whitespace-nowrap" aria-hidden="true">
                {opt.shortLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
