'use client';

import { interests, profile } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

/** Relaciona cada interés con el grupo de stack que mejor lo ilustra, por posición. */
const GROUP_BY_INDEX = [0, 4, 1]; // Backend, IA y datos, Frontend (según el orden de profile.stack)

export default function WhatIDo() {
  const { t, ui } = useLanguage();

  return (
    <section id="servicios" className="border-t border-line px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading index="01" eyebrow={ui.services.eyebrow} title={ui.services.title} description={ui.services.description} />
        <div className="divide-y divide-line border-y border-line">
          {interests.map((interest, index) => {
            const group = profile.stack[GROUP_BY_INDEX[index] ?? index];
            return (
              <article key={interest.numeral} className="grid gap-4 py-10 md:grid-cols-[auto_1fr] md:gap-12">
                <span className="text-5xl font-extrabold text-ink-faint md:text-6xl">({interest.numeral})</span>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t(interest.title)}</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-violet-light">{t(interest.label)}</p>
                  <p className="mt-4 max-w-xl text-ink-dim">{t(interest.description)}</p>
                  {group && (
                    <ul className="mt-5 space-y-2.5">
                      {group.items.map((item, i) => (
                        <li key={t(item)} className="flex items-center gap-3 border-t border-line py-2.5 text-sm font-semibold first:border-t-0 first:pt-0">
                          <span className="text-violet-light">{String(i + 1).padStart(2, '0')}</span>
                          {t(item)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
