/**
 * Utilidades de formato para la presentación de cifras.
 * Solo afectan la visualización: los valores calculados por el motor no se modifican.
 */

const LOCALE = 'es-GT';

const moneyFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const decimalFormatter = (digits) =>
  new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });

/**
 * Formato contable: Q 12,345.00 · (Q 12,345.00) · Q 0.00
 */
export function formatMoney(value, symbol = 'Q') {
  const n = Number(value) || 0;
  const abs = moneyFormatter.format(Math.abs(n));
  const isNegative = n < 0 && abs !== moneyFormatter.format(0);
  return isNegative ? `(${symbol} ${abs})` : `${symbol} ${abs}`;
}

/** Indica si la cifra se mostrará como negativa (para aplicar color). */
export function isNegativeAmount(value) {
  const n = Number(value) || 0;
  return n < 0 && moneyFormatter.format(Math.abs(n)) !== moneyFormatter.format(0);
}

export function formatPercent(value, digits = 1) {
  return `${decimalFormatter(digits).format(Number(value) || 0)}%`;
}

export function formatNumber(value, digits = 2) {
  return decimalFormatter(digits).format(Number(value) || 0);
}

/**
 * Período de recuperación. Si la inversión no se recupera dentro del horizonte
 * de 5 años, el motor devuelve 5; en ese caso se muestra el texto correspondiente.
 */
export function formatPayback(years, recovered = true) {
  if (!recovered) return 'No se recupera en 5 años';
  return `${formatNumber(years)} años`;
}

/**
 * Las razones financieras llegan como texto ya formateado por el motor
 * (ej. "51,200" para montos). Convierte un monto de ese tipo a formato contable.
 */
export function formatMoneyString(text, symbol = 'Q') {
  const n = Number(String(text).replace(/,/g, ''));
  return Number.isFinite(n) ? formatMoney(n, symbol) : `${symbol} ${text}`;
}
