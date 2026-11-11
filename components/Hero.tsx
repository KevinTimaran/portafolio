'use client';

import { profile, socialLinks } from '@/data/profile';
import { projects } from '@/data/projects';
import { useLanguage } from '@/lib/i18n';
import SocialIcon from './SocialIcon';

/** Portada: nombre, rol, llamadas a la acción y unas cifras rápidas. */
export default function Hero() {
  const { t, ui } = useLanguage();
  const location = profile.facts.find(f => /ubicaci|location/i.test(t(f.label)))?.value;
  const semester = profile.facts.find(f => /semestre|semester/i.test(t(f.label)))?.value;
  const stackCount = new Set(profile.stack.flatMap(g => g.items.map(i => t(i)))).size;

  return (
    <section id="inicio" aria-label="Hero" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-28 sm:px-8">
      <div aria-hidden="true" className="dot-field absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000,transparent)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-[-10%] size-[560px] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-ink-dim ring-1 ring-line">
          <span className="size-1.5 animate-pulse rounded-full bg-mint" />
          {ui.hero.availableFor}
        </span>

        <p className="mt-7 text-lg font-medium text-ink-dim">{ui.hero.greeting}</p>
        <h1 className="mt-1 text-[clamp(2.6rem,9vw,5.5rem)] font-extrabold leading-[0.98] tracking-tight">
          {profile.name}
          <br />
          {profile.surname}
        </h1>
        <p className="mt-4 text-lg font-semibold text-violet-light sm:text-xl">
          {t(profile.role)}
          {location && <span className="text-ink-dim"> · {ui.hero.basedIn(t(location))}</span>}
        </p>
        <p className="mt-5 max-w-xl text-xl italic text-ink-dim">“{t(profile.tagline)}”</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={profile.cvUrl}
            download
            className="rounded-full bg-gradient-to-br from-violet-light to-violet-dark px-7 py-3.5 text-sm font-bold text-void shadow-lg shadow-violet/20 transition active:scale-95"
          >
            {ui.hero.downloadCv} ↓
          </a>
          <a href="#proyectos" className="rounded-full border border-line px-7 py-3.5 text-sm font-bold text-ink transition hover:border-violet hover:text-violet-light active:scale-95">
            {ui.hero.seeProjects} ↗
          </a>
          <div className="flex gap-2">
            {socialLinks
              .filter(link => link.url)
              .map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="grid size-11 place-items-center rounded-full bg-surface text-ink-dim ring-1 ring-line transition hover:text-violet-light hover:ring-violet/60"
                >
                  <SocialIcon label={link.label} />
                </a>
              ))}
          </div>
        </div>

        <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
          {[
            { value: semester ? t(semester).split('·')[0].trim() : '—', label: ui.hero.stats.semester },
            { value: `+${projects.length}`, label: ui.hero.stats.projects },
            { value: `+${stackCount}`, label: ui.hero.stats.stack },
          ].map(stat => (
            <div key={stat.label}>
              <dt className="text-3xl font-extrabold tracking-tight">{stat.value}</dt>
              <dd className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a href="#servicios" className="absolute inset-x-0 bottom-8 mx-auto flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-faint transition hover:text-violet-light">
        <span aria-hidden="true">↓</span> {ui.hero.scroll}
      </a>
    </section>
  );
}
