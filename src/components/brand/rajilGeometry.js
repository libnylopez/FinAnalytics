/**
 * RAJIL — geometría del isotipo (concepto A, "R geométrica").
 *
 * Retícula de 100 × 100 u. La R se compone de dos piezas sólidas:
 *  1. Gancho: travesaño con extremo redondeado que se curva en la panza y continúa en la pierna.
 *  2. Bloque: base del fuste, separada del gancho por la contraforma (abierta a la izquierda)
 *     y por un canal diagonal paralelo a la pierna.
 *
 * Sistema: grosor de trazo 20 u · pierna a 53,13° (pendiente 4:3) · panza de radio 24 u.
 * Este módulo no depende de React: lo usan los componentes y el script que exporta los SVG.
 */

const r2 = (n) => Math.round(n * 100) / 100;

/**
 * @param {object} [opts]
 * @param {number} [opts.channel=11]  ancho horizontal del canal diagonal (11 u ≈ 8.8 u perpendicular)
 * @param {number} [opts.counter=16]  alto de la contraforma entre travesaño y bloque
 */
export function rajilPaths({ channel = 11, counter = 16 } = {}) {
  const k = 0.75; // desplazamiento horizontal por unidad vertical de la pierna (pendiente 4:3)
  // Pierna: borde derecho x = 90 − k(86 − y); borde izquierdo x = 65 − k(86 − y)
  const legR = (y) => 90 - k * (86 - y);
  const legL = (y) => 65 - k * (86 - y);

  // Encuentro de la panza (centro 64,38; r 24) con el borde derecho de la pierna, suavizado
  const a = (58 * Math.PI) / 180;
  const arcEnd = [64 + 24 * Math.cos(a), 38 + 24 * Math.sin(a)];

  const hook = [
    'M21,14',
    'H64',
    `A24,24 0 0 1 ${r2(arcEnd[0])},${r2(arcEnd[1])}`,
    `Q71.2,60.9 ${r2(legR(66))},66`,
    `L${r2(legR(80.5))},80.5`,
    'Q90,86 84,86',
    'H67',
    `Q65,86 ${r2(legL(84.5))},84.5`,
    // rodilla redondeada y fondo de la panza en una sola curva hasta el lado interior
    `L${r2(legL(64))},64`,
    `Q${r2(legL(61))},61 49,56.6`,
    'Q51.5,52.6 57,52',
    'A9,9 0 0 0 66,43',
    'A9,9 0 0 0 57,34',
    'H21',
    'A9,9 0 0 1 12,25',
    'V23',
    'A9,9 0 0 1 21,14',
    'Z'
  ].join(' ');

  // Bloque: su borde derecho es paralelo a la pierna, separado por `channel`
  const top = 34 + counter;
  const blockR = (y) => legL(y) - channel;
  const block = [
    `M19,${top}`,
    `H${r2(blockR(top) - 2.5)}`,
    `Q${r2(blockR(top))},${top} ${r2(blockR(top + 2.2))},${r2(top + 2.2)}`,
    `L${r2(blockR(83.6))},83.6`,
    `Q${r2(blockR(86))},86 ${r2(blockR(86) - 3)},86`,
    'H18',
    'A6,6 0 0 1 12,80',
    `V${top + 7}`,
    `A7,7 0 0 1 19,${top}`,
    'Z'
  ].join(' ');

  return { hook, block };
}

/** Versión estándar (16 px en adelante). */
export const RAJIL_PATHS = rajilPaths();

/** Versión para favicon: canal y contraforma más abiertos para que no se cierren a 16 px. */
export const RAJIL_PATHS_SMALL = rajilPaths({ channel: 14, counter: 18 });

/** Colores de marca. La interfaz usa los tokens CSS --rajil y --rajil-ink (claro/oscuro). */
export const RAJIL_COLORS = {
  blue: '#1F5BFF',
  blueOnDark: '#4C8DFF',
  navy: '#0B1F3A',
  white: '#FFFFFF',
  black: '#000000',
  darkSurface: '#161618'
};
