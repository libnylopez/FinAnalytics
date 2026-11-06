import React from 'react';

const VARIANTS = {
  primary:
    'bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_rgb(16_24_40/0.14)] ' +
    'hover:brightness-[1.08] active:brightness-95',
  secondary:
    'bg-surface text-ink border border-line-strong shadow-[0_1px_2px_rgb(16_24_40/0.05)] hover:bg-surface-2 hover:border-ink-3/60',
  plain: 'text-accent hover:text-accent/75'
};

const SIZES = {
  md: 'h-10 px-4 gap-2 text-callout',
  sm: 'h-9 px-3.5 gap-1.5 text-callout'
};

/**
 * Botón con tres estilos: primary (acción principal), secondary y plain (enlace).
 * Al presionar se comprime levemente (transform), sin bloquear la interacción.
 */
export default function Button({ variant = 'secondary', size = 'md', className = '', children, type = 'button', ...props }) {
  const base =
    variant === 'plain'
      ? 'inline-flex items-center gap-1 text-callout font-medium cursor-pointer transition-colors duration-150 rounded-md'
      : `inline-flex items-center justify-center rounded-control font-medium cursor-pointer whitespace-nowrap select-none
         transition-[background-color,border-color,filter,transform] duration-150 ease-out active:scale-[0.97] ${SIZES[size]}`;
  return (
    <button type={type} className={`${base} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
