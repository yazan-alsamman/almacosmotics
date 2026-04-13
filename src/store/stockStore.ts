import { create } from 'zustand';
import { products } from '@/data/products';

interface StockStore {
  stock: Record<string, number>;
  getStock: (productId: string) => number;
  decrementStock: (productId: string) => void;
}

const initialStock: Record<string, number> = {};
products.forEach((p) => {
  // Simulate varied stock levels for urgency
  initialStock[p.id] = Math.floor(Math.random() * 12) + 2;
});

export const useStockStore = create<StockStore>((set, get) => ({
  stock: initialStock,
  getStock: (productId) => get().stock[productId] ?? 0,
  decrementStock: (productId) =>
    set((state) => ({
      stock: {
        ...state.stock,
        [productId]: Math.max(0, (state.stock[productId] ?? 0) - 1),
      },
    })),
}));
