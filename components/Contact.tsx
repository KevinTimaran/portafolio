'use client';

import { useContactForm } from '@/lib/useContactForm';
import { profile, socialLinks } from '@/data/profile';
import SectionHeading from './SectionHeading';

const inputClass =
  'w-full rounded-sm border border-gold/30 bg-night/40 px-4 py-3 text-parchment placeholder:text-smoke/60 transition focus:border-gold-light focus:outline-none';

export default function Contact() {
  const { state, handleSubmit } = useContactForm();

  return (
    <section id="contacto" className="relative overflow-hidden bg-ember px-4 py-24 text-parchment sm:px-8 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#c1662a33,transparent_65%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHeading
            light
            numeral="V"
            eyebrow="Contacto"
            title={
              <>
                Las buenas ideas comienzan con <em className="!text-gold-light">una conversación.</em>
              </>
            }
            description="Si una de estas páginas despertó una idea, tal vez podamos escribir la siguiente juntos."
          />
          <ul className="space-y-4 text-lg">
            <li>
              <span className="block font-caps text-[10px] tracking-[2.5px] text-gold">Correo</span>
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="font-display text-2xl hover:text-gold-light">
                  {profile.email}
                </a>
              ) : (
                <span className="text-smoke">Por completar en data/profile.ts</span>
              )}
            </li>
            {profile.phone && (
              <li>
                <span className="block font-caps text-[10px] tracking-[2.5px] text-gold">Teléfono / WhatsApp</span>
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
                  <span className="text-smoke">Por completar en data/profile.ts</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 border border-gold/20 bg-night/30 p-6 backdrop-blur-sm sm:p-8">
          <div>
            <label htmlFor="nombre" className="mb-2 block font-caps text-[10px] tracking-[2.5px] text-gold">
              Nombre
            </label>
            <input id="nombre" name="nombre" required autoComplete="name" placeholder="Tu nombre" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block font-caps text-[10px] tracking-[2.5px] text-gold">
              Correo
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="mensaje" className="mb-2 block font-caps text-[10px] tracking-[2.5px] text-gold">
              Mensaje
            </label>
            <textarea id="mensaje" name="mensaje" required minLength={10} rows={5} placeholder="Cuéntame tu idea…" className={`${inputClass} resize-y`} />
          </div>
          <button
            type="submit"
            disabled={state.kind === 'sending'}
            className="w-full rounded-sm bg-gold py-3.5 font-caps text-xs tracking-[2.5px] text-night transition hover:bg-gold-light disabled:opacity-60"
          >
            {state.kind === 'sending' ? 'Enviando…' : 'Enviar mensaje ↗'}
          </button>
          <p role="status" aria-live="polite" className={`min-h-6 text-center ${state.kind === 'error' ? 'text-[#e79a7c]' : 'text-gold-light'}`}>
            {state.message}
          </p>
        </form>
      </div>
    </section>
  );
}
