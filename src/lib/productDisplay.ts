import type { Product } from '@/types';
import type { Locale } from '@/i18n/translations';

export function productDisplayName(product: Product, locale: Locale): string {
  if (locale === 'ar' && product.nameAr?.trim()) return product.nameAr;
  return product.name;
}
