import React from 'react';

const VARIANTS = {
  primary: 'bg-primary text-white shadow-sm hover:bg-primary/90',
  secondary: 'bg-surface text-ink border border-line-strong shadow-sm hover:bg-surface-2',
  plain: 'text-accent hover:text-accent/80'
};

/**
 * Botón con tres estilos: primary (acción principal), secondary y plain (enlace).
 * Respuesta táctil discreta al presionar; la animación se anula con movimiento reducido.
 */
export default function Button({ variant = 'secondary', className = '', children, type = 'button', ...props }) {
  const base =
    variant === 'plain'
      ? 'inline-flex items-center gap-1 text-sm font-medium cursor-pointer transition-colors duration-150 rounded'
      : 'inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-control text-sm font-medium cursor-pointer ' +
        'transition-[background-color,transform,box-shadow] duration-150 ease-out active:scale-[0.98] whitespace-nowrap';
  return (
    <button type={type} className={`${base} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
