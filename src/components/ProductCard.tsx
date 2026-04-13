import { motion } from 'framer-motion';
import { Product } from '@/types';
import { formatPrice } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useStockStore } from '@/store/stockStore';
import { ShoppingBag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { productDisplayName } from '@/lib/productDisplay';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { t, locale } = useLanguage();
  const displayName = productDisplayName(product, locale);
  const addItem = useCartStore((s) => s.addItem);
  const stock = useStockStore((s) => s.getStock(product.id));
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/product/${product.id}`);
        }
      }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 aspect-[3/4] mb-4">
        <motion.img
          src={product.image}
          alt={displayName}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        {product.tags?.includes('bestseller') && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-sans tracking-widest uppercase px-3 py-1 rounded-full">
            {t('product.badgeBestseller')}
          </span>
        )}
        {product.tags?.includes('new') && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-sans tracking-widest uppercase px-3 py-1 rounded-full">
            {t('product.badgeNew')}
          </span>
        )}
        {stock <= 5 && stock > 0 && (
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-[10px] font-sans tracking-wider uppercase px-2.5 py-1 rounded-full"
          >
            {t('product.onlyLeft').replace('{n}', String(stock))}
          </motion.span>
        )}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (stock > 0) addItem(product);
          }}
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative overflow-hidden"
          aria-label={t('product.ariaAddToBag')}
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-background/20 to-transparent" />
          <ShoppingBag size={16} />
        </motion.button>
      </div>

      <div className="px-1">
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} className="fill-current" />
          <span className="text-xs font-sans text-muted-foreground">{product.rating}</span>
        </div>
        <h3 className="font-serif text-lg leading-tight">{displayName}</h3>
        <p className="text-sm font-sans text-muted-foreground mt-1">{formatPrice(product.price)}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
