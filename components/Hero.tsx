'use client';

import { profile } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';

/** Primera página del libro: bienvenida con CV. */
export default function Hero() {
  const { lang, t, ui } = useLanguage();
  const [open, close] = lang === 'es' ? ['«', '»'] : ['“', '”'];

  return (
    <section id="inicio" aria-label={ui.hero.label} className="px-4 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center gap-3 font-caps text-[11px] tracking-[3px] text-oxblood">
          <span className="h-px w-8 bg-oxblood/50" />
          {ui.hero.eyebrow}
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.02] tracking-tight">
          {profile.name}
          <br />
          <em className="text-oxblood">{profile.surname}</em>
        </h1>
        <p className="mt-4 font-caps text-xs tracking-[2.5px] text-ink-muted sm:text-sm">{t(profile.role)}</p>
        <div className="my-6 h-px w-16 bg-oxblood/40" aria-hidden="true" />
        <p className="max-w-xl font-display text-2xl italic leading-relaxed">
          {open}
          {t(profile.tagline)}
          {close}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={ui.hero.focus}>
          {profile.focus.map(item => (
            <li key={t(item)} className="rounded-full border border-oxblood/30 px-3 py-1 font-caps text-[10px] tracking-[1.5px] text-oxblood">
              {t(item)}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={profile.cvUrl}
            download
            className="inline-flex items-center gap-2 rounded-sm bg-oxblood px-6 py-3 font-caps text-xs tracking-[2px] text-paper shadow-md transition hover:bg-ink"
          >
            {ui.hero.downloadCv} <span aria-hidden="true">↓</span>
          </a>
          <a
            href="#proyectos"
            className="inline-flex items-center gap-2 rounded-sm border border-ink/30 px-6 py-3 font-caps text-xs tracking-[2px] transition hover:border-oxblood hover:text-oxblood"
          >
            {ui.hero.seeProjects} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
