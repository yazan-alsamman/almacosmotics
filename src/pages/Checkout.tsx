import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import SyriaMap from '@/components/SyriaMap';
import Footer from '@/components/Footer';
import { Governorate } from '@/types';
import { formatPrice } from '@/data/products';
import { Check } from 'lucide-react';

const GIFT_WRAP_FEE = 10000;
const FREE_SHIPPING_THRESHOLD = 200000;

const Checkout = () => {
  const { items, subtotal, giftWrapping, clearCart } = useCartStore();
  const sub = subtotal();
  const [selectedGov, setSelectedGov] = useState<Governorate | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingFee = selectedGov
    ? sub >= FREE_SHIPPING_THRESHOLD
      ? 0
      : selectedGov.shippingFee
    : 0;
  const giftFee = giftWrapping ? GIFT_WRAP_FEE : 0;
  const total = sub + shippingFee + giftFee;

  const handlePlaceOrder = () => {
    if (!selectedGov || items.length === 0) return;
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-foreground mx-auto mb-6 flex items-center justify-center"
          >
            <Check size={28} className="text-background" />
          </motion.div>
          <h1 className="font-serif text-2xl">Order Confirmed</h1>
          <p className="text-sm font-sans text-muted-foreground mt-3 leading-relaxed">
            Thank you for your purchase. You'll receive a WhatsApp confirmation shortly.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-4xl text-center mb-12"
        >
          Checkout
        </motion.h1>

        {items.length === 0 && !orderPlaced ? (
          <p className="text-center text-muted-foreground font-sans">Your bag is empty.</p>
        ) : (
          <div className="space-y-8">
            {/* Order summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h2 className="font-sans text-xs tracking-widest uppercase mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl bg-card">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-sans">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </motion.div>

            {/* Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-sans text-xs tracking-widest uppercase mb-4">Delivery</h2>
              <SyriaMap onSelect={setSelectedGov} selected={selectedGov} />
            </motion.div>

            {/* Totals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-border pt-6 space-y-2"
            >
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {giftWrapping && (
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">Gift Wrapping</span>
                  <span>{formatPrice(GIFT_WRAP_FEE)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Shipping</span>
                <span>{selectedGov ? (shippingFee === 0 ? 'Free' : formatPrice(shippingFee)) : '—'}</span>
              </div>
              <div className="flex justify-between font-serif text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </motion.div>

            <button
              onClick={handlePlaceOrder}
              disabled={!selectedGov}
              className="w-full py-3.5 bg-foreground text-background rounded-xl font-sans text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Place Order
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;