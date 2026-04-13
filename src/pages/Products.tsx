import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { Product } from '@/types';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'makeup', label: 'Makeup' },
  { key: 'skincare', label: 'Skincare' },
  { key: 'fragrance', label: 'Fragrance' },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(
    () => (activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)),
    [activeCategory]
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

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
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

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onOpenDetail={setSelectedProduct} />
          ))}
        </motion.div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </div>
  );
};

export default Products;
