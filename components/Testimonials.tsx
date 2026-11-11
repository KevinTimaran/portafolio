'use client';

import Image from 'next/image';
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

export default function Testimonials() {
  const { t, ui } = useLanguage();

  return (
    <section id="testimonios" className="paper-texture px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading numeral="III" eyebrow={ui.testimonials.eyebrow} title={ui.testimonials.title} description={ui.testimonials.description} />
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map(testimonial => (
            <blockquote key={testimonial.name} className="relative flex flex-col border-l-2 border-oxblood/50 bg-[#f4ead4]/70 p-7">
              <span aria-hidden="true" className="absolute -top-5 left-5 font-display text-7xl leading-none text-oxblood/40">
                “
              </span>
              <p className="flex-1 text-lg italic leading-relaxed">{t(testimonial.text)}</p>
              <footer className="mt-6 flex items-center gap-4">
                {testimonial.avatar ? (
                  <Image src={testimonial.avatar} alt={ui.testimonials.photo(testimonial.name)} width={48} height={48} className="size-12 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-caps text-sm text-gold-light">
                    {initials(testimonial.name) || '✧'}
                  </span>
                )}
                <span>
                  <cite className="block font-display text-xl not-italic">{testimonial.name}</cite>
                  <span className="text-sm text-ink-muted">{t(testimonial.role)}</span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
