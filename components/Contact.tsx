'use client';

import { useContactForm } from '@/lib/useContactForm';
import { profile, socialLinks } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

const inputClass =
  'w-full rounded-sm border border-gold/30 bg-night/40 px-4 py-3 text-parchment placeholder:text-smoke/60 transition focus:border-gold-light focus:outline-none';

export default function Contact() {
  const { state, handleSubmit } = useContactForm();
  const { ui } = useLanguage();
  const c = ui.contact;

  return (
    <section id="contacto" className="relative overflow-hidden bg-ember px-4 py-24 text-parchment sm:px-8 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#c1662a33,transparent_65%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading
            light
            numeral="V"
            eyebrow={c.eyebrow}
            title={c.title}
            description={c.description}
          />
          <ul className="space-y-4 text-lg">
            <li>
              <span className="block font-caps text-[10px] tracking-[2.5px] text-gold">{c.email}</span>
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="font-display text-2xl hover:text-gold-light">
                  {profile.email}
                </a>
              ) : (
                <span className="text-smoke">{c.pending}</span>
              )}
            </li>
            {profile.phone && (
              <li>
                <span className="block font-caps text-[10px] tracking-[2.5px] text-gold">{c.phone}</span>
                <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-display text-2xl hover:text-gold-light">
                  {profile.phone}
                </a>
              </li>
            )}
            {socialLinks.map(link => (
              <li key={link.label}>
                <span className="block font-caps text-[10px] tracking-[2.5px] text-gold">{link.label}</span>
                {link.url ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-display text-2xl hover:text-gold-light">
                    {link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗
                  </a>
                ) : (
                  <span className="text-smoke">{c.pending}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 border border-gold/20 bg-night/30 p-6 backdrop-blur-sm sm:p-8">
          <div>
            <label htmlFor="nombre" className="mb-2 block font-caps text-[10px] tracking-[2.5px] text-gold">
              {c.name}
            </label>
            <input id="nombre" name="nombre" required autoComplete="name" placeholder={c.namePlaceholder} className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block font-caps text-[10px] tracking-[2.5px] text-gold">
              {c.email}
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder={c.emailPlaceholder} className={inputClass} />
          </div>
          <div>
            <label htmlFor="mensaje" className="mb-2 block font-caps text-[10px] tracking-[2.5px] text-gold">
              {c.message}
            </label>
            <textarea id="mensaje" name="mensaje" required minLength={10} rows={5} placeholder={c.messagePlaceholder} className={`${inputClass} resize-y`} />
          </div>
          <button
            type="submit"
            disabled={state.kind === 'sending'}
            className="w-full rounded-sm bg-gold py-3.5 font-caps text-xs tracking-[2.5px] text-night transition hover:bg-gold-light disabled:opacity-60"
          >
            {state.kind === 'sending' ? c.sending : c.send}
          </button>
          <p role="status" aria-live="polite" className={`min-h-6 text-center ${state.kind === 'error' ? 'text-[#e79a7c]' : 'text-gold-light'}`}>
            {state.message}
          </p>
        </form>
      </div>
    </section>
  );
}
