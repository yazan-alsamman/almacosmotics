import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Gift, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/products';
import { useNavigate } from 'react-router-dom';

const FREE_SHIPPING_THRESHOLD = 200000;
const GIFT_WRAP_FEE = 10000;

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, giftWrapping, toggleGiftWrapping, subtotal } = useCartStore();
  const navigate = useNavigate();
  const sub = subtotal();
  const shippingProgress = Math.min((sub / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const giftFee = giftWrapping ? GIFT_WRAP_FEE : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">Your Bag</h2>
              <button onClick={closeCart} className="hover:opacity-70 transition-opacity">
                <X size={20} />
              </button>
            </div>

            {/* Free shipping bar */}
            {sub > 0 && (
              <div className="px-6 pt-4">
                <div className="text-xs font-sans text-muted-foreground mb-2">
                  {sub >= FREE_SHIPPING_THRESHOLD
                    ? '✨ You qualify for free shipping!'
                    : `${formatPrice(FREE_SHIPPING_THRESHOLD - sub)} away from free shipping`}
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-serif text-lg text-muted-foreground">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground mt-1 font-sans">Discover our luxury collection</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-card flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground font-sans mt-0.5">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="hover:opacity-70">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-sans w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="hover:opacity-70">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => removeItem(item.product.id)} className="ml-auto hover:opacity-70 text-muted-foreground">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                {/* Gift wrapping toggle */}
                <button
                  onClick={toggleGiftWrapping}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    giftWrapping ? 'border-foreground bg-card' : 'border-border'
                  }`}
                >
                  <motion.div animate={{ rotateY: giftWrapping ? 180 : 0 }} transition={{ duration: 0.6 }}>
                    <Gift size={18} />
                  </motion.div>
                  <div className="text-left flex-1">
                    <span className="text-sm font-sans">Gift Wrapping</span>
                    <span className="text-xs text-muted-foreground block">{formatPrice(GIFT_WRAP_FEE)}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${giftWrapping ? 'bg-foreground' : 'bg-muted'}`}>
                    <motion.div
                      className="w-4 h-4 bg-background rounded-full mt-0.5"
                      animate={{ x: giftWrapping ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>

                <div className="flex justify-between text-sm font-sans">
                  <span>Subtotal</span>
                  <span>{formatPrice(sub + giftFee)}</span>
                </div>

                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full py-3.5 bg-foreground text-background rounded-xl font-sans text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;