'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ui, type UiStrings } from '@/data/ui';

export const languages = ['es', 'en'] as const;
export type Lang = (typeof languages)[number];

/** Un texto en ambos idiomas. */
export type Localized<T = string> = Record<Lang, T>;
/** Texto que puede ser igual en los dos idiomas (string) o distinto en cada uno. */
export type Text = string | Localized;

const STORAGE_KEY = 'portafolio-lang';

interface LanguageValue {
  lang: Lang;
  setLang(lang: Lang): void;
  /** Devuelve el texto en el idioma activo. */
  t(text: Text): string;
  /** Textos fijos de la interfaz en el idioma activo. */
  ui: UiStrings;
}

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');

  // El idioma guardado se lee después de montar para no romper la hidratación.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') setLangState(saved);
      else if (!navigator.language.toLowerCase().startsWith('es')) setLangState('en');
    } catch {
      /* sin almacenamiento: se queda en español */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* sin almacenamiento */
    }
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({ lang, setLang, t: text => (typeof text === 'string' ? text : text[lang]), ui: ui[lang] }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>.');
  return value;
}
