import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

/**
 * Confirmación breve de una acción completada ("Proyección aplicada", "CSV descargado").
 * Aparece con un fundido, se anuncia a los lectores de pantalla y desaparece sola.
 */
export function useActionFeedback(duration = 2600) {
  const [message, setMessage] = useState(null);
  const [nonce, setNonce] = useState(0);
  const timer = useRef(null);

  const show = useCallback(
    (text) => {
      window.clearTimeout(timer.current);
      setMessage(text);
      setNonce((n) => n + 1);
      timer.current = window.setTimeout(() => setMessage(null), duration);
    },
    [duration]
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { message, nonce, show };
}

export default function ActionFeedback({ message, nonce, className = '' }) {
  return (
    <span role="status" aria-live="polite" className={`inline-flex min-h-[20px] ${className}`}>
      {message && (
        <span key={nonce} className="inline-flex items-center gap-1.5 text-footnote font-medium text-positive animate-rise-in">
          <span className="w-4 h-4 rounded-full bg-positive/10 grid place-items-center">
            <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
          </span>
          {message}
        </span>
      )}
    </span>
  );
}
