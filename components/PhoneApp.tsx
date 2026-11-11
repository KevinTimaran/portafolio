'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { interests, profile, skills, socialLinks } from '@/data/profile';
import { projects } from '@/data/projects';
import { testimonials } from '@/data/testimonials';
import { academic, work } from '@/data/experience';
import { useContactForm } from '@/lib/useContactForm';
import { useLanguage } from '@/lib/i18n';
import LanguageToggle from './LanguageToggle';

/**
 * El portafolio tal como se abre desde el móvil de la escena: una página a pantalla completa,
 * con estilo de app moderna (oscura, cálida, con tarjetas) que se recorre con scroll.
 *
 * Paleta (cálida oscura):
 *   fondo #141009 · tarjeta #1d1812 · borde #332c22 · chip #272019
 *   oro #e7c988 → #c69a52 · texto #f2ece0 · apagado #a79c88 · tenue #6f6557
 */

const tabs = [
  { id: 'app-inicio', key: 'home', icon: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z' },
  { id: 'app-proyectos', key: 'projects', icon: 'M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v6H4v-6Zm9 0h7v6h-7v-6Z' },
  { id: 'app-experiencia', key: 'path', icon: 'M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z' },
  { id: 'app-contacto', key: 'contact', icon: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 7L4.5 7h15L12 12Z' },
  { id: 'app-habilidades', key: 'more', icon: 'M5 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z' },
] as const;

/** Clases compartidas para que todas las tarjetas se vean iguales. */
const CARD = 'rounded-3xl bg-[#1d1812] ring-1 ring-[#332c22]';
const CHIP = 'rounded-full bg-[#272019] px-3 py-1 text-xs font-medium text-[#cdbfa6] ring-1 ring-[#3a3227]';
const CHIP_GOLD = 'rounded-full bg-[#e7c988]/10 px-3 py-1 text-xs font-medium text-[#ecd9b0] ring-1 ring-[#e7c988]/25';

const socialIcons: Record<string, React.ReactNode> = {
  GitHub: <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
  LinkedIn: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-3.93v-11Z" />,
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(word => /^[A-ZÁÉÍÓÚÑ]/.test(word))
    .slice(0, 2)
    .map(word => word[0])
    .join('') || '✦';

function SectionTitle({ index, kicker, title }: { index: string; kicker: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d4ba84]">
        <span className="text-[#e7c988]/70">{index}</span>
        <span className="h-px w-6 bg-[#e7c988]/30" />
        {kicker}
      </p>
      <h2 className="mt-1.5 text-[24px] font-bold tracking-tight text-[#f3eee4]">{title}</h2>
    </div>
  );
}

function LinkButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const { ui } = useLanguage();
  if (!href) {
    return (
      <span className="flex-1 rounded-xl border border-dashed border-[#4a4234] py-2.5 text-center text-xs text-[#8a8070]">
        {children} · {ui.phone.pending}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-center text-xs font-bold transition active:scale-95 ${
        primary
          ? 'bg-gradient-to-br from-[#e7c988] to-[#c69a52] text-[#1a1409] shadow-lg shadow-[#e7c988]/10'
          : 'bg-[#272019] text-[#e7dcc6] ring-1 ring-[#3f3729] hover:bg-[#2f2820]'
      }`}
    >
      {children}
    </a>
  );
}

export default function PhoneApp({ open, onClose }: { open: boolean; onClose(): void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(tabs[0].id);
  const [track, setTrack] = useState<'academica' | 'laboral'>('academica');
  const { state, handleSubmit } = useContactForm();
  const { t, ui } = useLanguage();
  const ph = ui.phone;

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id)),
      { root, rootMargin: '-30% 0px -65% 0px' },
    );
    tabs.forEach(tab => {
      const el = root.querySelector(`#${tab.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [open]);

  const goTo = (id: string) => {
    const root = scrollRef.current;
    const el = root?.querySelector<HTMLElement>(`#${id}`);
    if (!root || !el) return;
    // Altura de la barra superior de la app.
    const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 72;
    root.scrollTo({ top: id === 'app-inicio' ? 0 : top, behavior: 'smooth' });
  };

  const timeline = track === 'academica' ? academic : work;
  const links = [
    ...(profile.email ? [{ label: 'Correo', value: profile.email, url: `mailto:${profile.email}` }] : [{ label: 'Correo', value: ph.pendingValue, url: '' }]),
    ...socialLinks.map(link => ({ label: link.label, value: link.url ? link.url.replace(/^https?:\/\/(www\.)?/, '') : ph.pendingValue, url: link.url })),
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ph.dialog}
      inert={!open}
      className={`fixed inset-0 z-40 bg-[#141009] font-sans text-[#f2ece0] antialiased transition-opacity duration-500 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Contenido con scroll */}
      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain scroll-smooth pb-28 md:pb-12">
        {/* Barra superior de la app */}
        <div className="sticky top-0 z-10 border-b border-[#2a241b] bg-[#141009]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 md:px-8">
            <button type="button" onClick={() => goTo('app-inicio')} className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#e7c988] to-[#c69a52] text-xs font-black text-[#1a1409]">
                {profile.initials}
              </span>
              <span className="text-[15px] font-semibold tracking-tight">{profile.name.split(' ')[0]}</span>
            </button>
            <nav aria-label={ph.sections} className="hidden items-center gap-1 md:flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => goTo(tab.id)}
                  aria-current={active === tab.id ? 'true' : undefined}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active === tab.id ? 'bg-[#e7c988]/12 text-[#e7c988]' : 'text-[#a79c88] hover:text-[#f2ece0]'
                  }`}
                >
                  {tab.key === 'more' ? ph.tabs.skills : ph.tabs[tab.key]}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <LanguageToggle className="text-[#a79c88] [&_[aria-pressed=true]]:text-[#e7c988]" />
              <button
                type="button"
                onClick={onClose}
                aria-label={ph.exitLabel}
                className="flex items-center gap-1 rounded-full bg-[#272019] px-3 py-1.5 text-xs font-medium text-[#cdbfa6] ring-1 ring-[#3a3227] transition hover:bg-[#2f2820]"
              >
                {ph.exit}
                <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current stroke-2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-14 px-5 md:space-y-20 md:px-8">
          {/* Inicio + CV */}
          <section id="app-inicio" className="pt-5 md:pt-9">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a2217] via-[#1c1710] to-[#15110a] p-6 ring-1 ring-[#3a3225] md:p-11">
              {/* resplandores y marca de agua */}
              <div aria-hidden="true" className="absolute -right-16 -top-16 size-60 rounded-full bg-[#e7c988]/15 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -left-10 size-52 rounded-full bg-[#c69a52]/8 blur-3xl" />
              <span aria-hidden="true" className="pointer-events-none absolute -right-3 -bottom-10 select-none text-[160px] font-black leading-none tracking-tighter text-white/[0.025] md:text-[240px]">
                {profile.initials}
              </span>

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e7c988]/10 px-3 py-1 text-[11px] font-semibold text-[#ecd9b0] ring-1 ring-[#e7c988]/25">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#7fb888]" />
                  {t(profile.facts[0]?.value ?? '')}
                </span>
                <p className="mt-5 text-sm font-medium text-[#a79c88]">{ph.hello}</p>
                <h1 className="mt-1 text-[32px] font-extrabold leading-[1.05] tracking-tight md:text-6xl">{profile.fullName}</h1>
                <p className="mt-2 text-[15px] font-semibold text-[#e7c988] md:text-lg">{t(profile.role)}</p>
                <p className="mt-4 max-w-xl text-[17px] font-medium leading-relaxed text-[#d9d1c0] md:text-xl">“{t(profile.tagline)}”</p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {profile.focus.map(item => (
                    <span key={t(item)} className={CHIP}>
                      {t(item)}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <a
                    href={profile.cvUrl}
                    download
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#e7c988] to-[#c69a52] px-6 py-3 text-sm font-bold text-[#1a1409] shadow-lg shadow-[#e7c988]/15 transition active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[2.2]" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
                    {ph.downloadCv}
                  </a>
                  <button
                    type="button"
                    onClick={() => goTo('app-proyectos')}
                    className="rounded-2xl bg-[#272019] px-6 py-3 text-sm font-semibold text-[#e7dcc6] ring-1 ring-[#3f3729] transition hover:bg-[#2f2820] active:scale-95"
                  >
                    {ph.seeProjects}
                  </button>
                  <div className="flex gap-2">
                    {socialLinks.filter(link => link.url && socialIcons[link.label]).map(link => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="grid size-11 place-items-center rounded-2xl bg-[#272019] text-[#d4c7ad] ring-1 ring-[#3f3729] transition hover:bg-[#2f2820] hover:text-[#e7c988] active:scale-95"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">{socialIcons[link.label]}</svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Datos rápidos */}
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {profile.facts.map(fact => (
                <div key={t(fact.label)} className={`${CARD} p-3.5`}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8070]">{t(fact.label)}</p>
                  <p className="mt-1 text-[13px] font-semibold leading-snug text-[#eadfcb]">{t(fact.value)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sobre mí */}
          <section id="app-sobre-mi">
            <SectionTitle index="01" kicker={ph.profileKicker} title={ph.about} />
            <div className={`space-y-3 ${CARD} p-6 text-[15px] leading-relaxed text-[#cfc6b4]`}>
              {profile.about.map((paragraph, i) => (
                <p key={i}>{t(paragraph)}</p>
              ))}
            </div>
            <div className={`mt-3 space-y-4 ${CARD} p-6`}>
              <p className="text-sm font-bold text-[#f3eee4]">{ph.stack}</p>
              {profile.stack.map(group => (
                <div key={t(group.group)}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8a8070]">{t(group.group)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.map(item => (
                      <span key={t(item)} className={CHIP_GOLD}>
                        {t(item)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={`mt-3 ${CARD} p-6`}>
              <p className="text-sm font-bold text-[#f3eee4]">{ph.beyondCode}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#cfc6b4]">{t(profile.beyondCode)}</p>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-[#8a8070]">{ph.books}</p>
              <ul className="mt-2.5 space-y-2">
                {profile.books.map(book => (
                  <li key={book.author} className="flex items-center gap-2.5 text-[14px]">
                    <span aria-hidden="true" className="text-[#e7c988]">📖</span>
                    <span className="font-semibold text-[#eadfcb]">{t(book.title)}</span>
                    <span className="text-[#8a8070]">· {book.author}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Proyectos */}
          <section id="app-proyectos">
            <SectionTitle index="02" kicker={ph.workKicker} title={ph.projects} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <article
                  key={project.github || index}
                  className={`group flex flex-col overflow-hidden ${CARD} transition hover:ring-[#4a4030]`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#2c2419] to-[#1a1610]">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={ui.projects.screenshot(t(project.title))}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid size-full place-items-center text-5xl font-black text-[#e7c988]/15">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-[#f2ece0] backdrop-blur">
                      {project.year}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#d4ba84]">{t(project.category)}</p>
                    <h3 className="mt-1 text-[18px] font-bold text-[#f3eee4]">{t(project.title)}</h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#b7ad9a]">{t(project.description)}</p>
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {project.tags.map(tag => (
                        <span key={tag} className="rounded-md bg-[#272019] px-2 py-0.5 text-[10px] font-medium text-[#b7ad9a] ring-1 ring-[#3a3227]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <LinkButton href={project.demo} primary>
                        {project.demoLabel ? t(project.demoLabel) : ph.demo} ↗
                      </LinkButton>
                      <LinkButton href={project.github}>GitHub</LinkButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Testimonios */}
          <section id="app-testimonios">
            <SectionTitle index="03" kicker={ph.reviewsKicker} title={ph.testimonials} />
            <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
              {testimonials.map(item => (
                <figure key={item.name} className={`relative flex flex-col ${CARD} p-6`}>
                  <span aria-hidden="true" className="absolute right-5 top-3 font-serif text-5xl leading-none text-[#e7c988]/20">”</span>
                  <blockquote className="flex-1 text-[14px] leading-relaxed text-[#cfc6b4]">“{t(item.text)}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-[#2a241b] pt-4">
                    {item.avatar ? (
                      <Image src={item.avatar} alt={ph.photo(item.name)} width={44} height={44} className="size-11 rounded-full object-cover" />
                    ) : (
                      <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#e7c988] to-[#c69a52] text-sm font-bold text-[#1a1409]">
                        {initials(item.name)}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-[#f3eee4]">{item.name}</span>
                      <span className="block text-xs leading-snug text-[#8a8070]">{t(item.role)}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Experiencia */}
          <section id="app-experiencia">
            <SectionTitle index="04" kicker={ph.pathKicker} title={ph.experience} />
            <div role="tablist" aria-label={ph.experienceType} className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-[#1d1812] p-1 ring-1 ring-[#332c22]">
              {([['academica', ph.academic], ['laboral', ph.work]] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={track === key}
                  onClick={() => setTrack(key)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    track === key ? 'bg-gradient-to-br from-[#e7c988] to-[#c69a52] text-[#1a1409] shadow' : 'text-[#a79c88] hover:text-[#f2ece0]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <ol className="relative space-y-3 before:absolute before:bottom-5 before:left-[19px] before:top-5 before:w-px before:bg-[#3a3227]">
              {timeline.map((item, index) => (
                <li key={index} className="relative flex gap-4">
                  <span aria-hidden="true" className="relative z-10 mt-4 grid size-10 shrink-0 place-items-center rounded-full bg-[#1d1812] ring-1 ring-[#4a4030]">
                    <span className="size-2.5 rounded-full bg-gradient-to-br from-[#e7c988] to-[#c69a52]" />
                  </span>
                  <div className={`flex-1 ${CARD} p-4`}>
                    <p className="text-[11px] font-semibold text-[#d4ba84]">
                      {t(item.start)} – {t(item.end)}
                    </p>
                    <h3 className="mt-1 text-[15px] font-bold leading-snug text-[#f3eee4]">{t(item.title)}</h3>
                    <p className="text-xs text-[#8a8070]">{t(item.place)}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#b7ad9a]">{t(item.description)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Habilidades (sección extra) */}
          <section id="app-habilidades">
            <SectionTitle index="05" kicker={ph.extraKicker} title={ph.skills} />
            <div className="grid gap-3 sm:grid-cols-3">
              {interests.map(interest => (
                <div key={interest.numeral} className={`${CARD} p-5`}>
                  <span className="font-serif text-3xl italic text-[#e7c988]/70">{interest.numeral}</span>
                  <p className="mt-1 text-[15px] font-bold text-[#f3eee4]">{t(interest.title)}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#8a8070]">{t(interest.label)}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#b7ad9a]">{t(interest.description)}</p>
                </div>
              ))}
            </div>
            <ul className={`mt-3 grid gap-x-6 gap-y-3 ${CARD} p-6 sm:grid-cols-2`}>
              {skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-3 text-[14px] font-medium text-[#eadfcb]">
                  <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-[#e7c988]/12 text-[10px] text-[#e7c988]">✓</span>
                  {t(skill.name)}
                </li>
              ))}
            </ul>
          </section>

          {/* Contacto */}
          <section id="app-contacto">
            <SectionTitle index="06" kicker={ph.contactKicker} title={ph.contact} />
            <ul className={`divide-y divide-[#2a241b] overflow-hidden ${CARD}`}>
              {links.map(link => {
                const content = (
                  <>
                    <span className="grid size-10 place-items-center rounded-xl bg-[#272019] text-sm ring-1 ring-[#3a3227]" aria-hidden="true">
                      {link.label === 'Correo' ? '✉️' : link.label === 'GitHub' ? '🐙' : link.label === 'LinkedIn' ? '💼' : '🔗'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#f3eee4]">{link.label === 'Correo' ? ph.email : link.label}</span>
                      <span className="block truncate text-xs text-[#8a8070]">{link.value}</span>
                    </span>
                    {link.url && <span aria-hidden="true" className="text-[#6f6557]">›</span>}
                  </>
                );
                return (
                  <li key={link.label}>
                    {link.url ? (
                      <a href={link.url} target={link.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-[#241e17]">
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3.5 opacity-60">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <form onSubmit={handleSubmit} className={`mt-4 space-y-2.5 ${CARD} p-5`}>
              <p className="px-1 text-sm font-bold text-[#f3eee4]">{ph.sendMessage}</p>
              <input name="nombre" required autoComplete="name" placeholder={ph.name} aria-label={ph.name} className="w-full rounded-xl bg-[#141009] px-4 py-3 text-sm text-[#f2ece0] outline-none ring-1 ring-[#3a3227] transition placeholder:text-[#6f6557] focus:ring-2 focus:ring-[#e7c988]/60" />
              <input name="email" type="email" required autoComplete="email" placeholder={ph.email} aria-label={ph.email} className="w-full rounded-xl bg-[#141009] px-4 py-3 text-sm text-[#f2ece0] outline-none ring-1 ring-[#3a3227] transition placeholder:text-[#6f6557] focus:ring-2 focus:ring-[#e7c988]/60" />
              <textarea name="mensaje" required minLength={10} rows={4} placeholder={ph.message} aria-label={ph.message} className="w-full resize-none rounded-xl bg-[#141009] px-4 py-3 text-sm text-[#f2ece0] outline-none ring-1 ring-[#3a3227] transition placeholder:text-[#6f6557] focus:ring-2 focus:ring-[#e7c988]/60" />
              <button type="submit" disabled={state.kind === 'sending'} className="w-full rounded-xl bg-gradient-to-br from-[#e7c988] to-[#c69a52] py-3 text-sm font-bold text-[#1a1409] shadow-lg shadow-[#e7c988]/10 transition active:scale-[0.98] disabled:opacity-60">
                {state.kind === 'sending' ? ph.sending : ph.send}
              </button>
              {state.message && (
                <p role="status" className={`px-1 text-center text-xs ${state.kind === 'error' ? 'text-[#e2aca3]' : 'text-[#a9c4ad]'}`}>
                  {state.message}
                </p>
              )}
            </form>
          </section>

          {/* Pie */}
          <footer className="space-y-3 border-t border-[#2a241b] pb-4 pt-8 text-center text-xs text-[#6f6557]">
            <button type="button" onClick={() => goTo('app-inicio')} className="rounded-full bg-[#272019] px-5 py-2.5 font-medium text-[#cdbfa6] ring-1 ring-[#3a3227] transition hover:bg-[#2f2820]">
              {ph.backToTop}
            </button>
            <p className="pt-1">© {new Date().getFullYear()} {profile.fullName}</p>
            <p>{ph.madeWith}</p>
          </footer>
        </div>
      </div>

      {/* Barra de pestañas (celular) */}
      <nav aria-label={ph.sections} className="absolute inset-x-0 bottom-0 z-20 border-t border-[#2a241b] bg-[#141009]/92 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
        <ul className="flex justify-around">
          {tabs.map(tab => {
            const selected = active === tab.id || (tab.id === 'app-inicio' && active === 'app-sobre-mi') || (tab.id === 'app-proyectos' && active === 'app-testimonios') || (tab.id === 'app-habilidades' && active === 'app-contacto');
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => goTo(tab.id)}
                  aria-current={selected ? 'true' : undefined}
                  className={`flex w-16 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition ${
                    selected ? 'text-[#e7c988]' : 'text-[#7d7362]'
                  }`}
                >
                  <span className={`grid h-7 w-12 place-items-center rounded-full transition ${selected ? 'bg-[#e7c988]/12' : ''}`}>
                    <svg viewBox="0 0 24 24" className="size-[21px] fill-current" aria-hidden="true">
                      <path d={tab.icon} />
                    </svg>
                  </span>
                  {ph.tabs[tab.key]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
