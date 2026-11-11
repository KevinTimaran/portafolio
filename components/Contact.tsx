'use client';

import { useContactForm } from '@/lib/useContactForm';
import { profile } from '@/data/profile';
import { useLanguage, type Text } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

/** Siempre el texto en español, sin importar el idioma activo: para emparejar etiquetas internamente. */
const es = (text: Text) => (typeof text === 'string' ? text : text.es);

const inputClass =
  'w-full rounded-xl border border-line bg-void px-4 py-3 text-ink outline-none transition placeholder:text-ink-faint focus:border-violet focus:ring-2 focus:ring-violet/30';

export default function Contact() {
  const { state, handleSubmit } = useContactForm();
  const { ui } = useLanguage();
  const c = ui.contact;

  const rows = [
    { label: c.email, value: profile.email || c.pending, href: profile.email ? `mailto:${profile.email}` : undefined, icon: '✉' },
    ...(profile.phone ? [{ label: c.phone, value: profile.phone, href: `https://wa.me/${profile.phone.replace(/\D/g, '')}`, icon: '◐' }] : []),
    { label: c.location, value: es(profile.facts.find(f => /ubicaci/i.test(es(f.label)))?.value ?? 'Pasto, Nariño'), href: undefined, icon: '◎' },
  ];

  return (
    <section id="contacto" className="border-t border-line px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading index="07" eyebrow={c.eyebrow} title={c.title} description={c.description} />
          <ul className="space-y-4">
            {rows.map(row => (
              <li key={row.label} className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-lg ring-1 ring-line">{row.icon}</span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-violet-light">{row.label}</span>
                  {row.href ? (
                    <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="font-semibold hover:text-violet-light">
                      {row.value}
                    </a>
                  ) : (
                    <span className="font-semibold">{row.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface p-6 ring-1 ring-line sm:p-8">
          <div>
            <label htmlFor="nombre" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-faint">
              {c.name}
            </label>
            <input id="nombre" name="nombre" required autoComplete="name" placeholder={c.namePlaceholder} className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-faint">
              {c.email}
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder={c.emailPlaceholder} className={inputClass} />
          </div>
          <div>
            <label htmlFor="mensaje" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-faint">
              {c.message}
            </label>
            <textarea id="mensaje" name="mensaje" required minLength={10} rows={5} placeholder={c.messagePlaceholder} className={`${inputClass} resize-y`} />
          </div>
          <button
            type="submit"
            disabled={state.kind === 'sending'}
            className="w-full rounded-xl bg-gradient-to-br from-violet-light to-violet-dark py-3.5 font-bold text-void transition active:scale-[0.98] disabled:opacity-60"
          >
            {state.kind === 'sending' ? c.sending : c.send}
          </button>
          <p role="status" aria-live="polite" className={`min-h-6 text-center text-sm ${state.kind === 'error' ? 'text-rose' : 'text-mint'}`}>
            {state.message}
          </p>
        </form>
      </div>
    </section>
  );
}
