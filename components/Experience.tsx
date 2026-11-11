'use client';

import { academic, work } from '@/data/experience';
import { useLanguage } from '@/lib/i18n';
import type { ExperienceItem } from '@/types/portfolio';
import SectionHeading from './SectionHeading';

function Timeline({ title, icon, items }: { title: string; icon: string; items: ExperienceItem[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="mb-8 flex items-center gap-3 font-display text-3xl">
        <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-ink text-lg">
          {icon}
        </span>
        {title}
      </h3>
      <ol className="border-l-2 border-gold/60">
        {items.map((item, index) => (
          <li key={index} className="relative mb-10 ml-7 last:mb-0">
            <span aria-hidden="true" className="absolute -left-[35px] top-1.5 size-3 rotate-45 border-2 border-paper bg-oxblood" />
            <p className="font-caps text-[11px] tracking-[2px] text-ink-muted">
              {t(item.start)} — {t(item.end)}
            </p>
            <h4 className="mt-1 font-display text-2xl leading-tight">{t(item.title)}</h4>
            <p className="text-oxblood">{t(item.place)}</p>
            <p className="mt-2 leading-relaxed text-ink/85">{t(item.description)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  const { ui } = useLanguage();
  return (
    <section id="experiencia" className="bg-paper-deep px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading numeral="IV" eyebrow={ui.experience.eyebrow} title={ui.experience.title} description={ui.experience.description} />
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          <Timeline title={ui.experience.academic} icon="🎓" items={academic} />
          <Timeline title={ui.experience.work} icon="💼" items={work} />
        </div>
      </div>
    </section>
  );
}
