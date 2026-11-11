'use client';

import Image from 'next/image';
import { projects } from '@/data/projects';
import { useLanguage } from '@/lib/i18n';
import type { Project } from '@/types/portfolio';
import SectionHeading from './SectionHeading';

function ProjectLink({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  const { ui } = useLanguage();
  if (!href) {
    return (
      <span className="rounded-sm border border-dashed border-ink/25 px-4 py-2 text-sm text-ink-muted" title={ui.projects.pendingHint}>
        {label} · {ui.projects.pending}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-sm px-4 py-2 font-caps text-[11px] tracking-[1.5px] transition ${
        primary ? 'bg-oxblood text-paper hover:bg-ink' : 'border border-ink/30 hover:border-oxblood hover:text-oxblood'
      }`}
    >
      {label} ↗
    </a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t, ui } = useLanguage();
  const title = t(project.title);
  return (
    <article className="group flex flex-col overflow-hidden border border-ink/15 bg-[#f4ead4] shadow-[0_18px_40px_-28px_#36291c] transition hover:-translate-y-1 hover:shadow-[0_26px_50px_-26px_#36291c]">
      <div className="relative aspect-[16/10] overflow-hidden bg-ember">
        {project.image ? (
          <Image
            src={project.image}
            alt={ui.projects.screenshot(title)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_60%,#5a3a1a,#17120c_70%)] font-display text-6xl text-gold/60">
            {String(index + 1).padStart(2, '0')}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex justify-between gap-4 font-caps text-[10px] tracking-[2px] text-ink-muted">
          <span>{t(project.category)}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl leading-tight">{title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-ink/85">{t(project.description)}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={ui.projects.tech}>
          {project.tags.map(tag => (
            <li key={tag} className="rounded-full bg-ink/8 px-3 py-1 text-xs">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <ProjectLink href={project.demo} label={project.demoLabel ? t(project.demoLabel) : ui.projects.demo} primary />
          <ProjectLink href={project.github} label="GitHub" />
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { ui } = useLanguage();
  return (
    <section id="proyectos" className="bg-paper-deep px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading numeral="II" eyebrow={ui.projects.eyebrow} title={ui.projects.title} description={ui.projects.description} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.github || index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
