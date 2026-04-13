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
    <div className="min-h-screen admin-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute top-4 end-4">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}alma-admin-logo.png`}
            alt="Alma Cosmetics"
            className="w-28 h-28 object-contain rounded-full shadow-md ring-1 ring-black/5"
          />
          <h1 className="mt-5 font-serif text-2xl text-foreground tracking-wide">{t('admin.brand')}</h1>
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-muted-foreground mt-1">
            {t('admin.suite')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-sm space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-user">{t('admin.username')}</Label>
            <Input
              id="admin-user"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass">{t('admin.password')}</Label>
            <Input
              id="admin-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive font-sans">{t('admin.invalidCredentials')}</p>
          )}
          <Button type="submit" className="w-full gap-2" size="lg">
            <LogIn className="w-4 h-4" />
            {t('admin.signIn')}
          </Button>
        </form>

        <p className="text-center mt-8">
          <Link
            to="/"
            className="text-xs font-sans tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('admin.backToStore')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
