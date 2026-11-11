'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { AnnounceKey, ExperienceHandle } from '@/lib/scene/experience';
import { useLanguage } from '@/lib/i18n';
import LanguageToggle from './LanguageToggle';
import SoundToggle from './SoundToggle';

type Status = 'loading' | 'ready' | 'fallback';
type Target = 'book' | 'radio' | 'phone';

const IntroContext = createContext<{ backToFire(): void }>({ backToFire: () => {} });
/** Permite que el portafolio vuelva a mostrar la escena 3D. */
export const useIntro = () => useContext(IntroContext);

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const CAPS = "'Cinzel', Georgia, serif";

function Hotspot({ label, refCallback }: { label: string; refCallback: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={refCallback}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 flex flex-col items-center gap-2.5 text-[#eadcc3] opacity-0 transition-opacity duration-500"
    >
      <span className="size-[7px] rotate-45 border border-[#e8cf9e] shadow-[0_0_18px_#dca96755]" />
      <i className="whitespace-nowrap text-sm [text-shadow:0_1px_12px_#000]" style={{ fontFamily: DISPLAY }}>
        {label}
      </i>
    </div>
  );
}

/**
 * Portada 3D: el bosque con la fogata, el libro, la radio y el móvil.
 * Al abrir el libro o tomar el móvil, la escena se desvanece y aparece el portafolio (`children`).
 */
export default function CodexIntro({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hotspots = useRef<Record<Target, HTMLDivElement | null>>({ book: null, radio: null, phone: null });
  const handle = useRef<ExperienceHandle | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [visible, setVisible] = useState(true);
  // Al saltar la escena se libera la GPU; al volver a la fogata se crea de nuevo.
  const [sceneKey, setSceneKey] = useState(0);
  const [announcement, setAnnouncement] = useState<AnnounceKey | null>(null);
  const { ui } = useLanguage();

  const reveal = useCallback(() => setVisible(false), []);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const { book, radio, phone } = hotspots.current;
    if (!root || !canvas || !book || !radio || !phone) return;
    let cancelled = false;
    setStatus('loading');

    // three.js se carga solo en el navegador.
    import('@/lib/scene/experience').then(({ createExperience }) => {
      if (cancelled) return;
      handle.current = createExperience({
        canvas,
        root,
        hotspots: { book, radio, phone },
        onStatus: setStatus,
        onAnnounce: setAnnouncement,
        onOpen: reveal,
      });
    });

    return () => {
      cancelled = true;
      handle.current?.dispose();
      handle.current = null;
    };
  }, [reveal, sceneKey]);

  // Mientras la escena está a la vista, la página de abajo no se desplaza.
  useEffect(() => {
    document.documentElement.style.overflow = visible ? 'hidden' : '';
    if (visible) canvasRef.current?.focus({ preventScroll: true });
    // El portafolio siempre empieza arriba, en la portada.
    else window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [visible]);

  /** Entrar sin animación: se libera la escena para no gastar batería. */
  const skip = useCallback(() => {
    handle.current?.dispose();
    handle.current = null;
    reveal();
  }, [reveal]);

  const backToFire = useCallback(() => {
    setVisible(true);
    if (handle.current) handle.current.close();
    else setSceneKey(key => key + 1);
  }, []);

  return (
    <IntroContext.Provider value={{ backToFire }}>
      <div inert={visible} aria-hidden={visible}>
        {children}
      </div>

      <div
        ref={rootRef}
        aria-hidden={!visible}
        inert={!visible}
        className={`group/scene fixed inset-0 z-[60] overflow-hidden bg-[#100e0a] text-[#eadcc3] transition-opacity duration-700 ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <canvas ref={canvasRef} tabIndex={0} className="block size-full touch-none outline-none" aria-label={ui.scene.canvas} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_51%_55%,transparent_30%,#0b090539_70%,#090704ac_100%),linear-gradient(#0b09052b,transparent_30%,transparent_75%,#09070491)]" />
        <div className="film-grain absolute inset-0" />

        <Hotspot label={ui.scene.book} refCallback={el => { hotspots.current.book = el; }} />
        <Hotspot label={ui.scene.radio} refCallback={el => { hotspots.current.radio = el; }} />
        <Hotspot label={ui.scene.phone} refCallback={el => { hotspots.current.phone = el; }} />

        <header className="pointer-events-none absolute inset-x-[4.2%] top-6 flex items-center justify-between sm:top-8">
          <span className="flex items-center gap-4 text-[9px] leading-[1.9] tracking-[2px] text-[#d2c0a0]" style={{ fontFamily: CAPS }}>
            <span className="pr-2 text-[39px] leading-none tracking-[-9px] text-[#d4b57e]" style={{ fontFamily: DISPLAY }}>
              K<span className="text-[30px]">B</span>
            </span>
            <span className="hidden sm:block">
              KEVIN STIVEN
              <br />
              BUESAQUILLO TIMARÁN
            </span>
          </span>
          <span className="pointer-events-auto flex items-center gap-2 text-[#cbb38e]">
            <LanguageToggle />
            <SoundToggle />
            <button
              type="button"
              onClick={skip}
              className="ml-1 hidden rounded-full border border-[#d4b57e]/50 px-4 py-2 text-[10px] tracking-[2px] text-[#eadcc3] transition hover:bg-[#d4b57e]/15 sm:inline-block"
              style={{ fontFamily: CAPS }}
            >
              {ui.scene.skip} →
            </button>
          </span>
        </header>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 px-4 text-center text-xs tracking-wide text-[#ab9c84]">
          {status === 'loading' && (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block animate-[breathe_2s_ease-in-out_infinite] text-[#bea175]">✧</span> {ui.scene.loading}
            </span>
          )}
          {status === 'ready' && (
            <>
              {/* En celular el libro y el móvil pueden quedar fuera de la vista: botones directos. */}
              <div className="mb-3 hidden flex-wrap justify-center gap-2.5 group-data-[scene-state=idle]/scene:flex sm:!hidden">
                <button
                  type="button"
                  onClick={() => handle.current?.openBook()}
                  className="pointer-events-auto rounded-full border border-[#d4b57e]/60 bg-[#100e0a]/70 px-5 py-2.5 text-[11px] tracking-[2px] text-[#eadcc3] backdrop-blur-sm transition active:scale-95"
                  style={{ fontFamily: CAPS }}
                >
                  📖 {ui.scene.openBookButton}
                </button>
                <button
                  type="button"
                  onClick={() => handle.current?.openPhone()}
                  className="pointer-events-auto rounded-full border border-[#d4b57e]/60 bg-[#100e0a]/70 px-5 py-2.5 text-[11px] tracking-[2px] text-[#eadcc3] backdrop-blur-sm transition active:scale-95"
                  style={{ fontFamily: CAPS }}
                >
                  📱 {ui.scene.openPhoneButton}
                </button>
                <button type="button" onClick={skip} className="pointer-events-auto w-full pt-1 text-[11px] underline underline-offset-4">
                  {ui.scene.skip} →
                </button>
              </div>
              <span className="hidden sm:inline">{ui.scene.hintDesktop}</span>
              <span className="sm:hidden">{ui.scene.hintMobile}</span>
            </>
          )}
        </div>

        {status === 'fallback' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#17120c] p-8 text-center">
            <p className="text-4xl" style={{ fontFamily: DISPLAY }}>{ui.scene.fallbackTitle}</p>
            <span className="text-[#ab9c84]">{ui.scene.fallbackText}</span>
            <button type="button" onClick={skip} className="border border-[#bea175]/60 px-7 py-3 text-xs tracking-[2px]" style={{ fontFamily: CAPS }}>
              {ui.scene.fallbackButton}
            </button>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {announcement ? ui.scene.announce[announcement] : ''}
        </p>
      </div>
    </IntroContext.Provider>
  );
}
