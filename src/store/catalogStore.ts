import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { getStoredLocale, translate } from '@/i18n/translations';
import { Product } from '@/types';
import { seedProducts } from '@/data/products';
import { useStockStore } from './stockStore';

function nextId(products: Product[]): string {
  const max = products.reduce((m, p) => Math.max(m, parseInt(p.id, 10) || 0), 0);
  return String(max + 1);
}

interface CatalogState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: seedProducts,

      setProducts: (products) => set({ products }),

      addProduct: (input: Omit<Product, 'id'> & { id?: string }) => {
        const id = input.id ?? nextId(get().products);
        const gallery = input.gallery?.length ? input.gallery : [input.image].filter(Boolean);
        const image = input.image || gallery[0] || '';
        const product: Product = {
          id,
          name: input.name,
          nameAr: input.nameAr,
          description: input.description,
          howToUse: input.howToUse,
          ingredients: input.ingredients,
          image,
          gallery: gallery.length ? gallery : [image],
          price: input.price,
          category: input.category,
          rating: input.rating ?? 4.8,
          inStock: input.inStock ?? true,
          tags: input.tags,
        };
        set((s) => ({ products: [...s.products, product] }));
        useStockStore.getState().setInitialStock(id, 10);
        toast.success(translate(getStoredLocale(), 'toasts.productCreated'), { description: product.name });
        return product;
      },

      updateProduct: (id, patch) => {
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
        toast.message(translate(getStoredLocale(), 'toasts.productUpdated'), { description: patch.name ?? id });
      },

      deleteProduct: (id) => {
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
        useStockStore.getState().removeProduct(id);
        toast.message(translate(getStoredLocale(), 'toasts.productRemoved'), { description: id });
      },
    }),
    { name: 'alma-catalog' }
  )
);

export function getProductById(id: string): Product | undefined {
  return useCatalogStore.getState().products.find((p) => p.id === id);
}

export function getCatalogSnapshot(): Product[] {
  return useCatalogStore.getState().products;
}
