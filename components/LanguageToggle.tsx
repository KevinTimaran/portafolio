'use client';

import { languages, useLanguage } from '@/lib/i18n';

/** Selector ES / EN. Hereda el color del contenedor para encajar en el paisaje, el libro y el móvil. */
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, ui } = useLanguage();

  return (
    <div role="group" aria-label={ui.languageToggle.label} className={`flex items-center gap-0.5 text-[11px] font-semibold tracking-[1.5px] ${className}`}>
      {languages.map((code, index) => (
        <span key={code} className="flex items-center">
          {index > 0 && <span aria-hidden="true" className="px-0.5 opacity-40">|</span>}
          <button
            type="button"
            lang={code}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            aria-label={ui.languageToggle[code]}
            className={`rounded px-1.5 py-1 uppercase transition ${lang === code ? 'opacity-100 underline underline-offset-4' : 'opacity-55 hover:opacity-90'}`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
