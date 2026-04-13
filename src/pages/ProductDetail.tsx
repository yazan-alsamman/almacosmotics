import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { useCatalogStore } from '@/store/catalogStore';
import { useCartStore } from '@/store/cartStore';
import { useStockStore } from '@/store/stockStore';
import Footer from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageContext';
import { productDisplayName } from '@/lib/productDisplay';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const product = useCatalogStore((s) => (id ? s.products.find((p) => p.id === id) : undefined));
  const displayName = product ? productDisplayName(product, locale) : '';
  const addItem = useCartStore((s) => s.addItem);
  const stock = useStockStore((s) => (product ? s.getStock(product.id) : 0));

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const images = useMemo(() => {
    if (!product) return [];
    return product.gallery.length ? product.gallery : [product.image];
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <p className="font-serif text-xl">{t('product.notFound')}</p>
        <Link to="/products" className="mt-6 text-sm font-sans tracking-widest uppercase underline">
          {t('product.backToCollection')}
        </Link>
      </div>
    );
  }

  const maxAdd = Math.min(stock, 99);
  const lowStock = stock > 0 && stock <= 8;

  const handleAdd = () => {
    if (stock <= 0) return;
    const n = Math.min(qty, stock);
    addItem(product, n);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-32 md:pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {t('product.back')}
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-card border border-border/50 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={displayName}
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.85 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5 rounded-2xl" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-foreground shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Star size={14} className="fill-current" />
                <span className="text-xs font-sans text-muted-foreground">{product.rating}</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-tight tracking-tight">
                {displayName}
              </h1>
              <p className="font-serif text-2xl mt-4">{formatPrice(product.price)}</p>
            </div>

            {/* Stock */}
            <div className="relative min-h-[1.75rem]">
              {stock <= 0 ? (
                <p className="text-sm font-sans text-destructive font-medium">{t('product.outOfStock')}</p>
              ) : lowStock ? (
                <motion.p
                  className="text-sm font-sans font-semibold text-destructive inline-flex items-center gap-2.5"
                  animate={{ opacity: [1, 0.72, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full bg-destructive"
                    style={{ animation: 'pulse-ring 1.8s ease-in-out infinite' }}
                  />
                  {t('product.lowStock').replace('{n}', String(stock))}
                </motion.p>
              ) : (
                <p className="text-sm font-sans text-muted-foreground">
                  {t('product.inStock').replace('{n}', String(stock))}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6">
              <span className="text-xs font-sans tracking-widest uppercase text-muted-foreground">{t('product.quantity')}</span>
              <div className="inline-flex items-center gap-4 rounded-full border border-border px-2 py-1.5 bg-background/80 backdrop-blur-sm">
                <button
                  type="button"
                  aria-label={t('product.ariaDecrease')}
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-card transition-colors disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <span className="font-serif text-xl tabular-nums w-8 text-center">{Math.min(qty, maxAdd || 1)}</span>
                <button
                  type="button"
                  aria-label={t('product.ariaIncrease')}
                  disabled={qty >= maxAdd || stock <= 0}
                  onClick={() => setQty((q) => Math.min(maxAdd, q + 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-card transition-colors disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <Accordion type="single" collapsible defaultValue="description" className="border border-border/60 rounded-2xl px-4 bg-card/30">
              <AccordionItem value="description" className="border-border/50">
                <AccordionTrigger className="font-serif text-lg hover:no-underline">{t('product.description')}</AccordionTrigger>
                <AccordionContent className="text-sm font-sans text-muted-foreground leading-relaxed pb-4">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="how" className="border-border/50">
                <AccordionTrigger className="font-serif text-lg hover:no-underline">{t('product.howToUse')}</AccordionTrigger>
                <AccordionContent className="text-sm font-sans text-muted-foreground leading-relaxed pb-4">
                  {product.howToUse}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ingredients" className="border-none">
                <AccordionTrigger className="font-serif text-lg hover:no-underline">{t('product.ingredients')}</AccordionTrigger>
                <AccordionContent className="text-sm font-sans text-muted-foreground leading-relaxed pb-4">
                  {product.ingredients}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Desktop CTA */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAdd}
              disabled={stock <= 0}
              className="hidden md:flex w-full py-4 bg-foreground text-background rounded-2xl font-sans text-sm tracking-[0.2em] uppercase items-center justify-center gap-3 hover:opacity-95 transition-opacity disabled:opacity-40 shadow-xl"
            >
              <ShoppingBag size={18} />
              {t('product.addToBag')}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile fixed bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-background/85 backdrop-blur-xl border-t border-border/80 shadow-[0_-8px_40px_rgba(0,0,0,.08)]"
      >
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-[10px] font-sans tracking-widest uppercase text-muted-foreground">{t('product.total')}</p>
            <p className="font-serif text-xl">{formatPrice(product.price * Math.min(qty, maxAdd || 1))}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={stock <= 0}
            className="flex-1 py-4 rounded-2xl bg-foreground text-background font-sans text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <ShoppingBag size={18} />
            {t('product.addToBag')}
          </button>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
