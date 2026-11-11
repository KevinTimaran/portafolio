'use client';

import { interests, skills } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

/** Sección adicional: el oficio (intereses + herramientas). */
export default function Skills() {
  const { t, ui } = useLanguage();

  return (
    <section id="habilidades" className="paper-texture px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading numeral="VI" eyebrow={ui.skills.eyebrow} title={ui.skills.title} description={ui.skills.description} />

        <div className="grid gap-10 md:grid-cols-3">
          {interests.map(interest => (
            <article key={interest.numeral} className="border-t border-ink/20 pt-6">
              <span className="font-display text-5xl italic text-oxblood/70">{interest.numeral}</span>
              <h3 className="mt-2 font-display text-3xl">{t(interest.title)}</h3>
              <p className="font-caps text-[10px] tracking-[2.5px] text-ink-muted">{t(interest.label)}</p>
              <p className="mt-3 leading-relaxed">{t(interest.description)}</p>
            </article>
          ))}
        </div>

        <ul className="mt-16 grid gap-x-12 gap-y-4 border-t border-ink/15 pt-8 md:grid-cols-2">
          {skills.map((skill, index) => (
            <li key={index} className="flex items-baseline gap-3 text-lg">
              <span aria-hidden="true" className="text-gold">✧</span>
              {t(skill.name)}
            </li>
          ))}
        </ul>

        <blockquote className="mt-20 text-center font-display text-3xl italic leading-snug text-ink/80 sm:text-4xl">
          {ui.skills.quote[0]}
          <br />
          {ui.skills.quote[1]}
        </blockquote>
      </div>
    </section>
  );
}
