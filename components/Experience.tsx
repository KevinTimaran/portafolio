'use client';

import { academic, work } from '@/data/experience';
import { useLanguage } from '@/lib/i18n';
import type { ExperienceItem } from '@/types/portfolio';
import SectionHeading from './SectionHeading';

function Timeline({ title, items }: { title: string; items: ExperienceItem[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="mb-7 text-xl font-extrabold uppercase tracking-wide text-ink-dim">{title}</h3>
      <ol className="relative space-y-8 border-l-2 border-line pl-7">
        {items.map((item, index) => (
          <li key={index} className="relative">
            <span aria-hidden="true" className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-violet ring-4 ring-void" />
            <p className="text-xs font-bold uppercase tracking-wide text-violet-light">
              {t(item.start)} – {t(item.end)}
            </p>
            <h4 className="mt-1 text-lg font-extrabold leading-tight">{t(item.title)}</h4>
            <p className="text-sm font-semibold text-ink-faint">{t(item.place)}</p>
            <p className="mt-2 text-ink-dim">{t(item.description)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  const { ui } = useLanguage();
  return (
    <section id="experiencia" className="border-t border-line bg-surface/40 px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading index="04" eyebrow={ui.experience.eyebrow} title={ui.experience.title} description={ui.experience.description} />
        <div className="grid gap-14 md:grid-cols-2 md:gap-10">
          <Timeline title={ui.experience.academic} items={academic} />
          <Timeline title={ui.experience.work} items={work} />
        </div>
      </div>
    </section>
  );
}
