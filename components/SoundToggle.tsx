'use client';

import { useEffect, useState } from 'react';
import { getAmbience } from '@/lib/scene/ambience';

const EVENT = 'codex-sound-change';

/** Botón de sonido. Hay uno en el paisaje y otro en el libro; ambos se mantienen sincronizados. */
export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = (event: Event) => setEnabled((event as CustomEvent<boolean>).detail);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  async function toggle() {
    const next = await getAmbience().toggle();
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Silenciar el sonido de la fogata' : 'Activar el sonido de la fogata'}
      title={enabled ? 'Silenciar sonido' : 'Activar sonido'}
      className="grid size-10 place-items-center opacity-80 transition hover:opacity-100"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-[22px]" aria-hidden="true">
        <path d="M4 10h4l5-4v12l-5-4H4z" />
        {enabled ? <path d="M17 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14" /> : <path d="m17 10 5 5m0-5-5 5" />}
      </svg>
    </button>
  );
}
