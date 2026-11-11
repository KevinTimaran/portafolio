'use client';

import { testimonials } from '@/data/testimonials';
import { useLanguage } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(word => /^[A-ZÁÉÍÓÚÑ]/.test(word))
    .slice(0, 2)
    .map(word => word[0])
    .join('');

function Stars() {
  return (
    <div className="flex gap-0.5 text-violet-light" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t, ui } = useLanguage();

  return (
    <section id="testimonios" className="border-t border-line bg-surface/40 px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading index="06" eyebrow={ui.testimonials.eyebrow} title={ui.testimonials.title} description={ui.testimonials.description} />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(item => (
            <figure key={item.name} className="relative overflow-hidden rounded-2xl bg-surface p-6 ring-1 ring-line">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet to-violet-light" />
              <Stars />
              <blockquote className="mt-4 text-[15px] leading-relaxed text-ink-dim">“{t(item.text)}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-light to-violet-dark text-xs font-bold text-void">
                  {initials(item.name) || '✦'}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{item.name}</span>
                  <span className="block truncate text-xs text-ink-faint">{t(item.role)}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
