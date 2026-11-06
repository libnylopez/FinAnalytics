import { useEffect, useLayoutEffect, useState } from 'react';

/**
 * Mide la posición del elemento activo dentro de un contenedor para dibujar un indicador
 * que se desliza entre opciones (barra lateral, controles segmentados).
 * La primera medición no se anima, para que el indicador no "viaje" al cargar la página.
 *
 * @param {React.RefObject<HTMLElement>} containerRef contenedor con position: relative
 * @param {string} selector selector del elemento activo dentro del contenedor
 * @param {any} activeKey valor que cambia cuando cambia la selección
 */
export default function useIndicator(containerRef, selector, activeKey) {
  const [rect, setRect] = useState(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const measure = () => {
      const el = container.querySelector(selector);
      setRect(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, selector, activeKey]);

  useEffect(() => {
    if (!rect || animate) return undefined;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [rect, animate]);

  const style = rect
    ? {
        width: rect.w,
        height: rect.h,
        transform: `translate3d(${rect.x}px, ${rect.y}px, 0)`,
        transitionProperty: animate ? 'transform, width, height' : 'none'
      }
    : { opacity: 0 };

  return style;
}
