import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/store/adminStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatPrice } from '@/data/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AdminUsers = () => {
  const users = useAdminStore((s) => s.users);
  const orders = useAdminStore((s) => s.orders);
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);

  const orderTotal = (orderId: string) => {
    const o = orders.find((x) => x.id === orderId);
    return o?.total ?? 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl"
    >
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">{t('admin.customersTitle')}</h1>
        <p className="text-sm font-sans text-muted-foreground mt-2">WhatsApp OTP · {t('admin.history')}</p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/20 backdrop-blur-xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>{t('admin.customer')}</TableHead>
              <TableHead>{t('admin.phone')}</TableHead>
              <TableHead>{t('admin.ordersCount')}</TableHead>
              <TableHead className="w-24">{t('admin.history')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <Fragment key={u.id}>
                <TableRow className="border-border/40">
                  <TableCell className="font-serif">{u.name || '—'}</TableCell>
                  <TableCell className="font-mono text-sm">{u.phone}</TableCell>
                  <TableCell>{u.orderIds.length}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      type="button"
                      onClick={() => setOpenId((x) => (x === u.id ? null : u.id))}
                    >
                      {openId === u.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </TableCell>
                </TableRow>
                <AnimatePresence>
                  {openId === u.id && (
                    <TableRow className="bg-muted/20 border-0 hover:bg-muted/25">
                      <TableCell colSpan={4} className="p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 py-4 space-y-2"
                        >
                          {u.orderIds.length === 0 ? (
                            <p className="text-sm text-muted-foreground">—</p>
                          ) : (
                            u.orderIds.map((oid) => (
                              <div key={oid} className="flex justify-between text-sm font-sans border-b border-border/30 pb-2 last:border-0">
                                <span className="font-mono text-xs">{oid}</span>
                                <span>{formatPrice(orderTotal(oid))}</span>
                              </div>
                            ))
                          )}
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
