import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Index = () => {
  const featured = products.filter((p) => p.tags?.includes('bestseller'));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl">Bestsellers</h2>
          <p className="text-muted-foreground font-sans mt-3 text-sm">Our most loved products</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onOpenDetail={setSelectedProduct} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/products"
            className="inline-block px-8 py-3 border border-foreground rounded-full font-sans text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all"
          >
            View All
          </Link>
        </motion.div>
      </section>

      {/* Brand story section */}
      <section className="bg-card/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"
                alt="Luxury cosmetics"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl leading-snug">
              Rooted in
              <br />
              <em className="italic">Damascus</em>
            </h2>
            <p className="text-muted-foreground font-sans mt-6 leading-relaxed text-sm md:text-base">
              Alma Cosmetics draws from centuries of beauty traditions.
              Our ingredients are sourced from the fertile lands of Syria —
              Damascus roses, Aleppo olive oil, and aromatic oud —
              reimagined for the modern woman.
            </p>
            <Link
              to="/products"
              className="inline-block mt-8 font-sans text-sm tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
            >
              Discover More
            </Link>
          </motion.div>
        </div>
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </div>
  );
};

export default Index;
