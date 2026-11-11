'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ExperienceHandle } from '@/lib/scene/experience';
import { ReaderContext } from './ReaderContext';
import SoundToggle from './SoundToggle';
import PhoneApp from './PhoneApp';
import { useBookPages } from './useBookPages';
import { navLinks } from '@/data/profile';

const pageNames: Record<string, string> = { ...Object.fromEntries(navLinks.map(l => [l.id, l.label])), colofon: 'Colofón' };
const roman = (n: number) =>
  [['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]].reduce((out, [r, v]) => {
    let acc = out;
    while (n >= (v as number)) { acc += r; n -= v as number; }
    return acc;
  }, '');

type Status = 'loading' | 'ready' | 'fallback';
type Target = 'book' | 'radio' | 'phone';

function Hotspot({ label, refCallback }: { label: string; refCallback: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={refCallback}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 flex flex-col items-center gap-2.5 text-parchment opacity-0 transition-opacity duration-500"
    >
      <span className="size-[7px] rotate-45 border border-[#e8cf9e] shadow-[0_0_18px_#dca96755]" />
      <i className="whitespace-nowrap text-sm [text-shadow:0_1px_12px_#000]">{label}</i>
    </div>
  );
}

/**
 * Portada: solo el paisaje 3D. Al abrir el libro (o tomar el móvil) aparece el portafolio,
 * que vive dentro de las páginas del libro (`children`).
 */
export default function CodexExperience({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const hotspots = useRef<Record<Target, HTMLDivElement | null>>({ book: null, radio: null, phone: null });
  const handle = useRef<ExperienceHandle | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string>('inicio');
  // Abierto con el libro: se pasan hojas. Abierto con el móvil: se hace scroll, como en un teléfono.
  const [mode, setMode] = useState<'book' | 'phone'>('book');
  const book = useBookPages(readerRef, open, mode === 'book');

  const showReader = useCallback((target: string, how: 'book' | 'phone' = 'book') => {
    setMode(how);
    setSection(target);
    setOpen(true);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const { book, radio, phone } = hotspots.current;
    if (!root || !canvas || !book || !radio || !phone) return;
    let cancelled = false;

    // three.js se carga solo en el navegador.
    import('@/lib/scene/experience').then(({ createExperience }) => {
      if (cancelled) return;
      handle.current = createExperience({
        canvas,
        root,
        hotspots: { book, radio, phone },
        onStatus: setStatus,
        onAnnounce: setMessage,
        onOpen: how => showReader('inicio', how),
      });
    });

    return () => {
      cancelled = true;
      handle.current?.dispose();
      handle.current = null;
    };
  }, [showReader]);

  // Al abrir: ir a la sección pedida y mover el foco dentro del libro.
  useEffect(() => {
    const reader = readerRef.current;
    if (!open || !reader) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    if (mode === 'phone') return () => window.removeEventListener('keydown', onKey);
    if (book.paged) {
      book.goTo(Math.max(0, book.ids.indexOf(section)), { instant: true });
    } else {
      const target = document.getElementById(section);
      reader.scrollTo({ top: target && section !== 'inicio' ? target.offsetTop - 72 : 0, behavior: 'instant' });
    }
    reader.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, section, book.paged, mode]);

  const close = useCallback(() => {
    setOpen(false);
    handle.current?.close();
    canvasRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <ReaderContext.Provider value={{ close }}>
      {/* ---------- Paisaje 3D ---------- */}
      <div ref={rootRef} className="fixed inset-0 overflow-hidden bg-night text-parchment" aria-hidden={open}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          className="block size-full touch-none outline-none"
          aria-label="Bosque nocturno con una fogata. Junto a ti hay un libro antiguo, una radio y un móvil. Pulsa el libro (o Enter) para abrir el portafolio."
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_51%_55%,transparent_30%,#0b090539_70%,#090704ac_100%),linear-gradient(#0b09052b,transparent_30%,transparent_75%,#09070491)]" />
        <div className="film-grain absolute inset-0" />

        <Hotspot label="El libro" refCallback={el => { hotspots.current.book = el; }} />
        <Hotspot label="La radio" refCallback={el => { hotspots.current.radio = el; }} />
        <Hotspot label="El móvil" refCallback={el => { hotspots.current.phone = el; }} />

        <header className="pointer-events-none absolute inset-x-[4.2%] top-6 flex items-center justify-between sm:top-8">
          <span className="flex items-center gap-4 font-caps text-[9px] leading-[1.9] tracking-[2px] text-[#d2c0a0]">
            <span className="pr-2 font-display text-[39px] leading-none tracking-[-9px] text-[#d4b57e]">
              K<span className="text-[30px]">B</span>
            </span>
            <span className="hidden sm:block">
              KEVIN STIVEN
              <br />
              BUESAQUILLO TIMARÁN
            </span>
          </span>
          <span className="pointer-events-auto text-[#cbb38e]">
            <SoundToggle />
          </span>
        </header>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 px-4 text-center text-xs tracking-wide text-smoke">
          {status === 'loading' && (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block animate-[breathe_2s_ease-in-out_infinite] text-gold">✧</span> Preparando la lumbre…
            </span>
          )}
          {status === 'ready' && (
            <>
              <span className="hidden sm:inline">Mueve el ratón para mirar alrededor · pulsa el libro para abrirlo</span>
              <span className="sm:hidden">Desliza para girar · toca el libro para abrirlo</span>
            </>
          )}
        </div>

        {status === 'fallback' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ember p-8 text-center">
            <p className="font-display text-4xl">La historia continúa en el papel.</p>
            <span className="text-smoke">Esta pantalla no pudo iniciar la escena 3D.</span>
            <button type="button" onClick={() => showReader('inicio')} className="border border-gold/60 px-7 py-3 font-caps text-xs tracking-[2px]">
              Abrir el portafolio
            </button>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {message}
        </p>
      </div>

      {/* ---------- Las páginas del libro: el portafolio ---------- */}
      <div
        ref={readerRef}
        id="libro"
        role="dialog"
        aria-modal="true"
        aria-label="Portafolio de Kevin Stiven Buesaquillo Timarán"
        tabIndex={-1}
        inert={!open || mode !== 'book'}
        className={`paper-texture fixed inset-0 z-40 overflow-y-auto overscroll-contain scroll-smooth outline-none transition-opacity duration-700 ${
          open && mode === 'book' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {children}

        {/* Barra de hojas (solo escritorio) */}
        {book.paged && (
          <div className="absolute inset-x-0 bottom-0 z-50 flex h-14 items-center justify-between border-t border-ink/15 bg-paper/95 px-6 text-ink backdrop-blur-sm lg:px-10">
            <button
              type="button"
              onClick={book.previous}
              disabled={book.page === 0}
              className="flex items-center gap-2 py-2 text-[15px] transition hover:text-oxblood disabled:opacity-25"
            >
              <span aria-hidden="true">←</span> Hoja anterior
            </button>
            <p className="text-center" aria-live="polite" aria-atomic="true">
              <span className="font-caps text-[11px] tracking-[2.5px] text-ink-muted">
                Folio {roman(book.page + 1)} <i className="font-body normal-case italic tracking-normal">de</i> {roman(book.count)}
              </span>
              <span className="mx-3 text-gold" aria-hidden="true">✧</span>
              <span className="font-display text-lg italic">{pageNames[book.ids[book.page]] ?? ''}</span>
              <span className="ml-4 hidden text-xs italic text-ink-muted xl:inline">arrastra la hoja, usa la rueda o las flechas ← →</span>
            </p>
            <button
              type="button"
              onClick={book.next}
              disabled={book.page >= book.count - 1}
              className="flex items-center gap-2 py-2 text-[15px] transition hover:text-oxblood disabled:opacity-25"
            >
              Pasar la hoja <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      {/* ---------- La pantalla del móvil: el portafolio como app ---------- */}
      <PhoneApp open={open && mode === 'phone'} onClose={close} />
    </ReaderContext.Provider>
  );
}
