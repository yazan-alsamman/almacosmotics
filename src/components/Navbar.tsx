import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Home, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/i18n/LanguageContext';

const Navbar = () => {
  const itemCount = useCartStore((s) => s.itemCount());
  const bagPulseKey = useCartStore((s) => s.bagPulseKey);
  const openCart = useCartStore((s) => s.openCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <button type="button" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={t('nav.menu')}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-1.5">
            <Home size={14} />
            {t('nav.home')}
          </Link>
          <Link to="/products?cat=makeup" className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity">
            {t('nav.makeup')}
          </Link>
          <Link to="/products?cat=skincare" className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity">
            {t('nav.skincare')}
          </Link>
        </div>

        <Link to="/" className="absolute start-1/2 -translate-x-1/2 flex flex-col items-center z-[1]">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="font-serif text-primary-foreground text-xs font-bold tracking-wider">AC</span>
          </div>
          <span className="font-serif text-xs tracking-[0.3em] mt-0.5 hidden sm:block">ALMA</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageToggle className="hidden sm:flex" />
          <Link to="/products?cat=fragrance" className="hidden md:block text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity">
            {t('nav.fragrance')}
          </Link>
          <Link to="/admin" className="hidden sm:inline-flex hover:opacity-70 transition-opacity" title={t('nav.admin')} aria-label={t('nav.admin')}>
            <LayoutDashboard size={20} />
          </Link>
          <Link to="/auth" className="hover:opacity-70 transition-opacity" aria-label={t('nav.account')}>
            <User size={20} />
          </Link>
          <motion.button
            type="button"
            onClick={openCart}
            className="relative hover:opacity-70 transition-opacity"
            aria-label={t('nav.bag')}
          >
            <motion.span
              key={bagPulseKey}
              className="inline-block origin-bottom"
              initial={false}
              animate={
                bagPulseKey > 0
                  ? { rotate: [0, -18, 16, -10, 8, 0], y: [0, -6, 0], scale: [1, 1.1, 1] }
                  : { rotate: 0, y: 0, scale: 1 }
              }
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            >
              <ShoppingBag size={20} />
            </motion.span>
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-sans font-semibold"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      <div className="sm:hidden flex justify-center pb-2 px-4">
        <LanguageToggle />
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/50 bg-background/60 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-4 py-6">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-1.5">
                <Home size={14} /> {t('nav.home')}
              </Link>
              {(
                [
                  ['makeup', 'nav.makeup'],
                  ['skincare', 'nav.skincare'],
                  ['fragrance', 'nav.fragrance'],
                ] as const
              ).map(([slug, key]) => (
                <Link
                  key={slug}
                  to={`/products?cat=${slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity"
                >
                  {t(key)}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-1.5">
                <LayoutDashboard size={14} /> {t('nav.admin')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
