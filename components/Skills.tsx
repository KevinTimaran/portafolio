import { interests, skills } from '@/data/profile';
import SectionHeading from './SectionHeading';

/** Sección adicional: el oficio (intereses + nivel en cada herramienta). */
export default function Skills() {
  return (
    <section id="habilidades" className="paper-texture px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          numeral="VI"
          eyebrow="Sección adicional · El oficio"
          title={<>El placer <em>de hacer.</em></>}
          description="Tres maneras de acercarme a una idea y las herramientas con las que les doy vida."
        />

        <div className="grid gap-10 md:grid-cols-3">
          {interests.map(interest => (
            <article key={interest.numeral} className="border-t border-ink/20 pt-6">
              <span className="font-display text-5xl italic text-oxblood/70">{interest.numeral}</span>
              <h3 className="mt-2 font-display text-3xl">{interest.title}</h3>
              <p className="font-caps text-[10px] tracking-[2.5px] text-ink-muted">{interest.label}</p>
              <p className="mt-3 leading-relaxed">{interest.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {skills.map(skill => (
            <div key={skill.name}>
              <div className="flex justify-between text-[15px]">
                <span>{skill.name}</span>
                <span className="text-ink-muted">{skill.level}%</span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10"
                role="meter"
                aria-label={skill.name}
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full rounded-full bg-gradient-to-r from-oxblood to-gold" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>

        <blockquote className="mt-20 text-center font-display text-3xl italic leading-snug text-ink/80 sm:text-4xl">
          «La técnica abre el camino.
          <br />
          La sensibilidad decide adónde ir.»
        </blockquote>
      </div>
    </section>
  );
}
