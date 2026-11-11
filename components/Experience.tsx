import { academic, work } from '@/data/experience';
import type { ExperienceItem } from '@/types/portfolio';
import SectionHeading from './SectionHeading';

function Timeline({ title, icon, items }: { title: string; icon: string; items: ExperienceItem[] }) {
  return (
    <div>
      <h3 className="mb-8 flex items-center gap-3 font-display text-3xl">
        <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-ink text-lg">
          {icon}
        </span>
        {title}
      </h3>
      <ol className="border-l-2 border-gold/60">
        {items.map(item => (
          <li key={`${item.title}-${item.start}`} className="relative mb-10 ml-7 last:mb-0">
            <span aria-hidden="true" className="absolute -left-[35px] top-1.5 size-3 rotate-45 border-2 border-paper bg-oxblood" />
            <p className="font-caps text-[11px] tracking-[2px] text-ink-muted">
              {item.start} — {item.end}
            </p>
            <h4 className="mt-1 font-display text-2xl leading-tight">{item.title}</h4>
            <p className="text-oxblood">{item.place}</p>
            <p className="mt-2 leading-relaxed text-ink/85">{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experiencia" className="bg-paper-deep px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading numeral="IV" eyebrow="Experiencia" title={<>El camino <em>recorrido.</em></>} description="Formación académica y experiencia laboral, de lo más reciente a lo más antiguo." />
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          <Timeline title="Académica" icon="🎓" items={academic} />
          <Timeline title="Laboral" icon="💼" items={work} />
        </div>
      </div>
    </section>
  );
}
