import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { governorates } from '@/data/products';
import { Governorate } from '@/types';
import { MapPin, ChevronDown } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { useLanguage } from '@/i18n/LanguageContext';

interface SyriaMapProps {
  onSelect: (gov: Governorate) => void;
  selected?: Governorate | null;
}

const SyriaMap = ({ onSelect, selected }: SyriaMapProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale } = useLanguage();

  const govPrimary = (g: Governorate) => (locale === 'ar' ? g.nameAr : g.name);

  return (
    <div className="space-y-4">
      <label className="text-sm font-sans text-muted-foreground">{t('syriaMap.label')}</label>
      
      {/* Styled dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-foreground/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin size={18} />
            <span className="font-sans text-sm">
              {selected ? `${govPrimary(selected)} — ${locale === 'ar' ? selected.name : selected.nameAr}` : t('syriaMap.selectPlaceholder')}
            </span>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="absolute z-20 w-full mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden"
            >
              <div className="max-h-64 overflow-y-auto">
                {governorates.map((gov) => (
                  <button
                    key={gov.id}
                    onClick={() => {
                      onSelect(gov);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 hover:bg-card transition-colors text-left ${
                      selected?.id === gov.id ? 'bg-card' : ''
                    }`}
                  >
                    <div>
                      <span className="text-sm font-sans">{govPrimary(gov)}</span>
                      <span className="text-xs text-muted-foreground ms-2">{locale === 'ar' ? gov.name : gov.nameAr}</span>
                    </div>
                    <span className="text-xs font-sans text-muted-foreground">{formatPrice(gov.shippingFee)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual map representation */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-sm">{govPrimary(selected)}</p>
              <p className="text-xs text-muted-foreground font-sans mt-0.5">{t('syriaMap.estDelivery')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-sans">{t('syriaMap.shippingFee')}</p>
              <p className="font-serif text-sm">{formatPrice(selected.shippingFee)}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SyriaMap;