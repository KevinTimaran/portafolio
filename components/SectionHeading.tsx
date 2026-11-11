interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: { before: string; em: string };
  description?: string;
}

/** Encabezado de sección: «( 0N ) · ETIQUETA» seguido de un título grande con una parte en morado. */
export default function SectionHeading({ index, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-faint">
        <span className="text-violet-light">({index})</span>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
        {title.before} <span className="text-violet-light">{title.em}</span>
      </h2>
      {description && <p className="mt-4 max-w-xl text-lg text-ink-dim">{description}</p>}
    </div>
  );
}
