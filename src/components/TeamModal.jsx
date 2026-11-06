import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';

export default function TeamModal({ isOpen, onClose, projectInfo }) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 print:hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-modal-title"
        className="bg-white rounded-md border border-slate-200 shadow-lg max-w-2xl w-full flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div>
            <h2 id="team-modal-title" className="text-base font-semibold text-slate-900">
              Equipo del proyecto
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {projectInfo.university} · {projectInfo.campus}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="px-6 py-5 overflow-y-auto space-y-6 text-sm">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              ['Curso', projectInfo.course],
              ['Catedrática', projectInfo.professor],
              ['Carrera', projectInfo.program],
              ['Fecha de entrega', projectInfo.deliveryDate]
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Integrantes</h3>
            <ul className="divide-y divide-slate-100 border-y border-slate-200">
              {projectInfo.members.map((member) => (
                <li key={member.name} className="py-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                    <span className="font-medium text-slate-900">{member.name}</span>
                    <span className="text-xs text-slate-500">
                      {member.scrumRole} · {member.technicalArea}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{member.technicalDuty}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-500">
            El cronograma de sprints y el Product Backlog están documentados en CRONOGRAMA_SPRINTS_SCRUM.md.
          </p>
        </div>

        <footer className="px-6 py-3 border-t border-slate-200 flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </footer>
      </div>
    </div>
  );
}
