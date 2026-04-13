import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAdminAuthStore } from '@/store/adminAuthStore';

const AdminLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const login = useAdminAuthStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    document.documentElement.classList.add('admin-mode');
    return () => document.documentElement.classList.remove('admin-mode');
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    if (login(username.trim(), password)) {
      navigate(from, { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Layered gradients — burgundy → plum → warm bronze */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(348,48%,11%)] via-[hsl(350,36%,19%)] to-[hsl(32,38%,28%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(348,50%,7%)] via-[hsl(348,35%,16%)]/75 to-[hsl(350,45%,42%)]/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[min(85vh,520px)] w-[min(120vw,720px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(43,58%,52%)/0.28,transparent_62%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/35 to-transparent"
        aria-hidden
      />

      <div className="absolute top-4 end-4 z-20">
        <div className="rounded-full border border-white/35 bg-white/92 p-1 shadow-lg backdrop-blur-md">
          <LanguageToggle className="border-0 bg-transparent" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}alma-admin-logo.png`}
            alt="Alma Cosmetics"
            className="w-28 h-28 object-contain rounded-full shadow-[0_12px_48px_rgba(0,0,0,0.45)] ring-2 ring-amber-400/45 ring-offset-4 ring-offset-[hsl(348,40%,14%)]"
          />
          <h1 className="mt-6 font-serif text-2xl sm:text-3xl text-[hsl(40,55%,96%)] tracking-wide drop-shadow-sm">
            {t('admin.brand')}
          </h1>
          <p className="text-[11px] font-sans tracking-[0.28em] uppercase text-amber-200/75 mt-2">
            {t('admin.suite')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-amber-200/20 bg-gradient-to-b from-white/16 to-white/[0.07] p-7 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl space-y-4 ring-1 ring-white/10"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-user" className="text-amber-100/95">
              {t('admin.username')}
            </Label>
            <Input
              id="admin-user"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-amber-200/25 bg-white/[0.97] text-[hsl(348,38%,20%)] shadow-inner placeholder:text-[hsl(348,18%,48%)] focus-visible:border-amber-400/50 focus-visible:ring-amber-400/35"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass" className="text-amber-100/95">
              {t('admin.password')}
            </Label>
            <Input
              id="admin-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-amber-200/25 bg-white/[0.97] text-[hsl(348,38%,20%)] shadow-inner placeholder:text-[hsl(348,18%,48%)] focus-visible:border-amber-400/50 focus-visible:ring-amber-400/35"
            />
          </div>
          {error && (
            <p className="text-sm font-sans text-rose-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              {t('admin.invalidCredentials')}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 border border-amber-400/25 bg-gradient-to-r from-[hsl(348,44%,36%)] via-[hsl(348,42%,32%)] to-[hsl(348,48%,26%)] text-amber-50 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_10px_28px_rgba(0,0,0,0.4)]"
          >
            <LogIn className="w-4 h-4 opacity-95" />
            {t('admin.signIn')}
          </Button>
        </form>

        <p className="text-center mt-9">
          <Link
            to="/"
            className="text-[11px] font-sans tracking-[0.22em] uppercase text-amber-200/80 transition-colors hover:text-amber-50"
          >
            {t('admin.backToStore')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
