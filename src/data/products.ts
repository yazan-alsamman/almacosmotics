import { Product, Governorate } from '@/types';

const g = (main: string, ...extra: string[]) => [main, ...extra];

export const seedProducts: Product[] = [
  {
    id: '1',
    name: 'Rose Petal Blush',
    description:
      'A silky, buildable blush infused with Damascus rose extract for a natural, radiant glow. Layers beautifully from a soft wash to a sculpted contour.',
    howToUse:
      'Swirl a fluffy brush into the pan, tap off excess, and sweep onto the apples of the cheeks. Blend upward toward the temples. Build gradually for deeper color.',
    ingredients:
      'Talc, Mica, Damascus Rose Extract, Jojoba Oil, Vitamin E, Iron Oxides, Fragrance (allergen-tested).',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'
    ),
    category: 'makeup',
    rating: 4.8,
    inStock: true,
    tags: ['bestseller'],
  },
  {
    id: '2',
    name: 'Velvet Matte Lipstick',
    description:
      'Long-lasting matte lipstick with a velvety texture. Enriched with vitamin E for comfortable all-day wear without feathering.',
    howToUse:
      'Outline lips with the edge of the bullet, then fill in from center to corners. Blot once and reapply a thin layer for extended wear.',
    ingredients:
      'Dimethicone, Kaolin, Vitamin E, Shea Butter, Pigments (CI 77491, CI 77891), Vanilla Planifolia Fruit Extract.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
      'https://images.unsplash.com/photo-1560869713-7d0a29430804?w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ),
    category: 'makeup',
    rating: 4.9,
    inStock: true,
    tags: ['new'],
  },
  {
    id: '3',
    name: 'Luminous Foundation',
    description:
      'Medium-to-full coverage foundation with a luminous, dewy finish. Blurs imperfections while letting skin breathe.',
    howToUse:
      'Shake well. Apply with damp sponge or brush in thin layers, building where needed. Set lightly with powder in the T-zone if desired.',
    ingredients:
      'Aqua, Cyclopentasiloxane, Glycerin, Hyaluronic Acid, Titanium Dioxide, Iron Oxides, Phenoxyethanol.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&q=80',
      'https://images.unsplash.com/photo-1512201078372-9c6b2a4d07a0?w=800&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
    ),
    category: 'makeup',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '4',
    name: 'Midnight Jasmine Serum',
    description:
      'Overnight repair serum with jasmine and hyaluronic acid for supple, glowing skin by morning.',
    howToUse:
      'After cleansing, apply 2–3 drops to face and neck. Press gently until absorbed. Follow with moisturizer. Use nightly.',
    ingredients:
      'Aqua, Jasmine Flower Extract, Sodium Hyaluronate, Niacinamide, Panthenol, Squalane, Preservative.',
    price: 72000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80'
    ),
    category: 'skincare',
    rating: 4.9,
    inStock: true,
    tags: ['bestseller'],
  },
  {
    id: '5',
    name: 'Aleppo Soap Cleanser',
    description:
      'Traditional Aleppo laurel soap reimagined as a luxurious foaming cleanser for gentle daily purification.',
    howToUse:
      'Lather with warm water, massage onto damp skin in circular motions, then rinse thoroughly. Pat dry.',
    ingredients:
      'Olive Oil, Laurel Berry Oil, Aqua, Sodium Hydroxide (saponified), Glycerin (naturally retained).',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80',
      'https://images.unsplash.com/photo-1570194065650-0db8d5d0b2e0?w=800&q=80'
    ),
    category: 'skincare',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '6',
    name: 'Damascus Rose Moisturizer',
    description:
      'Rich, hydrating cream with organic Damascus rose water and shea butter for plump, comforted skin.',
    howToUse:
      'Apply to clean skin morning and night. Warm between palms and press gently upward from jawline to forehead.',
    ingredients:
      'Rose Damascena Flower Water, Butyrospermum Parkii Seed Butter, Aqua, Caprylic/Capric Triglyceride, Glycerin, Tocopherol.',
    price: 62000,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
    ),
    category: 'skincare',
    rating: 4.8,
    inStock: true,
    tags: ['new'],
  },
  {
    id: '7',
    name: 'Oud & Amber Parfum',
    description:
      'An intoxicating blend of Syrian oud, amber, and vanilla. A true luxury fragrance for evening wear.',
    howToUse:
      'Spray on pulse points—wrists, neck, and décolleté—from a distance of 15–20 cm. Layer sparingly; a little goes far.',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Amber Resin, Oud Wood, Vanilla Absolute, Benzyl Benzoate, Benzyl Salicylate.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea081ac45b0?w=800&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
    ),
    category: 'fragrance',
    rating: 5.0,
    inStock: true,
    tags: ['bestseller'],
  },
  {
    id: '8',
    name: 'Citrus & Cedarwood',
    description:
      'A fresh, uplifting scent combining Mediterranean citrus with warm cedarwood.',
    howToUse:
      'Mist lightly on skin or clothing. Refresh midday as needed. Avoid rubbing wrists together after application.',
    ingredients:
      'Alcohol Denat., Parfum (Fragrance), Citrus Grandis Peel Oil, Cedarwood Oil, Limonene, Linalool, Citral.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1594035910387-fea081ac45b0?w=800&q=80',
    gallery: g(
      'https://images.unsplash.com/photo-1594035910387-fea081ac45b0?w=800&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80'
    ),
    category: 'fragrance',
    rating: 4.7,
    inStock: true,
  },
];

export const governorates: Governorate[] = [
  { id: 'damascus', name: 'Damascus', nameAr: 'دمشق', shippingFee: 15000, lat: 33.5138, lng: 36.2765 },
  { id: 'rif-damascus', name: 'Rif Dimashq', nameAr: 'ريف دمشق', shippingFee: 18000, lat: 33.5, lng: 36.3 },
  { id: 'aleppo', name: 'Aleppo', nameAr: 'حلب', shippingFee: 25000, lat: 36.2021, lng: 37.1343 },
  { id: 'homs', name: 'Homs', nameAr: 'حمص', shippingFee: 20000, lat: 34.7324, lng: 36.7137 },
  { id: 'hama', name: 'Hama', nameAr: 'حماة', shippingFee: 22000, lat: 35.1318, lng: 36.7518 },
  { id: 'latakia', name: 'Latakia', nameAr: 'اللاذقية', shippingFee: 22000, lat: 35.5317, lng: 35.7918 },
  { id: 'tartus', name: 'Tartus', nameAr: 'طرطوس', shippingFee: 22000, lat: 34.8959, lng: 35.8867 },
  { id: 'deir-ez-zor', name: 'Deir ez-Zor', nameAr: 'دير الزور', shippingFee: 30000, lat: 35.336, lng: 40.145 },
  { id: 'hasakah', name: 'Al-Hasakah', nameAr: 'الحسكة', shippingFee: 30000, lat: 36.502, lng: 40.744 },
  { id: 'raqqa', name: 'Raqqa', nameAr: 'الرقة', shippingFee: 30000, lat: 35.952, lng: 39.01 },
  { id: 'daraa', name: "Daraa", nameAr: 'درعا', shippingFee: 20000, lat: 32.625, lng: 36.106 },
  { id: 'suwayda', name: 'As-Suwayda', nameAr: 'السويداء', shippingFee: 22000, lat: 32.713, lng: 36.566 },
  { id: 'idlib', name: 'Idlib', nameAr: 'إدلب', shippingFee: 30000, lat: 35.931, lng: 36.634 },
  { id: 'quneitra', name: 'Quneitra', nameAr: 'القنيطرة', shippingFee: 25000, lat: 33.126, lng: 35.824 },
];

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} SYP`;
};
