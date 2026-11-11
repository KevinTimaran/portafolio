'use client';

import { useEffect, useState } from 'react';
import { navLinks, profile } from '@/data/profile';
import { useReader } from './ReaderContext';
import SoundToggle from './SoundToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/lib/i18n';
import { PAGE_EVENT } from './useBookPages';

/** Menú del libro: fijo arriba mientras se recorren las páginas. */
export default function Navbar() {
  const { close } = useReader();
  const { t, ui } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('inicio');

  useEffect(() => {
    const reader = document.getElementById('libro');
    // Celular (scroll): la sección activa es la que ocupa el centro de la pantalla.
    const observer = new IntersectionObserver(
      entries => {
        if (reader?.dataset.paged !== undefined) return;
        entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id));
      },
      { root: reader, rootMargin: '-45% 0px -50% 0px' },
    );
    navLinks.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    // Escritorio (hojas): la sección activa es la hoja abierta.
    const onPage = (event: Event) => {
      setActive((event as CustomEvent<string>).detail);
      setOpen(false);
    };
    window.addEventListener(PAGE_EVENT, onPage);
    return () => {
      observer.disconnect();
      window.removeEventListener(PAGE_EVENT, onPage);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 text-ink shadow-sm backdrop-blur-md">
      <nav aria-label={ui.nav.label} className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#inicio" onClick={() => setOpen(false)} className="flex items-center gap-3" aria-label={ui.nav.home(profile.fullName)}>
          <span className="pr-1.5 font-display text-3xl leading-none tracking-[-6px] text-oxblood">
            K<span className="text-2xl">B</span>
          </span>
          <span className="hidden font-caps text-[9px] leading-[1.7] tracking-[2px] sm:block xl:block lg:hidden">
            KEVIN STIVEN
            <br />
            BUESAQUILLO TIMARÁN
          </span>
        </a>

        <ul className="hidden items-center gap-5 lg:flex">
          {navLinks.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                className="relative py-2 text-[15px] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:text-oxblood hover:after:scale-x-100 aria-[current]:text-oxblood aria-[current]:after:scale-x-100"
              >
                {t(link.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle className="text-ink-muted [&_[aria-pressed=true]]:text-oxblood" />
          <SoundToggle />
          <a
            href={profile.cvUrl}
            download
            className="hidden rounded-sm border border-oxblood/50 px-4 py-2 font-caps text-[10px] tracking-[2px] text-oxblood transition hover:bg-oxblood hover:text-paper sm:inline-block"
          >
            {ui.nav.cv}
          </a>
          <button
            type="button"
            onClick={close}
            className="hidden whitespace-nowrap px-3 py-2 text-sm italic text-ink-muted transition hover:text-oxblood sm:block"
          >
            {ui.nav.closeBook}
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? ui.nav.closeMenu : ui.nav.openMenu}
            onClick={() => setOpen(value => !value)}
          >
            <span className="relative block h-3.5 w-6">
              <span className={`absolute left-0 top-0 h-px w-6 bg-current transition ${open ? 'top-1.5 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-1.5 h-px w-6 bg-current transition ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-3 h-px w-6 bg-current transition ${open ? 'top-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      <div id="menu-movil" hidden={!open} className="border-t border-ink/10 lg:hidden">
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-8">
          {navLinks.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-ink/5 py-3 font-display text-xl aria-[current]:text-oxblood"
                aria-current={active === link.id ? 'true' : undefined}
              >
                {t(link.label)}
              </a>
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-4 pt-4">
            <a href={profile.cvUrl} download className="inline-block rounded-sm bg-oxblood px-5 py-3 font-caps text-xs tracking-[2px] text-paper">
              {ui.nav.downloadCv}
            </a>
            <button type="button" onClick={() => { setOpen(false); close(); }} className="py-3 italic text-ink-muted">
              {ui.nav.closeBookLong}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
