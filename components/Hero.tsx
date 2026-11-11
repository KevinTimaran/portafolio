import Image from 'next/image';
import { profile } from '@/data/profile';

/** Primera página del libro: bienvenida con CV. */
export default function Hero() {
  return (
    <section id="inicio" aria-label="Bienvenida" className="px-4 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.35fr_1fr] md:gap-16">
        <div>
          <p className="flex items-center gap-3 font-caps text-[11px] tracking-[3px] text-oxblood">
            <span className="h-px w-8 bg-oxblood/50" />
            Folio primero · El autor
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.02] tracking-tight">
            {profile.name}
            <br />
            <em className="text-oxblood">{profile.surname}</em>
          </h1>
          <p className="mt-4 font-caps text-xs tracking-[2.5px] text-ink-muted sm:text-sm">{profile.role}</p>
          <div className="my-6 h-px w-16 bg-oxblood/40" aria-hidden="true" />
          <p className="max-w-xl text-xl leading-relaxed">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.cvUrl}
              download
              className="inline-flex items-center gap-2 rounded-sm bg-oxblood px-6 py-3 font-caps text-xs tracking-[2px] text-paper shadow-md transition hover:bg-ink"
            >
              Descargar CV <span aria-hidden="true">↓</span>
            </a>
            <a
              href="#proyectos"
              className="inline-flex items-center gap-2 rounded-sm border border-ink/30 px-6 py-3 font-caps text-xs tracking-[2px] transition hover:border-oxblood hover:text-oxblood"
            >
              Ver proyectos <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-xs md:max-w-sm">
          <div className="-rotate-1 border border-ink/20 bg-[#f4ead4] p-3 shadow-[0_20px_50px_-20px_#36291c80]">
            <Image
              src={profile.portrait}
              alt={`Foto de ${profile.fullName}`}
              width={600}
              height={750}
              priority
              className="aspect-[4/5] w-full object-cover sepia-[.25]"
            />
          </div>
          <figcaption className="mt-4 text-center text-sm italic text-ink-muted">
            <span className="mr-2 font-caps not-italic tracking-[2px]">FIG. I</span> Retrato del autor
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
