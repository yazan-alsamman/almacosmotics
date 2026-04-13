import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Locale } from '@/i18n/translations';

const locales: { id: Locale; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'ar', label: 'عربي' },
];

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className={`flex items-center gap-1 rounded-full border border-border/60 bg-background/80 backdrop-blur-md p-1 ${className}`}>
      <Globe size={14} className="text-muted-foreground ms-1" aria-hidden />
      <span className="sr-only">{t('common.language')}</span>
      {locales.map(({ id, label }) => (
        <motion.button
          key={id}
          type="button"
          onClick={() => setLocale(id)}
          className={`relative rounded-full px-2.5 py-1 text-[10px] font-sans font-semibold uppercase tracking-wider transition-colors ${
            locale === id ? 'text-[hsl(40,45%,22%)]' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {locale === id && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-amber-100/90 shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
