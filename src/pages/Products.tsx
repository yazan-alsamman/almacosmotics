import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useCatalogStore } from '@/store/catalogStore';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'makeup', label: 'Makeup' },
  { key: 'skincare', label: 'Skincare' },
  { key: 'fragrance', label: 'Fragrance' },
];

const Products = () => {
  const catalog = useCatalogStore((s) => s.products);
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);

  const filtered = useMemo(
    () => (activeCategory === 'all' ? catalog : catalog.filter((p) => p.category === activeCategory)),
    [activeCategory, catalog]
  );

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl">Collection</h1>
          <p className="text-muted-foreground font-sans mt-3 text-sm">Luxury beauty essentials</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2 rounded-full text-xs font-sans tracking-widest uppercase transition-all border ${
                activeCategory === cat.key
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background/50 backdrop-blur-sm text-foreground border-border/50 hover:bg-foreground/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
