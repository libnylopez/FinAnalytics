import React from 'react';

/**
 * Control segmentado al estilo macOS.
 * - mode="tabs": cambia de vista (role tablist / tab).
 * - mode="toggle": selección de una opción (botones con aria-pressed).
 * Cada opción: { id, label, icon?, title? }. Si solo hay icono, `label` se usa como nombre accesible.
 */
export default function SegmentedControl({ options, value, onChange, mode = 'toggle', ariaLabel, size = 'md', className = '' }) {
  const isTabs = mode === 'tabs';
  const height = size === 'sm' ? 'h-7' : 'h-8';
  return (
    <div
      role={isTabs ? 'tablist' : 'group'}
      aria-label={ariaLabel}
      className={`inline-flex items-center p-0.5 rounded-[9px] bg-ink/[0.06] ${className}`}
    >
      {options.map((opt) => {
        const selected = opt.id === value;
        const Icon = opt.icon;
        const iconOnly = Icon && opt.iconOnly;
        return (
          <button
            key={opt.id}
            type="button"
            role={isTabs ? 'tab' : undefined}
            aria-selected={isTabs ? selected : undefined}
            aria-pressed={isTabs ? undefined : selected}
            aria-label={iconOnly ? opt.label : undefined}
            title={opt.title || (iconOnly ? opt.label : undefined)}
            onClick={() => onChange(opt.id)}
            className={`${height} inline-flex items-center justify-center gap-1.5 rounded-[7px] text-[13px] font-medium cursor-pointer
              transition-[background-color,color,box-shadow] duration-200 ease-out ${iconOnly ? 'w-8' : 'px-3'} ${
              selected ? 'bg-segment text-ink shadow-segment' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
            {!iconOnly && <span className="whitespace-nowrap">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
