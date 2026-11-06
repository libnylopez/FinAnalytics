import React from 'react';

/**
 * Contenedor estándar de contenido: fondo blanco, borde discreto y
 * encabezado opcional con título, descripción y acciones.
 */
export default function Panel({ title, description, actions, children, className = '', bodyClassName = 'p-5' }) {
  return (
    <section className={`bg-white border border-slate-200 rounded-md ${className}`}>
      {(title || actions) && (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3.5 border-b border-slate-200">
          <div>
            {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
