import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
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
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{t('footer.cosmetics')}</span>
              </div>
            </div>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-foreground">{t('footer.shop')}</h4>
            <ul className="space-y-2.5 text-sm font-sans text-muted-foreground">
              <li><Link to="/products?cat=makeup" className="hover:text-foreground transition-colors">{t('nav.makeup')}</Link></li>
              <li><Link to="/products?cat=skincare" className="hover:text-foreground transition-colors">{t('nav.skincare')}</Link></li>
              <li><Link to="/products?cat=fragrance" className="hover:text-foreground transition-colors">{t('nav.fragrance')}</Link></li>
              <li><Link to="/products" className="hover:text-foreground transition-colors">{t('footer.allProducts')}</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-foreground">{t('footer.help')}</h4>
            <ul className="space-y-2.5 text-sm font-sans text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">{t('footer.shippingDelivery')}</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">{t('footer.returns')}</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">{t('footer.contact')}</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">{t('footer.faq')}</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-foreground">{t('footer.connect')}</h4>
            <ul className="space-y-2.5 text-sm font-sans text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">{t('footer.instagram')}</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">{t('footer.whatsapp')}</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">{t('footer.facebook')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-xs font-sans text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">{t('footer.privacy')}</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{t('footer.terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
