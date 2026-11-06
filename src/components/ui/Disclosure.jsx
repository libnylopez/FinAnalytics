import React from 'react';

/**
 * Contenido desplegable con transición de altura (200 ms).
 * Cerrado, el contenido queda inerte: no recibe foco ni lo anuncian los lectores de pantalla.
 */
export default function Disclosure({ open, id, children, className = '' }) {
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      } ${className}`}
      aria-hidden={!open}
      {...(open ? {} : { inert: '' })}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  );
}
