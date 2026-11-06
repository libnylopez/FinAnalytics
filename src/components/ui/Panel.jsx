import React from 'react';

/**
 * Tarjeta estándar: superficie, filo delicado, sombra muy sutil y encabezado opcional
 * (título en Manrope, descripción y acciones). `divided` separa el encabezado con una línea.
 * Las tarjetas informativas no tienen estado hover: solo los elementos interactivos reaccionan.
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
  const bodyClass = bodyClassName ?? (hasHeader ? (divided ? 'p-6' : 'px-6 pb-6') : 'p-6');
  return (
    <Tag className={`bg-surface border border-line rounded-card shadow-card ${className}`}>
      {hasHeader && (
        <header
          className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-6 pt-5 ${
            divided ? 'pb-4 border-b border-line' : 'pb-4'
          }`}
        >
          <div className="min-w-0">
            {title && <h2 className="font-display text-headline font-bold text-ink">{title}</h2>}
            {description && <p className="text-footnote text-ink-2 mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </Tag>
  );
}
