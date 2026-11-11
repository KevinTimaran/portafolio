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
      <span className="rounded-full border border-dashed border-line px-5 py-2.5 text-sm text-ink-faint" title={ui.projects.pendingHint}>
        {label} · {ui.projects.pending}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-95 ${
        primary ? 'bg-violet text-void hover:bg-violet-light' : 'border border-line text-ink hover:border-violet hover:text-violet-light'
      }`}
    >
      {label} ↗
    </a>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const { t, ui } = useLanguage();
  const title = t(project.title);
  return (
    <article className="grid gap-8 border-t border-line py-14 first:border-t-0 first:pt-0 md:grid-cols-[auto_1fr] md:gap-12">
      <span className="text-6xl font-extrabold leading-none text-ink-faint md:text-7xl">{String(index + 1).padStart(2, '0')}.</span>
      <div>
        <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          {project.image ? (
            <Image
              src={project.image}
              alt={ui.projects.screenshot(title)}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-5xl font-black text-ink-faint/40">{String(index + 1).padStart(2, '0')}</div>
          )}
        </div>
        <p className="text-sm font-semibold text-violet-light">{project.tags.join(' · ')}</p>
        <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          {t(project.category)} · {project.year}
        </p>
        <p className="mt-4 max-w-2xl text-ink-dim">{t(project.description)}</p>
        <div className="mt-6 flex flex-wrap gap-2.5">
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
    <section id="proyectos" className="border-t border-line px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading index="05" eyebrow={ui.projects.eyebrow} title={ui.projects.title} description={ui.projects.description} />
        <div>
          {projects.map((project, index) => (
            <ProjectRow key={project.github || index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
