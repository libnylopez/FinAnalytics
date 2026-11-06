// RAJIL — exporta los recursos de marca en SVG a partir de la geometría de la app.
// Uso: node scripts/export-brand.mjs   (sin dependencias)
// Salida: public/favicon.svg y public/brand/*.svg
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAJIL_PATHS, RAJIL_PATHS_SMALL, RAJIL_COLORS as C } from '../src/components/brand/rajilGeometry.js';
import { RAJIL_WORDMARK as W } from '../src/components/brand/rajilWordmark.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'brand');
fs.mkdirSync(OUT, { recursive: true });

const XML = '<?xml version="1.0" encoding="UTF-8"?>\n';
const mark = (fill, p = RAJIL_PATHS) => `<path fill="${fill}" d="${p.hook}"/><path fill="${fill}" d="${p.block}"/>`;

// Isotipo: lienzo de 100 u con el margen de la retícula
const isotipo = (fill, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512" role="img" aria-label="RAJIL">` +
  (bg ? `<rect width="100" height="100" fill="${bg}"/>` : '') +
  mark(fill) +
  `</svg>`;

// Logotipo horizontal: isotipo (alto visible 72 u) + nombre (mayúscula 34 u), separación 16 u
function logotipo(markFill, wordFill, bg) {
  const capH = 34;
  const wx = 90 + 16;
  const ww = (W.width * capH) / 100;
  const s = (W.scale * capH) / 100;
  const pad = bg ? 14 : 0; // margen extra cuando el logotipo lleva fondo propio
  const x0 = 4 - pad;
  const y0 = 6 - pad;
  const width = wx + ww + 8 + pad - x0;
  const height = 88 + pad * 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${width.toFixed(2)} ${height}" width="${(width * 4).toFixed(0)}" height="${height * 4}" role="img" aria-label="RAJIL">` +
    (bg ? `<rect x="${x0}" y="${y0}" width="${width.toFixed(2)}" height="${height}" fill="${bg}"/>` : '') +
    mark(markFill) +
    `<path fill="${wordFill}" transform="translate(${wx},${50 - capH / 2}) scale(${s.toFixed(5)})" d="${W.d}"/>` +
    `</svg>`
  );
}

// Ícono de app: capa cuadrada sin máscara (el sistema aplica las esquinas); el isotipo ocupa ~60 %
const ICON_SCALE = 0.82;
const iconMark = (fill, p) => `<g transform="translate(${(100 - 100 * ICON_SCALE) / 2},${(100 - 100 * ICON_SCALE) / 2}) scale(${ICON_SCALE})">${mark(fill, p)}</g>`;
const iconoApp = (bg, fill, rounded = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024" role="img" aria-label="RAJIL">` +
  `<rect width="100" height="100" ${rounded ? 'rx="22.37" ' : ''}fill="${bg}"/>` +
  iconMark(fill, RAJIL_PATHS) +
  `</svg>`;

// Favicon: placa redondeada + versión simplificada (canal y contraforma más abiertos)
const favicon =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">` +
  `<rect width="100" height="100" rx="22" fill="${C.blue}"/>` +
  `<g transform="translate(6,6) scale(0.88)">${mark(C.white, RAJIL_PATHS_SMALL)}</g>` +
  `</svg>`;

const files = {
  'rajil-isotipo.svg': isotipo(C.blue),
  'rajil-isotipo-oscuro.svg': isotipo(C.blueOnDark, C.darkSurface),
  'rajil-isotipo-negro.svg': isotipo(C.black),
  'rajil-isotipo-blanco.svg': isotipo(C.white, C.black),
  'rajil-logotipo.svg': logotipo(C.blue, C.navy),
  'rajil-logotipo-oscuro.svg': logotipo(C.blueOnDark, C.white, C.darkSurface),
  'rajil-logotipo-negro.svg': logotipo(C.black, C.black),
  'rajil-logotipo-blanco.svg': logotipo(C.white, C.white, C.black),
  'rajil-icono-app.svg': iconoApp(C.blue, C.white),
  'rajil-icono-app-redondeado.svg': iconoApp(C.blue, C.white, true),
  'rajil-icono-app-oscuro.svg': iconoApp('#1C1C1E', C.blueOnDark),
  'rajil-favicon.svg': favicon
};

for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), XML + svg + '\n');
fs.writeFileSync(path.join(ROOT, 'public', 'favicon.svg'), XML + favicon + '\n');
console.log(`public/favicon.svg y ${Object.keys(files).length} archivos en public/brand/`);
