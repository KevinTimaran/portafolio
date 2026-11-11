'use client';

import { profile } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

export default function About() {
  const { t, ui } = useLanguage();

  return (
    <section id="sobre-mi" className="paper-texture px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div>
          <SectionHeading numeral="I" eyebrow={ui.about.eyebrow} title={ui.about.title} />
          <div className="space-y-5 text-lg leading-relaxed sm:text-xl">
            {profile.about.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-oxblood' : ''}
              >
                {t(paragraph)}
              </p>
            ))}
          </div>

          <dl className="mt-10 grid gap-6 border-y border-ink/15 py-6 sm:grid-cols-3">
            {profile.facts.map(fact => (
              <div key={t(fact.label)}>
                <dt className="font-caps text-[10px] tracking-[2.5px] text-ink-muted">{t(fact.label)}</dt>
                <dd className="mt-1 font-display text-xl">{t(fact.value)}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-10 font-caps text-[11px] tracking-[3px] text-oxblood">{ui.about.stack}</h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {profile.stack.map(group => (
              <div key={t(group.group)}>
                <p className="font-display text-lg italic">{t(group.group)}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <li key={t(item)} className="rounded-full border border-ink/20 bg-paper-deep/60 px-3 py-1 text-sm">
                      {t(item)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-10 font-caps text-[11px] tracking-[3px] text-oxblood">{ui.about.beyondCode}</h3>
          <p className="mt-3 text-lg leading-relaxed">{t(profile.beyondCode)}</p>
          <p className="mt-4 font-caps text-[10px] tracking-[2.5px] text-ink-muted">{ui.about.books}</p>
          <ul className="mt-2 space-y-1">
            {profile.books.map(book => (
              <li key={book.author} className="text-lg">
                <em className="font-display">{t(book.title)}</em> <span className="text-ink-muted">· {book.author}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="mx-auto flex w-full max-w-xs flex-col items-center border-y border-ink/15 py-10 text-center md:mt-28">
          <span className="font-display text-5xl italic text-oxblood/70">I</span>
          <p className="mt-2 font-display text-2xl italic leading-snug">
            {ui.about.aside.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          <span aria-hidden="true" className="mt-4 text-gold">
            ✧
          </span>
        </aside>
      </div>
    </section>
  );
}
