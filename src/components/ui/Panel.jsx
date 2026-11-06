import React from 'react';

/**
 * Contenedor estándar: superficie, borde fino, sombra suave y encabezado opcional
 * con título, descripción y acciones. `divided` separa el encabezado con una línea.
 */
export default function Panel({
  title,
  description,
  actions,
  children,
  className = '',
  bodyClassName,
  divided = false,
  as: Tag = 'section'
}) {
  const hasHeader = title || actions;
  const bodyClass = bodyClassName ?? (hasHeader ? (divided ? 'p-5' : 'px-5 pb-5') : 'p-5');
  return (
    <Tag className={`bg-surface border border-line rounded-card shadow-card ${className}`}>
      {hasHeader && (
        <header
          className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-4 ${
            divided ? 'pb-3.5 border-b border-line' : 'pb-3'
          }`}
        >
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold text-ink leading-6">{title}</h2>}
            {description && <p className="text-[13px] text-ink-2 mt-0.5 leading-5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </Tag>
  );
}
