import Image from 'next/image';
import { profile } from '@/data/profile';
import SectionHeading from './SectionHeading';

export default function About() {
  return (
    <section id="sobre-mi" className="paper-texture px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div>
          <SectionHeading numeral="I" eyebrow="Acerca de mí" title={<>Todo comienza <em>con una página.</em></>} />
          <div className="space-y-5 text-lg leading-relaxed sm:text-xl">
            {profile.about.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-oxblood' : ''}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="mt-10 grid gap-6 border-y border-ink/15 py-6 sm:grid-cols-3">
            {profile.facts.map(fact => (
              <div key={fact.label}>
                <dt className="font-caps text-[10px] tracking-[2.5px] text-ink-muted">{fact.label}</dt>
                <dd className="mt-1 font-display text-xl">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-10 font-caps text-[11px] tracking-[3px] text-oxblood">Habilidades y tecnologías</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <li key={skill} className="rounded-full border border-ink/20 bg-paper-deep/60 px-4 py-1.5 text-[15px]">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <aside className="mx-auto flex w-full max-w-xs flex-col items-center border-y border-ink/15 py-10 text-center md:mt-28">
          <Image
            src={profile.portrait}
            alt={`Retrato de ${profile.fullName}`}
            width={240}
            height={300}
            className="h-44 w-36 rounded-[50%] border border-ink/25 object-cover p-1.5 sepia-[.3]"
          />
          <span className="mt-6 font-display text-5xl italic text-oxblood/70">I</span>
          <p className="mt-2 font-display text-2xl italic leading-snug">
            Sobre el camino,
            <br />
            las preguntas
            <br />y el aprendizaje.
          </p>
          <span aria-hidden="true" className="mt-4 text-gold">
            ✧
          </span>
        </aside>
      </div>
    </section>
  );
}
