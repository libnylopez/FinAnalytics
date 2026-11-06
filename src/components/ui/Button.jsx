import React from 'react';

const VARIANTS = {
  primary: 'bg-navy-800 text-white border border-navy-800 hover:bg-navy-900',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900',
  link: 'text-navy-700 hover:text-navy-900 hover:underline px-0 py-0 border-0'
};

export default function Button({ variant = 'secondary', className = '', children, type = 'button', ...props }) {
  const base =
    variant === 'link'
      ? 'inline-flex items-center gap-1 text-sm font-medium cursor-pointer'
      : 'inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-1';
  return (
    <button type={type} className={`${base} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
