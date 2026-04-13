import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useAdminStore } from '@/store/adminStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const orders = useAdminStore((s) => s.orders);
  const users = useAdminStore((s) => s.users);
  const { t } = useLanguage();

  const { revenueByDay, topProducts } = useMemo(() => {
    const revMap = new Map<string, number>();
    const prodMap = new Map<string, number>();

    orders.forEach((o) => {
      const day = format(new Date(o.createdAt), 'MMM d');
      revMap.set(day, (revMap.get(day) ?? 0) + o.total);
      o.items.forEach((line) => {
        const k = line.product.name;
        prodMap.set(k, (prodMap.get(k) ?? 0) + line.quantity);
      });
    });

    const revenueByDay = Array.from(revMap.entries())
      .map(([name, total]) => ({ name, total }))
      .slice(0, 8);

    const topProducts = Array.from(prodMap.entries())
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 6);

    return { revenueByDay, topProducts };
  }, [orders]);

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const orderCount = orders.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-6xl"
    >
      <div>
        <h1 className="font-serif text-3xl md:text-4xl text-foreground">{t('admin.dashboard')}</h1>
        <p className="text-sm font-sans text-muted-foreground mt-2">{t('admin.salesOverview')}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: t('admin.revenue'), value: totalSales.toLocaleString(), suffix: ` ${t('common.currency')}` },
          { label: t('admin.orders'), value: String(orderCount), suffix: '' },
          { label: t('admin.customersTitle'), value: String(users.length), suffix: '' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-lg shadow-primary/5"
          >
            <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground">{card.label}</p>
            <p className="font-serif text-2xl mt-2 text-foreground">
              {card.value}
              <span className="text-sm font-sans text-muted-foreground">{card.suffix}</span>
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-6 min-h-[320px]">
          <h2 className="font-serif text-xl mb-6">{t('admin.chartSales')}</h2>
          {revenueByDay.length === 0 ? (
            <p className="text-sm text-muted-foreground font-sans">{t('admin.incoming')} — 0</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                  }}
                />
                <Bar dataKey="total" fill="hsl(348, 45%, 34%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-6">
          <h2 className="font-serif text-xl mb-6">{t('admin.chartUnits')}</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground font-sans">—</p>
          ) : (
            <ul className="space-y-4">
              {topProducts.map((row, i) => (
                <motion.li
                  key={row.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center border-b border-border/40 pb-3 last:border-0"
                >
                  <span className="font-serif text-sm truncate max-w-[70%]">{row.name}</span>
                  <span className="text-xs font-sans text-muted-foreground">
                    {row.units} {t('admin.units')}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
