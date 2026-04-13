import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { addDays, format, isSameDay, startOfToday } from 'date-fns';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import SyriaMap from '@/components/SyriaMap';
import DeliveryMap from '@/components/DeliveryMap';
import Footer from '@/components/Footer';
import { Governorate, LatLng } from '@/types';
import { formatPrice } from '@/data/products';
import { Check, Sparkles, Truck } from 'lucide-react';

const GIFT_WRAP_FEE = 10000;
const FREE_SHIPPING_THRESHOLD = 200000;

function isFastDeliveryDay(d: Date): boolean {
  const day = d.getDay();
  return day === 3 || day === 4 || day === 5;
}

const Checkout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const { items, subtotal, giftWrapping, clearCart } = useCartStore();
  const sub = subtotal();
  const [selectedGov, setSelectedGov] = useState<Governorate | null>(null);
  const [pin, setPin] = useState<LatLng | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/checkout&reason=member', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedGov) {
      setPin({ lat: selectedGov.lat, lng: selectedGov.lng });
      setDeliveryDate(null);
    } else {
      setPin(null);
    }
  }, [selectedGov]);

  const deliveryDays = useMemo(() => {
    const start = startOfToday();
    return Array.from({ length: 14 }, (_, i) => addDays(start, i + 1));
  }, []);

  const shippingFee = selectedGov
    ? sub >= FREE_SHIPPING_THRESHOLD
      ? 0
      : selectedGov.shippingFee
    : 0;
  const giftFee = giftWrapping ? GIFT_WRAP_FEE : 0;
  const total = sub + shippingFee + giftFee;

  const canPlaceOrder =
    Boolean(selectedGov && deliveryDate && pin && items.length > 0);

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) return;
    setOrderPlaced(true);
    clearCart();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-sm font-sans text-muted-foreground">
        Redirecting to sign in…
      </div>
    );
  }

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
            Thank you for your purchase. You&apos;ll receive a WhatsApp confirmation shortly
            {deliveryDate ? ` for ${format(deliveryDate, 'EEEE, MMM d')}` : ''}.
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
          className="font-serif text-3xl md:text-4xl text-center mb-4"
        >
          Checkout
        </motion.h1>
        {user && (
          <p className="text-center text-sm font-sans text-muted-foreground mb-10">
            Signed in as <span className="text-foreground font-medium">{user.name}</span> · {user.phone}
          </p>
        )}

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground font-sans">Your bag is empty.</p>
        ) : (
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="space-y-3"
            >
              <h2 className="font-sans text-xs tracking-widest uppercase mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border/50">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              <h2 className="font-sans text-xs tracking-widest uppercase mb-4">Delivery area</h2>
              <SyriaMap onSelect={setSelectedGov} selected={selectedGov} />
            </motion.div>

            {selectedGov && pin && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h2 className="font-sans text-xs tracking-widest uppercase flex items-center gap-2">
                  <Truck size={14} />
                  Pin your location
                </h2>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                  Move the pin to your building entrance so our driver can find you precisely.
                </p>
                <DeliveryMap
                  mapKey={selectedGov.id}
                  center={{ lat: selectedGov.lat, lng: selectedGov.lng }}
                  marker={pin}
                  onMarkerDragEnd={setPin}
                />
                <p className="text-[11px] font-sans text-muted-foreground font-mono">
                  {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="space-y-4"
            >
              <h2 className="font-sans text-xs tracking-widest uppercase">Preferred delivery day</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {deliveryDays.map((d) => {
                  const selected = deliveryDate && isSameDay(d, deliveryDate);
                  const fast = isFastDeliveryDay(d);
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => setDeliveryDate(d)}
                      className={`relative rounded-xl border px-3 py-3 text-left transition-all ${
                        selected
                          ? 'border-foreground bg-card shadow-md'
                          : 'border-border bg-background/60 hover:border-foreground/30'
                      }`}
                    >
                      <span className="block font-serif text-sm">{format(d, 'EEE')}</span>
                      <span className="block text-xs font-sans text-muted-foreground">{format(d, 'MMM d')}</span>
                      {fast && (
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-sans tracking-wide uppercase bg-primary/40 text-foreground px-2 py-0.5 rounded-full">
                          <Sparkles size={10} />
                          Fast
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-border/70 rounded-2xl p-6 space-y-3 bg-card/40"
            >
              <h2 className="font-serif text-lg mb-2">Final summary</h2>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Items</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {giftWrapping && (
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">Gift wrapping</span>
                  <span>{formatPrice(GIFT_WRAP_FEE)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Shipping {selectedGov ? `(${selectedGov.name})` : ''}</span>
                <span>{selectedGov ? (shippingFee === 0 ? 'Free' : formatPrice(shippingFee)) : '—'}</span>
              </div>
              <div className="flex justify-between font-serif text-xl pt-4 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {deliveryDate && (
                <p className="text-xs font-sans text-muted-foreground pt-1">
                  Requested delivery: <span className="text-foreground">{format(deliveryDate, 'EEEE, MMMM d, yyyy')}</span>
                </p>
              )}
            </motion.div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder}
              className="w-full py-4 bg-foreground text-background rounded-2xl font-sans text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-40 shadow-xl"
            >
              Confirm order
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
