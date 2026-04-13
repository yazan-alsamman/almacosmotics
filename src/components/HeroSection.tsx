import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-110 blur-[2px] opacity-30"
          poster="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=60"
        >
          <source
            src="https://videos.pexels.com/video-files/3753716/3753716-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Floating background blobs */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-primary/30 blur-3xl top-1/4 -left-20"
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/20 blur-3xl bottom-1/4 -right-20"
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="w-24 h-24 rounded-full bg-primary mx-auto mb-8 flex items-center justify-center">
            <span className="font-serif text-primary-foreground text-xl font-bold tracking-wider">AC</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl leading-tight tracking-tight"
        >
          Beauty
          <br />
          <em className="italic">Redefined</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-muted-foreground font-sans mt-6 text-base md:text-lg max-w-md mx-auto leading-relaxed"
        >
          Luxury cosmetics inspired by the timeless elegance of Damascus.
          Crafted with nature's finest ingredients.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link
            to="/products"
            className="shimmer-btn inline-block mt-8 px-8 py-3.5 bg-foreground text-background rounded-full font-sans text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
