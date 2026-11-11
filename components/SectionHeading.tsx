interface SectionHeadingProps {
  numeral: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  light?: boolean;
}

export default function SectionHeading({ numeral, eyebrow, title, description, light = false }: SectionHeadingProps) {
  return (
    <div className="mb-12 max-w-2xl md:mb-16">
      <p className={`flex items-center gap-3 font-caps text-[11px] tracking-[3px] ${light ? 'text-gold' : 'text-oxblood'}`}>
        <span className="font-display text-base italic tracking-normal">{numeral}.</span>
        {eyebrow}
        <span className={`h-px w-10 ${light ? 'bg-gold/50' : 'bg-oxblood/40'}`} />
      </p>
      <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl [&_em]:text-oxblood">{title}</h2>
      {description && <p className={`mt-4 text-lg ${light ? 'text-smoke' : 'text-ink-muted'}`}>{description}</p>}
    </div>
  );
}
