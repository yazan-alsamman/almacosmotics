import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-serif text-primary-foreground text-xs font-bold tracking-wider">AC</span>
              </div>
              <div>
                <h3 className="font-serif text-lg leading-none">Alma</h3>
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Cosmetics</span>
              </div>
            </div>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              Luxury beauty inspired by the timeless elegance of Syria. Crafted with nature's finest ingredients.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2.5 text-sm font-sans text-muted-foreground">
              <li><Link to="/products?cat=makeup" className="hover:text-foreground transition-colors">Makeup</Link></li>
              <li><Link to="/products?cat=skincare" className="hover:text-foreground transition-colors">Skincare</Link></li>
              <li><Link to="/products?cat=fragrance" className="hover:text-foreground transition-colors">Fragrance</Link></li>
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-foreground">Help</h4>
            <ul className="space-y-2.5 text-sm font-sans text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Shipping & Delivery</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Returns & Exchanges</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-foreground">Connect</h4>
            <ul className="space-y-2.5 text-sm font-sans text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Instagram</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">WhatsApp</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Facebook</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-muted-foreground">
            © 2026 Alma Cosmetics. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-sans text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
