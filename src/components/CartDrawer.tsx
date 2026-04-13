import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Gift, Trash2, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/data/products';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const FREE_SHIPPING_THRESHOLD = 200000;
const GIFT_WRAP_FEE = 10000;

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, giftWrapping, toggleGiftWrapping, subtotal } =
    useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const sub = subtotal();
  const offscreenX = dir === 'rtl' ? '-100%' : '100%';
  const shippingProgress = Math.min((sub / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const giftFee = giftWrapping ? GIFT_WRAP_FEE : 0;
  const freeUnlocked = sub >= FREE_SHIPPING_THRESHOLD;

  const remaining = useMemo(() => Math.max(FREE_SHIPPING_THRESHOLD - sub, 0), [sub]);

  const goCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate('/auth?redirect=/checkout&reason=member');
      return;
    }
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed end-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-2xl border-s border-border/40"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="font-serif text-xl">{t('cart.title')}</h2>
                <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-muted-foreground mt-1">{t('cart.subtitle')}</p>
              </div>
              <button type="button" onClick={closeCart} className="hover:opacity-70 transition-opacity" aria-label={t('nav.bag')}>
                <X size={20} />
              </button>
            </div>

            {sub > 0 && (
              <div className="px-6 pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-muted-foreground">
                    {freeUnlocked ? t('cart.freeShip') : `${formatPrice(remaining)} ${t('cart.toFreeShip')}`}
                  </span>
                  {freeUnlocked && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 text-[10px] tracking-wide uppercase text-foreground"
                    >
                      <Sparkles size={12} className="text-primary" />
                      {t('cart.sparkle')}
                    </motion.span>
                  )}
                </div>
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-foreground/80 to-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {freeUnlocked && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,.55)_50%,transparent_60%)] bg-[length:220%_100%]"
                      initial={{ backgroundPosition: '100% 0' }}
                      animate={{ backgroundPosition: '-100% 0' }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center">
                  <p className="font-serif text-lg text-muted-foreground">{t('cart.empty')}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-sans">{t('cart.emptyHint')}</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 44, scale: 0.95, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ delay: index * 0.055, type: 'spring', stiffness: 440, damping: 34 }}
                        exit={{
                          opacity: 0,
                          x: -44,
                          scale: 0.93,
                          transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                        }}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-24 rounded-lg overflow-hidden bg-card flex-shrink-0 ring-1 ring-border/40">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm truncate">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground font-sans mt-0.5">{formatPrice(item.product.price)}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="hover:opacity-70"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-sans w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="hover:opacity-70"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="ms-auto hover:opacity-70 text-muted-foreground"
                              aria-label="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4 bg-gradient-to-t from-card/60 to-background">
                <button
                  type="button"
                  onClick={toggleGiftWrapping}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    giftWrapping ? 'border-foreground bg-card' : 'border-border'
                  }`}
                >
                  <motion.div animate={{ rotateY: giftWrapping ? 180 : 0 }} transition={{ duration: 0.6 }}>
                    <Gift size={18} />
                  </motion.div>
                  <div className="text-start flex-1">
                    <span className="text-sm font-sans">{t('cart.giftWrap')}</span>
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
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(sub + giftFee)}</span>
                </div>

                <motion.button
                  type="button"
                  onClick={goCheckout}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 bg-foreground text-background rounded-xl font-sans text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity shadow-lg"
                >
                  {t('cart.checkout')}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
