import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'finanalytics_theme';
const QUERY = '(prefers-color-scheme: dark)';

/**
 * Preferencia de apariencia: 'system' (sigue al sistema operativo), 'light' o 'dark'.
 * - 'system' es el valor inicial y no se guarda: la app acompaña los cambios del sistema.
 * - 'light' y 'dark' se guardan en localStorage.
 * El script de index.html aplica la clase antes del primer pintado (sin destello).
 */
function readPreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
}

function applyTheme(isDark, animate) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (animate && !reduceMotion && root.classList.contains('dark') !== isDark) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 260);
  }
  root.classList.toggle('dark', isDark);
}

export default function useTheme() {
  const [preference, setPreferenceState] = useState(readPreference);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const resolve = (animate) => {
      const isDark = preference === 'dark' || (preference === 'system' && media.matches);
      applyTheme(isDark, animate);
    };
    resolve(true);
    if (preference !== 'system') return undefined;
    const onChange = () => resolve(true);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  const setPreference = useCallback((value) => {
    try {
      if (value === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Sin almacenamiento disponible: la preferencia dura solo esta sesión.
    }
    setPreferenceState(value);
  }, []);

  return { preference, setPreference };
}
