'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { getAmbience } from '@/lib/scene/ambience';

const DESKTOP = '(min-width: 768px)';
const TURN_MS = 900;
const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"]';

export const PAGE_EVENT = 'codex-page-change';

export interface BookPages {
  /** true en escritorio: el libro se lee hoja por hoja. */
  paged: boolean;
  page: number;
  count: number;
  /** id de la sección de cada hoja (la última es el pie de página). */
  ids: string[];
  goTo(index: number, options?: { instant?: boolean }): void;
  next(): void;
  previous(): void;
}

/**
 * Convierte el contenido del libro en hojas: en escritorio cada sección es una hoja que se
 * pasa arrastrándola con el mouse, con la rueda, con las flechas o con los botones.
 * Con `allowPaging` en false (portafolio abierto desde el móvil) o en pantallas pequeñas
 * no hace nada y el contenido se lee con scroll.
 */
export function useBookPages(readerRef: RefObject<HTMLDivElement | null>, open: boolean, allowPaging: boolean): BookPages {
  const [desktop, setDesktop] = useState(false);
  const paged = desktop && allowPaging;
  const [page, setPage] = useState(0);
  const [ids, setIds] = useState<string[]>([]);
  const pagesRef = useRef<HTMLElement[]>([]);
  const pageRef = useRef(0);
  const lockedUntil = useRef(0);
  pageRef.current = page;

  // Detecta las hojas y si estamos en escritorio.
  useEffect(() => {
    const reader = readerRef.current;
    if (!reader) return;
    const pages = [...reader.querySelectorAll<HTMLElement>('main > section[id]')];
    const footer = reader.querySelector<HTMLElement>(':scope > footer');
    if (footer) {
      footer.id ||= 'colofon';
      pages.push(footer);
    }
    pagesRef.current = pages;
    setIds(pages.map(p => p.id));
    const query = window.matchMedia(DESKTOP);
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [readerRef]);

  // Aplica el estado de cada hoja.
  useEffect(() => {
    const reader = readerRef.current;
    const pages = pagesRef.current;
    if (!reader) return;
    if (!paged) {
      delete reader.dataset.paged;
      pages.forEach(p => p.removeAttribute('data-page'));
      return;
    }
    reader.dataset.paged = '';
    pages.forEach((p, i) => {
      p.dataset.page = i < page ? 'flipped' : i === page ? 'current' : i === page + 1 ? 'under' : 'hidden';
    });
    window.dispatchEvent(new CustomEvent(PAGE_EVENT, { detail: pages[page]?.id }));
  }, [paged, page, readerRef]);

  const goTo = useCallback(
    (index: number, { instant = false } = {}) => {
      const reader = readerRef.current;
      const last = pagesRef.current.length - 1;
      const target = Math.max(0, Math.min(last, index));
      if (target === pageRef.current) return;
      if (instant && reader) {
        reader.dataset.instant = '';
        requestAnimationFrame(() => requestAnimationFrame(() => delete reader.dataset.instant));
      } else {
        getAmbience().page();
      }
      lockedUntil.current = performance.now() + (instant ? 0 : TURN_MS * 0.8);
      pagesRef.current[target]?.scrollTo({ top: 0 });
      setPage(target);
    },
    [readerRef],
  );
  const next = useCallback(() => goTo(pageRef.current + 1), [goTo]);
  const previous = useCallback(() => goTo(pageRef.current - 1), [goTo]);

  // Interacciones: enlaces internos, teclado, rueda y arrastre con el mouse.
  useEffect(() => {
    const reader = readerRef.current;
    if (!reader || !paged || !open) return;
    const pages = pagesRef.current;
    const width = () => reader.clientWidth || window.innerWidth;
    const busy = () => performance.now() < lockedUntil.current;

    // Los enlaces #seccion pasan directamente a esa hoja.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const index = pages.findIndex(p => `#${p.id}` === link.getAttribute('href'));
      if (index < 0) return;
      event.preventDefault();
      goTo(index);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]')) return;
      if (['ArrowRight', 'PageDown'].includes(event.key)) { event.preventDefault(); if (!busy()) next(); }
      if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); if (!busy()) previous(); }
    };

    // La rueda primero desplaza la hoja si es larga; al llegar al borde, pasa a la siguiente.
    let accumulated = 0;
    let lastWheel = 0;
    const onWheel = (event: WheelEvent) => {
      const current = pages[pageRef.current];
      if (!current || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const now = performance.now();
      if (now - lastWheel > 250 || Math.sign(event.deltaY) !== Math.sign(accumulated)) accumulated = 0;
      lastWheel = now;
      const atBottom = current.scrollTop + current.clientHeight >= current.scrollHeight - 2;
      const atTop = current.scrollTop <= 1;
      if ((event.deltaY > 0 && !atBottom) || (event.deltaY < 0 && !atTop)) { accumulated = 0; return; }
      accumulated += event.deltaY;
      if (busy() || Math.abs(accumulated) < 90) return;
      accumulated = 0;
      if (event.deltaY > 0) next();
      else previous();
    };

    // Arrastrar la hoja con el mouse: hacia la izquierda avanza, hacia la derecha retrocede.
    let drag: { x: number; y: number; dx: number; started: boolean; el: HTMLElement | null; dir: 0 | 1 | -1 } | null = null;
    const turnAngle = (dx: number) => (dx / width()) * 170;
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || busy() || (event.target as Element).closest(INTERACTIVE)) return;
      if ((event.target as Element).closest('header')) return;
      drag = { x: event.clientX, y: event.clientY, dx: 0, started: false, el: null, dir: 0 };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.started) {
        if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) {
          if (Math.abs(dy) > 10) drag = null; // gesto vertical: es scroll, no arrastre
          return;
        }
        const dir = dx < 0 ? 1 : -1;
        const index = dir === 1 ? pageRef.current : pageRef.current - 1;
        if (dir === 1 && pageRef.current >= pages.length - 1) return;
        if (index < 0) return;
        drag.started = true;
        drag.dir = dir;
        drag.el = pages[index];
        drag.el.style.transition = 'none';
        if (dir === -1) {
          drag.el.style.visibility = 'visible';
          drag.el.style.zIndex = '5';
        }
        reader.dataset.dragging = '';
        window.getSelection()?.removeAllRanges();
      }
      drag.dx = dx;
      const angle = drag.dir === 1 ? Math.max(-112, Math.min(0, turnAngle(dx))) : Math.min(0, -112 + Math.max(0, turnAngle(dx)));
      if (drag.el) drag.el.style.transform = `perspective(4000px) rotateY(${angle}deg)`;
    };
    const onPointerUp = () => {
      if (!drag) return;
      const { started, el, dx, dir } = drag;
      drag = null;
      if (!started || !el) return;
      delete reader.dataset.dragging;
      el.style.transition = '';
      el.style.transform = '';
      el.style.visibility = '';
      el.style.zIndex = '';
      if (Math.abs(dx) > width() * 0.15) {
        if (dir === 1) next();
        else previous();
      }
    };

    reader.addEventListener('click', onClick);
    reader.addEventListener('wheel', onWheel, { passive: true });
    reader.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKey);
    return () => {
      reader.removeEventListener('click', onClick);
      reader.removeEventListener('wheel', onWheel);
      reader.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKey);
    };
  }, [readerRef, paged, open, goTo, next, previous]);

  return { paged, page, count: ids.length, ids, goTo, next, previous };
}
