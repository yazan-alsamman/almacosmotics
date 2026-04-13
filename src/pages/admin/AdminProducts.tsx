import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCatalogStore } from '@/store/catalogStore';
import { useStockStore } from '@/store/stockStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatPrice } from '@/data/products';
import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const AdminProducts = () => {
  const products = useCatalogStore((s) => s.products);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const getStock = useStockStore((s) => s.getStock);
  const { t } = useLanguage();

  const [cat, setCat] = useState<string>('all');
  const [priceMax, setPriceMax] = useState('');
  const [stockFilter, setStockFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (priceMax && p.price > Number(priceMax)) return false;
      const st = getStock(p.id);
      if (stockFilter === 'low' && st > 5) return false;
      if (stockFilter === 'out' && st > 0) return false;
      return true;
    });
  }, [products, cat, priceMax, stockFilter, getStock]);

  const onDelete = (p: Product) => {
    if (!confirm(t('admin.deleteConfirm'))) return;
    deleteProduct(p.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">{t('admin.products')}</h1>
          <p className="text-sm font-sans text-muted-foreground mt-2">{t('admin.filters')}</p>
        </div>
        <Button
          asChild
          className="rounded-full bg-foreground text-background hover:opacity-90 shadow-lg"
        >
          <Link to="/admin/products/new">
            <Plus className="me-2 h-4 w-4" />
            {t('admin.newProduct')}
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-end rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('admin.category')}</label>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.all')}</SelectItem>
              <SelectItem value="makeup">{t('nav.makeup')}</SelectItem>
              <SelectItem value="skincare">{t('nav.skincare')}</SelectItem>
              <SelectItem value="fragrance">{t('nav.fragrance')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('admin.priceMaxLabel')}</label>
          <Input
            type="number"
            placeholder="—"
            className="w-32 rounded-xl"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('admin.stock')}</label>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.all')}</SelectItem>
              <SelectItem value="low">{t('admin.low')} (≤5)</SelectItem>
              <SelectItem value="out">Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/20 backdrop-blur-xl overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="font-serif">{t('admin.productName')}</TableHead>
              <TableHead>{t('admin.category')}</TableHead>
              <TableHead>{t('admin.price')}</TableHead>
              <TableHead>{t('admin.stock')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="border-border/40">
                <TableCell className="font-serif max-w-[200px] truncate">{p.name}</TableCell>
                <TableCell className="capitalize text-sm">{p.category}</TableCell>
                <TableCell className="text-sm">{formatPrice(p.price)}</TableCell>
                <TableCell>
                  <span className={getStock(p.id) <= 5 ? 'text-destructive font-medium' : ''}>
                    {getStock(p.id)}
                  </span>
                </TableCell>
                <TableCell className="text-end space-x-2">
                  <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link to={`/admin/products/${p.id}/edit`} aria-label={t('admin.edit')}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => onDelete(p)}
                    aria-label={t('admin.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default AdminProducts;
