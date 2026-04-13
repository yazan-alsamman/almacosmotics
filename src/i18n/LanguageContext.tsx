import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Locale } from './translations';
import { LOCALE_STORAGE_KEY, translate } from './translations';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const s = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (s === 'en' || s === 'ar') return s;
    } catch {
      /* ignore */
    }
    return 'ar';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = dir;
    document.body.dir = dir;
    document.title =
      locale === 'ar' ? 'ألما كوسمتكس | جمال فاخر' : 'Alma Cosmetics | Luxury Beauty';
  }, [locale, dir]);

  const t = useCallback((path: string) => translate(locale, path), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, dir }),
    [locale, setLocale, t, dir]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
