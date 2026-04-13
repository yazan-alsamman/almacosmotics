import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { Order } from '@/types';
import { formatPrice } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusVariant: Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  accepted: 'default',
  rejected: 'destructive',
  shipped: 'outline',
  delivered: 'outline',
};

const AdminOrders = () => {
  const orders = useAdminStore((s) => s.orders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const { t } = useLanguage();

  const statusLabel = (s: Order['status']) => {
    const map: Record<Order['status'], string> = {
      pending: t('admin.pending'),
      accepted: t('admin.accepted'),
      rejected: t('admin.rejected'),
      shipped: t('admin.shipped'),
      delivered: t('admin.delivered'),
    };
    return map[s];
  };

  const mapsUrl = (o: Order) => {
    if (!o.location) return null;
    const { lat, lng } = o.location;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-[1100px]"
    >
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">{t('admin.incoming')}</h1>
        <p className="text-sm font-sans text-muted-foreground mt-2">{t('admin.orders')}</p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/20 backdrop-blur-xl overflow-x-auto shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>{t('admin.orderId')}</TableHead>
              <TableHead>{t('admin.customer')}</TableHead>
              <TableHead>{t('admin.date')}</TableHead>
              <TableHead>{t('admin.delivery')}</TableHead>
              <TableHead>{t('admin.location')}</TableHead>
              <TableHead>{t('admin.total')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  —
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id} className="border-border/40">
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>
                    <div className="font-serif text-sm">{o.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer.phone}</div>
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {format(new Date(o.createdAt), 'MMM d, HH:mm')}
                  </TableCell>
                  <TableCell className="text-xs max-w-[120px]">
                    {o.deliveryDate ? format(new Date(o.deliveryDate), 'EEE MMM d') : '—'}
                  </TableCell>
                  <TableCell>
                    {mapsUrl(o) ? (
                      <a
                        href={mapsUrl(o)!}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
                      >
                        <ExternalLink size={12} />
                        {t('admin.maps')}
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="font-serif text-sm">{formatPrice(o.total)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[o.status]}>{statusLabel(o.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {o.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="rounded-full h-8 text-xs" type="button" onClick={() => updateOrderStatus(o.id, 'accepted')}>
                            {t('admin.accept')}
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-full h-8 text-xs text-destructive" type="button" onClick={() => updateOrderStatus(o.id, 'rejected')}>
                            {t('admin.reject')}
                          </Button>
                        </>
                      )}
                      {o.status === 'accepted' && (
                        <Button size="sm" className="rounded-full h-8 text-xs" type="button" onClick={() => updateOrderStatus(o.id, 'shipped')}>
                          {t('admin.markShipped')}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default AdminOrders;
