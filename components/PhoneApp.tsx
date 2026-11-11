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
 * El portafolio tal como se abre desde el móvil de la escena: una página a pantalla completa
 * con estilo de app moderna (oscura, sans-serif, tarjetas) que se recorre con scroll.
 */

const tabs = [
  { id: 'app-inicio', key: 'home', icon: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z' },
  { id: 'app-proyectos', key: 'projects', icon: 'M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v6H4v-6Zm9 0h7v6h-7v-6Z' },
  { id: 'app-experiencia', key: 'path', icon: 'M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z' },
  { id: 'app-contacto', key: 'contact', icon: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 7L4.5 7h15L12 12Z' },
  { id: 'app-habilidades', key: 'more', icon: 'M5 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z' },
] as const;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(word => /^[A-ZÁÉÍÓÚÑ]/.test(word))
    .slice(0, 2)
    .map(word => word[0])
    .join('') || '✦';

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c9b690]">{kicker}</p>
        <h2 className="mt-0.5 text-[22px] font-bold tracking-tight">{title}</h2>
      </div>
    </div>
  );
}

function LinkButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const { ui } = useLanguage();
  if (!href) {
    return <span className="flex-1 rounded-xl border border-dashed border-white/15 py-2 text-center text-xs text-white/40">{children} · {ui.phone.pending}</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-1 rounded-xl py-2 text-center text-xs font-semibold transition active:scale-95 ${
        primary ? 'bg-[#cdb995] text-[#1d1e23]' : 'bg-white/10 text-white hover:bg-white/15'
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
      className={`fixed inset-0 z-40 bg-[#1d1e23] font-sans text-[#ece8e1] antialiased transition-opacity duration-500 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
          {/* Contenido con scroll */}
          <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain scroll-smooth pb-28 md:pb-12">
            {/* Barra superior de la app */}
            <div className="sticky top-0 z-10 border-b border-white/5 bg-[#1d1e23]/85 backdrop-blur-xl">
             <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 md:px-8">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#ddd0b6] to-[#a99679] text-xs font-bold text-[#1d1e23]">
                  {profile.initials}
                </span>
                <span className="text-[15px] font-semibold">{profile.name.split(' ')[0]}</span>
              </div>
              <nav aria-label={ph.sections} className="hidden items-center gap-1 md:flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => goTo(tab.id)}
                    aria-current={active === tab.id ? 'true' : undefined}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${active === tab.id ? 'bg-white/10 text-[#d6c3a1]' : 'text-white/60 hover:text-white'}`}
                  >
                    {tab.key === 'more' ? ph.tabs.skills : ph.tabs[tab.key]}
                  </button>
                ))}
              </nav>
              <div className="flex items-center gap-2">
              <LanguageToggle className="text-white/70 [&_[aria-pressed=true]]:text-[#d6c3a1]" />
              <button
                type="button"
                onClick={onClose}
                aria-label={ph.exitLabel}
                className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/15"
              >
                {ph.exit}
                <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current stroke-2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
              </div>
             </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-10 px-5 md:space-y-16 md:px-8">
              {/* Inicio + CV */}
              <section id="app-inicio" className="pt-4 md:pt-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b2824] via-[#222124] to-[#1d1e23] p-6 ring-1 md:p-10 ring-white/10">
                  <div aria-hidden="true" className="absolute -right-10 -top-10 size-44 rounded-full bg-[#d6c3a1]/10 blur-3xl" />
                  {profile.portrait ? (
                    <Image
                      src={profile.portrait}
                      alt={ph.photo(profile.fullName)}
                      width={160}
                      height={160}
                      className="relative size-20 rounded-2xl object-cover ring-2 ring-[#d6c3a1]/45 md:size-28"
                    />
                  ) : (
                    <div className="relative grid size-20 place-items-center rounded-2xl border border-dashed border-[#d6c3a1]/40 bg-white/5 text-center md:size-28">
                      <span className="text-[10px] font-medium leading-tight text-white/50">{ph.photoSoon}</span>
                    </div>
                  )}
                  <p className="relative mt-5 text-sm text-white/60">{ph.hello}</p>
                  <h1 className="relative text-[28px] font-extrabold leading-tight tracking-tight md:text-5xl">{profile.fullName}</h1>
                  <p className="relative mt-1 text-sm font-medium text-[#d6c3a1]">{t(profile.role)}</p>
                  <p className="relative mt-3 max-w-xl text-[17px] font-semibold leading-relaxed text-white/85 md:text-xl">“{t(profile.tagline)}”</p>
                  <div className="relative mt-3 flex flex-wrap gap-1.5">
                    {profile.focus.map(item => (
                      <span key={t(item)} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80">
                        {t(item)}
                      </span>
                    ))}
                  </div>
                  <div className="relative mt-5 flex gap-2.5 md:max-w-md">
                    <a href={profile.cvUrl} download className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#ece6dc] py-3 text-sm font-bold text-[#1d1e23] transition active:scale-95">
                      <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[2.2]" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
                      {ph.downloadCv}
                    </a>
                    <button type="button" onClick={() => goTo('app-proyectos')} className="flex-1 rounded-2xl bg-white/10 py-3 text-sm font-semibold transition active:scale-95">
                      {ph.seeProjects}
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {profile.facts.map(fact => (
                    <div key={t(fact.label)} className="rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">{t(fact.label)}</p>
                      <p className="mt-1 text-[12px] font-medium leading-snug">{t(fact.value)}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sobre mí */}
              <section id="app-sobre-mi">
                <SectionTitle kicker={ph.profileKicker} title={ph.about} />
                <div className="space-y-3 rounded-3xl bg-white/[0.06] p-5 text-[15px] leading-relaxed text-white/80 ring-1 ring-white/5">
                  {profile.about.map((paragraph, i) => (
                    <p key={i}>{t(paragraph)}</p>
                  ))}
                </div>
                <div className="mt-3 space-y-3 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/5">
                  <p className="text-sm font-semibold">{ph.stack}</p>
                  {profile.stack.map(group => (
                    <div key={t(group.group)}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">{t(group.group)}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {group.items.map(item => (
                          <span key={t(item)} className="rounded-full bg-[#d6c3a1]/10 px-3 py-1 text-xs font-medium text-[#e4d8c2]">
                            {t(item)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/5">
                  <p className="text-sm font-semibold">{ph.beyondCode}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/75">{t(profile.beyondCode)}</p>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-white/45">{ph.books}</p>
                  <ul className="mt-2 space-y-1.5">
                    {profile.books.map(book => (
                      <li key={book.author} className="flex items-center gap-2 text-[13px]">
                        <span aria-hidden="true">📖</span>
                        <span className="font-medium">{t(book.title)}</span>
                        <span className="text-white/45">· {book.author}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Proyectos */}
              <section id="app-proyectos">
                <SectionTitle kicker={ph.workKicker} title={ph.projects} />
                <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <article key={project.github || index} className="w-[270px] shrink-0 snap-start overflow-hidden rounded-3xl md:w-auto bg-white/[0.06] ring-1 ring-white/5">
                      <div className="relative aspect-[16/10] bg-gradient-to-br from-[#38342f] to-[#26262b]">
                        {project.image ? (
                          <Image src={project.image} alt={ui.projects.screenshot(t(project.title))} fill sizes="(min-width: 768px) 33vw, 270px" className="object-cover" />
                        ) : (
                          <span className="grid size-full place-items-center text-4xl font-black text-white/15">{String(index + 1).padStart(2, '0')}</span>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">{project.year}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] font-medium text-white/45">{t(project.category)}</p>
                        <h3 className="mt-0.5 text-[17px] font-bold">{t(project.title)}</h3>
                        <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-white/65">{t(project.description)}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.tags.map(tag => (
                            <span key={tag} className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[10px] text-white/70">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <LinkButton href={project.demo} primary>{project.demoLabel ? t(project.demoLabel) : ph.demo}</LinkButton>
                          <LinkButton href={project.github}>GitHub</LinkButton>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Testimonios */}
              <section id="app-testimonios">
                <SectionTitle kicker={ph.reviewsKicker} title={ph.testimonials} />
                <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                  {testimonials.map(item => (
                    <figure key={item.name} className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/5">
                      <div className="flex items-center gap-3">
                        {item.avatar ? (
                          <Image src={item.avatar} alt={ph.photo(item.name)} width={44} height={44} className="size-11 rounded-full object-cover" />
                        ) : (
                          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#a3b0a3] to-[#748378] text-sm font-bold text-[#1d1e23]">
                            {initials(item.name)}
                          </span>
                        )}
                        <figcaption>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-white/50">{t(item.role)}</p>
                        </figcaption>
                      </div>
                      <blockquote className="mt-3 text-[14px] leading-relaxed text-white/75">“{t(item.text)}”</blockquote>
                    </figure>
                  ))}
                </div>
              </section>

              {/* Experiencia */}
              <section id="app-experiencia">
                <SectionTitle kicker={ph.pathKicker} title={ph.experience} />
                <div role="tablist" aria-label={ph.experienceType} className="mb-4 grid grid-cols-2 rounded-2xl bg-white/[0.06] p-1">
                  {([['academica', ph.academic], ['laboral', ph.work]] as const).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={track === key}
                      onClick={() => setTrack(key)}
                      className={`rounded-xl py-2 text-sm font-semibold transition ${track === key ? 'bg-[#ece6dc] text-[#1d1e23] shadow' : 'text-white/60'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <ol className="relative space-y-3 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-white/10">
                  {timeline.map((item, index) => (
                    <li key={index} className="relative flex gap-4">
                      <span aria-hidden="true" className="relative z-10 mt-4 grid size-10 shrink-0 place-items-center rounded-full bg-[#1d1e23] ring-1 ring-white/15">
                        <span className="size-2.5 rounded-full bg-[#cdb995]" />
                      </span>
                      <div className="flex-1 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/5">
                        <p className="text-[11px] font-semibold text-[#c9b690]">
                          {t(item.start)} – {t(item.end)}
                        </p>
                        <h3 className="mt-0.5 text-[15px] font-bold leading-snug">{t(item.title)}</h3>
                        <p className="text-xs text-white/50">{t(item.place)}</p>
                        <p className="mt-2 text-[13px] leading-relaxed text-white/70">{t(item.description)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Contacto */}
              <section id="app-contacto">
                <SectionTitle kicker={ph.contactKicker} title={ph.contact} />
                <ul className="divide-y divide-white/5 overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/5">
                  {links.map(link => {
                    const content = (
                      <>
                        <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-sm" aria-hidden="true">
                          {link.label === 'Correo' ? '✉️' : link.label === 'GitHub' ? '🐙' : link.label === 'LinkedIn' ? '💼' : '🔗'}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{link.label === 'Correo' ? ph.email : link.label}</span>
                          <span className="block truncate text-xs text-white/50">{link.value}</span>
                        </span>
                        {link.url && <span aria-hidden="true" className="text-white/30">›</span>}
                      </>
                    );
                    return (
                      <li key={link.label}>
                        {link.url ? (
                          <a href={link.url} target={link.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5">
                            {content}
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 opacity-60">{content}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <form onSubmit={handleSubmit} className="mt-4 space-y-2.5 rounded-3xl bg-white/[0.06] p-4 ring-1 ring-white/5">
                  <p className="px-1 text-sm font-semibold">{ph.sendMessage}</p>
                  <input name="nombre" required autoComplete="name" placeholder={ph.name} aria-label={ph.name} className="w-full rounded-xl bg-white/[0.07] px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-[#d6c3a1]/50" />
                  <input name="email" type="email" required autoComplete="email" placeholder={ph.email} aria-label={ph.email} className="w-full rounded-xl bg-white/[0.07] px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-[#d6c3a1]/50" />
                  <textarea name="mensaje" required minLength={10} rows={4} placeholder={ph.message} aria-label={ph.message} className="w-full resize-none rounded-xl bg-white/[0.07] px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-[#d6c3a1]/50" />
                  <button type="submit" disabled={state.kind === 'sending'} className="w-full rounded-xl bg-[#cdb995] py-3 text-sm font-bold text-[#1d1e23] hover:bg-[#d8c7a6] transition active:scale-[0.98] disabled:opacity-60">
                    {state.kind === 'sending' ? ph.sending : ph.send}
                  </button>
                  {state.message && (
                    <p role="status" className={`px-1 text-center text-xs ${state.kind === 'error' ? 'text-[#e2aca3]' : 'text-[#a9c4ad]'}`}>
                      {state.message}
                    </p>
                  )}
                </form>
              </section>

              {/* Sección adicional: habilidades */}
              <section id="app-habilidades">
                <SectionTitle kicker={ph.extraKicker} title={ph.skills} />
                <ul className="space-y-2.5 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/5">
                  {skills.map((skill, index) => (
                    <li key={index} className="flex items-center gap-3 text-[13px] font-medium">
                      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#cdb995]" />
                      {t(skill.name)}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {interests.map(interest => (
                    <div key={interest.numeral} className="rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/5">
                      <p className="text-[13px] font-bold">{t(interest.title)}</p>
                      <p className="mt-0.5 text-[10px] leading-snug text-white/50">{t(interest.label)}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pie */}
              <footer className="space-y-3 pb-4 pt-2 text-center text-xs text-white/40">
                <button type="button" onClick={() => goTo('app-inicio')} className="rounded-full bg-white/[0.07] px-4 py-2 font-medium text-white/70">
                  {ph.backToTop}
                </button>
                <p>
                  © {new Date().getFullYear()} {profile.fullName}
                </p>
                <p>{ph.madeWith}</p>
              </footer>
            </div>
          </div>

          {/* Barra de pestañas */}
          <nav aria-label={ph.sections} className="absolute inset-x-0 bottom-0 z-20 border-t border-white/5 bg-[#1d1e23]/90 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
            <ul className="flex justify-around">
              {tabs.map(tab => {
                const selected = active === tab.id || (tab.id === 'app-inicio' && ['app-sobre-mi'].includes(active)) || (tab.id === 'app-proyectos' && active === 'app-testimonios');
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => goTo(tab.id)}
                      aria-current={selected ? 'true' : undefined}
                      className={`flex w-16 flex-col items-center gap-1 py-1 text-[10px] font-medium transition ${selected ? 'text-[#d6c3a1]' : 'text-white/45'}`}
                    >
                      <svg viewBox="0 0 24 24" className="size-[22px] fill-current" aria-hidden="true">
                        <path d={tab.icon} />
                      </svg>
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
