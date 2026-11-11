'use client';

import { navLinks, profile, socialLinks } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';
import SocialIcon from './SocialIcon';

export default function Footer() {
  const { t, ui } = useLanguage();
  const year = new Date().getFullYear();
  const links = [...socialLinks, ...(profile.email ? [{ label: 'Correo' as const, url: `mailto:${profile.email}` }] : [])].filter(link => link.url);

  return (
    <footer className="border-t border-line px-4 sm:px-8">
      {/* Llamada final */}
      <div className="relative mx-auto max-w-5xl overflow-hidden py-20 text-center md:py-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[18vw] font-extrabold leading-none text-ink/[0.03]"
        >
          {profile.initials}
        </span>
        <h2 className="relative text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {ui.footer.ctaTitle.before} <span className="text-violet-light">{ui.footer.ctaTitle.em}</span>
        </h2>
        <a
          href={profile.cvUrl}
          download
          className="relative mt-8 inline-flex rounded-full border border-violet/60 px-8 py-3.5 text-sm font-bold text-violet-light transition hover:bg-violet hover:text-void"
        >
          {ui.hero.downloadCv} ↓
        </a>
      </div>

      {/* Pie */}
      <div className="mx-auto max-w-5xl border-t border-line py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="font-mono text-lg font-extrabold">
              {'<'}
              {profile.initials}
              {'/>'}
            </p>
            <p className="mt-1 text-sm text-ink-faint">{t(profile.role)}</p>
          </div>

          <nav aria-label={ui.footer.quickLinks} className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-dim sm:justify-end">
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} className="transition hover:text-violet-light">
                {t(link.label)}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            {links.map(link => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={link.label}
                className="grid size-9 place-items-center rounded-full bg-surface text-ink-dim ring-1 ring-line transition hover:text-violet-light"
              >
                <SocialIcon label={link.label} size={16} />
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-ink-faint sm:text-right">
            © {year} {profile.fullName}. {ui.footer.rights}
            <br />
            {ui.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
