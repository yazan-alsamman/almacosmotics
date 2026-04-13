import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAdminStore } from '@/store/adminStore';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/i18n/LanguageContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-sans transition-all ${
    isActive
      ? 'bg-white/15 text-amber-100 shadow-[inset_0_0_0_1px_rgba(255,215,150,0.25)]'
      : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`;

const AdminLayout = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const orders = useAdminStore((s) => s.orders);
  const prevOrderCount = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('admin-mode');
    return () => document.documentElement.classList.remove('admin-mode');
  }, []);

  useEffect(() => {
    if (prevOrderCount.current !== null && orders.length > prevOrderCount.current && orders[0]) {
      const o = orders[0];
      toast.success('New order received', {
        description: `${o.customer.name} · ${o.total.toLocaleString()} SYP`,
      });
    }
    prevOrderCount.current = orders.length;
  }, [orders]);

  return (
    <div className="min-h-screen admin-surface flex flex-col md:flex-row">
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex w-64 flex-col border-e border-white/10 bg-gradient-to-b from-[hsl(348,42%,18%)]/95 to-[hsl(348,45%,12%)]/98 backdrop-blur-2xl text-white shadow-2xl"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200/90 to-amber-600/50 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-[hsl(348,45%,22%)]" />
            </div>
            <div>
              <p className="font-serif text-lg tracking-wide text-amber-50">{t('admin.brand')}</p>
              <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-white/50">{t('admin.suite')}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin/dashboard" className={navLinkClass} end>
            <LayoutDashboard size={18} />
            {t('admin.dashboard')}
          </NavLink>
          <NavLink to="/admin/products" className={navLinkClass}>
            <Package size={18} />
            {t('admin.products')}
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClass}>
            <ShoppingBag size={18} />
            {t('admin.orders')}
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            <Users size={18} />
            {t('admin.users')}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-sans tracking-widest uppercase text-white/80 hover:bg-white/10 transition-colors"
          >
            <ExternalLink size={14} />
            {t('admin.backToStore')}
          </Link>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="md:hidden font-serif text-lg text-foreground">{t('admin.suite')}</div>
            <div className="ms-auto flex items-center gap-3">
              <LanguageToggle />
            </div>
          </div>
          <nav className="md:hidden flex gap-2 overflow-x-auto pb-1 mt-3 -mx-1 px-1">
            {[
              { to: '/admin/dashboard', label: t('admin.dashboard') },
              { to: '/admin/products', label: t('admin.products') },
              { to: '/admin/orders', label: t('admin.orders') },
              { to: '/admin/users', label: t('admin.users') },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase border ${
                    isActive ? 'border-foreground bg-card' : 'border-border/60 text-muted-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
