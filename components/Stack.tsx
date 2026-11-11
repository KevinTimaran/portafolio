'use client';

import { profile } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import SectionHeading from './SectionHeading';

export default function Stack() {
  const { t, ui } = useLanguage();

  return (
    <section id="stack" className="border-t border-line px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading index="03" eyebrow={ui.stack.eyebrow} title={ui.stack.title} description={ui.stack.description} />
        <div className="space-y-8">
          {profile.stack.map(group => (
            <div key={t(group.group)} className="grid gap-3 border-t border-line pt-6 first:border-t-0 first:pt-0 sm:grid-cols-[180px_1fr]">
              <p className="text-sm font-bold uppercase tracking-wide text-ink-faint">{t(group.group)}</p>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map(item => (
                  <span
                    key={t(item)}
                    className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-violet/50"
                  >
                    <span className="size-1.5 rounded-full bg-violet-light" aria-hidden="true" />
                    {t(item)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
