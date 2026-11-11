'use client';

import { useEffect, useState } from 'react';
import { navLinks, profile, socialLinks } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import LanguageToggle from './LanguageToggle';
import SocialIcon from './SocialIcon';
import { useIntro } from './CodexIntro';

/** Barra fija arriba: logo, idioma y un botón que abre un menú a pantalla completa. */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('inicio');
  const { t, ui } = useLanguage();
  const { backToFire } = useIntro();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    navLinks.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-void/80 backdrop-blur-xl">
        <nav aria-label={ui.nav.label} className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <a href="#inicio" onClick={() => setOpen(false)} className="font-mono text-lg font-extrabold tracking-tight" aria-label={profile.fullName}>
            {'<'}
            {profile.initials}
            {'/>'}
          </a>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                backToFire();
              }}
              title={ui.nav.backToFire}
              aria-label={ui.nav.backToFire}
              className="grid size-11 place-items-center rounded-full bg-surface text-lg ring-1 ring-line transition hover:ring-violet/60"
            >
              <span aria-hidden="true">🔥</span>
            </button>
            <LanguageToggle className="text-ink-dim [&_[aria-pressed=true]]:text-violet-light" />
            <a
              href={profile.cvUrl}
              download
              className="hidden rounded-full border border-line px-4 py-2 text-xs font-bold tracking-wide text-ink transition hover:border-violet hover:text-violet-light sm:inline-block"
            >
              {ui.nav.downloadCv} ↓
            </a>
            <button
              type="button"
              onClick={() => setOpen(value => !value)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              aria-label={open ? ui.nav.closeMenu : ui.nav.openMenu}
              className="grid size-11 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:ring-violet/60"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-px w-5 bg-current transition ${open ? 'top-1.5 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-1.5 h-px w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 top-3 h-px w-5 bg-current transition ${open ? 'top-1.5 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        id="menu-overlay"
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-void/97 backdrop-blur-2xl transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav aria-label={ui.nav.label} className="mx-auto w-full max-w-xl px-6">
          <ul className="space-y-2">
            {navLinks.map((link, index) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === link.id ? 'true' : undefined}
                  className="group flex items-baseline gap-4 py-2 text-4xl font-extrabold tracking-tight text-ink-dim transition hover:text-ink aria-[current]:text-violet-light sm:text-5xl"
                >
                  <span className="text-sm font-bold text-ink-faint group-hover:text-violet-light">{String(index + 1).padStart(2, '0')}</span>
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mx-auto mt-14 flex w-full max-w-xl flex-wrap items-center justify-between gap-4 border-t border-line px-6 pt-8">
          <a href={profile.cvUrl} download onClick={() => setOpen(false)} className="rounded-full bg-violet px-6 py-3 text-sm font-bold text-void transition hover:bg-violet-light">
            {ui.hero.downloadCv}
          </a>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-wide text-ink-faint">{ui.nav.follow}</span>
            {socialLinks
              .filter(link => link.url)
              .map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="grid size-10 place-items-center rounded-full bg-surface text-ink-dim ring-1 ring-line transition hover:text-violet-light hover:ring-violet/60"
                >
                  <SocialIcon label={link.label} size={17} />
                </a>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
