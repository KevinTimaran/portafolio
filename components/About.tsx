'use client';

import { profile } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

export default function About() {
  const { t, ui } = useLanguage();

  return (
    <section id="sobre-mi" className="border-t border-line bg-surface/40 px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionHeading index="02" eyebrow={ui.about.eyebrow} title={ui.about.title} />
          <div className="space-y-5 text-lg leading-relaxed text-ink-dim">
            {profile.about.map((paragraph, index) => (
              <p key={index}>{t(paragraph)}</p>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-surface p-6 ring-1 ring-line">
            <p className="font-bold text-ink">{ui.about.beyondCode}</p>
            <p className="mt-2 text-ink-dim">{t(profile.beyondCode)}</p>
          </div>
        </div>

        <aside className="space-y-6">
          <dl className="grid grid-cols-2 gap-4">
            {profile.facts.map(fact => (
              <div key={t(fact.label)} className="rounded-2xl bg-surface p-4 ring-1 ring-line">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{t(fact.label)}</dt>
                <dd className="mt-1 font-bold text-ink">{t(fact.value)}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{ui.about.books}</p>
            <ul className="mt-3 space-y-2.5">
              {profile.books.map(book => (
                <li key={book.author} className="text-sm">
                  <span className="font-bold text-ink">{t(book.title)}</span>
                  <span className="text-ink-faint"> · {book.author}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
