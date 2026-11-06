import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';
import { RajilMark } from './brand/RajilLogo';

export default function TeamModal({ isOpen, onClose, projectInfo }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Cerrar con Escape, llevar el foco al diálogo y devolverlo al cerrar
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-fade-in print:hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-modal-title"
        className="bg-surface rounded-2xl border border-line shadow-pop max-w-2xl w-full flex flex-col max-h-[90vh] animate-sheet-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <RajilMark size={30} />
            <div>
              <h2 id="team-modal-title" className="text-[17px] font-semibold text-ink">
                Equipo del proyecto RAJIL
              </h2>
              <p className="text-[13px] text-ink-2 mt-0.5">
                {projectInfo.university} · {projectInfo.campus}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 grid place-items-center rounded-full text-ink-2 bg-ink/[0.06] hover:bg-ink/10 hover:text-ink cursor-pointer transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="px-6 py-5 overflow-y-auto space-y-6 text-sm">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              ['Curso', projectInfo.course],
              ['Catedrática', projectInfo.professor],
              ['Carrera', projectInfo.program],
              ['Fecha de entrega', projectInfo.deliveryDate]
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-2">{label}</dt>
                <dd className="text-ink mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h3 className="text-[13px] font-semibold text-ink mb-2">Integrantes</h3>
            <ul className="divide-y divide-line rounded-xl border border-line overflow-hidden">
              {projectInfo.members.map((member) => (
                <li key={member.name} className="px-4 py-3 bg-surface-2/50">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                    <span className="font-medium text-ink">{member.name}</span>
                    <span className="text-xs text-ink-2">
                      {member.scrumRole} · {member.technicalArea}
                    </span>
                  </div>
                  <p className="text-xs text-ink-2 mt-1 leading-relaxed">{member.technicalDuty}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-ink-2">
            El cronograma de sprints y el Product Backlog están documentados en CRONOGRAMA_SPRINTS_SCRUM.md.
          </p>
        </div>

        <footer className="px-6 py-3.5 border-t border-line flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </footer>
      </div>
    </div>
  );
}
