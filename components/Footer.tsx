'use client';

import { navLinks, profile, socialLinks } from '@/data/profile';
import { useLanguage } from '@/lib/i18n';

const icons: Record<string, React.ReactNode> = {
  GitHub: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
  LinkedIn: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-3.93v-11Z" />
  ),
  Correo: <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.4 7H19.6L12 12.2ZM4 8.6V17h16V8.6l-8 5.4-8-5.4Z" />,
};

export default function Footer() {
  const { t, ui } = useLanguage();
  const year = new Date().getFullYear();
  const links = [...socialLinks, ...(profile.email ? [{ label: 'Correo' as const, url: `mailto:${profile.email}` }] : [])].filter(link => link.url);

  return (
    <footer id="colofon" className="bg-night px-4 pb-10 pt-16 text-smoke sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_auto] md:items-start">
        <div>
          <p className="font-display text-4xl leading-none tracking-[-6px] text-gold-light">
            K<span className="text-3xl">B</span>
          </p>
          <p className="mt-4 font-display text-2xl text-parchment">{profile.fullName}</p>
          <p className="text-sm">{t(profile.role)}</p>
          <ul className="mt-5 flex gap-3">
            {links.map(link => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="grid size-10 place-items-center rounded-full border border-gold/30 text-parchment transition hover:border-gold-light hover:text-gold-light"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
                    {icons[link.label]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={ui.footer.quickLinks}>
          <p className="font-caps text-[10px] tracking-[2.5px] text-gold">{ui.footer.index}</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
            {navLinks.map(link => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="transition hover:text-parchment">
                  {t(link.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#inicio"
          className="inline-flex items-center gap-2 self-start rounded-sm border border-gold/40 px-5 py-3 font-caps text-[10px] tracking-[2px] text-parchment transition hover:bg-gold/10"
        >
          {ui.footer.backToTop} <span aria-hidden="true">↑</span>
        </a>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-2 border-t border-gold/15 pt-6 text-sm sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.fullName}. {ui.footer.rights}
        </p>
        <p>{ui.footer.madeWith}</p>
      </div>
    </footer>
  );
}
