import React from 'react';

/**
 * Apertura editorial de cada módulo dentro de la hoja de trabajo:
 * antetítulo opcional, título en Manrope y una frase que dice para qué sirve la pantalla.
 */
export default function PageIntro({ eyebrow, title, description, actions, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-4 ${className}`}>
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h1 className="font-display text-[32px] leading-[38px] sm:text-[40px] sm:leading-[46px] font-semibold tracking-[-0.03em] text-ink text-balance">
          {title}
        </h1>
        {description && <p className="mt-3 text-body text-ink-2 max-w-2xl text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
