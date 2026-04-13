import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Home } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);
  const items = useCartStore((s) => s.items);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevItemCount = useRef(itemCount);

  // Bounce cart icon when items change
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Left nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-1.5">
            <Home size={14} />
            Home
          </Link>
          <Link to="/products?cat=makeup" className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity">
            Makeup
          </Link>
          <Link to="/products?cat=skincare" className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity">
            Skincare
          </Link>
        </div>

        {/* Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="font-serif text-primary-foreground text-xs font-bold tracking-wider">AC</span>
          </div>
          <span className="font-serif text-xs tracking-[0.3em] mt-0.5 hidden sm:block">ALMA</span>
        </Link>

        {/* Right nav */}
        <div className="flex items-center gap-4">
          <Link to="/products?cat=fragrance" className="hidden md:block text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity">
            Fragrance
          </Link>
          <Link to="/auth" className="hover:opacity-70 transition-opacity">
            <User size={20} />
          </Link>
          <motion.button
            onClick={openCart}
            className="relative hover:opacity-70 transition-opacity"
            animate={cartBounce ? {
              y: [0, -8, 0, -4, 0],
              rotate: [0, -10, 10, -5, 0],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-sans font-semibold"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/50 bg-background/60 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-4 py-6">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-1.5">
                <Home size={14} /> Home
              </Link>
              {['Makeup', 'Skincare', 'Fragrance'].map((cat) => (
                <Link
                  key={cat}
                  to={`/products?cat=${cat.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-sans tracking-widest uppercase hover:opacity-70 transition-opacity"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
