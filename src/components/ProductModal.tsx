import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, AlertTriangle } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useStockStore } from '@/store/stockStore';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const stock = useStockStore((s) => (product ? s.getStock(product.id) : 0));

  if (!product) return null;

  const handleAddToCart = () => {
    if (stock <= 0) return;
    addItem(product);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] z-50 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto">
              {/* Image */}
              <div className="md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  layoutId={`product-image-${product.id}`}
                />
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="fill-current text-foreground" />
                    <span className="text-xs font-sans text-muted-foreground">{product.rating}</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl">{product.name}</h2>
                  <p className="font-sans text-lg mt-2 text-foreground">{formatPrice(product.price)}</p>
                  <p className="text-sm font-sans text-muted-foreground mt-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Stock counter */}
                  <motion.div
                    className="mt-6 flex items-center gap-2"
                    animate={stock <= 5 ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {stock <= 5 && stock > 0 && (
                      <AlertTriangle size={14} className="text-destructive" />
                    )}
                    <span className={`text-xs font-sans tracking-wide uppercase ${
                      stock <= 5 ? 'text-destructive font-semibold' : 'text-muted-foreground'
                    }`}>
                      {stock <= 0 ? 'Out of Stock' : stock <= 5 ? `Only ${stock} pieces remaining!` : `${stock} in stock`}
                    </span>
                  </motion.div>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full py-3.5 bg-foreground text-background rounded-xl font-sans text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-background/20 to-transparent" />
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
