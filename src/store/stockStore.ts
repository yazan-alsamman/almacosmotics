import { create } from 'zustand';
import { seedProducts } from '@/data/products';

interface StockStore {
  stock: Record<string, number>;
  getStock: (productId: string) => number;
  decrementStock: (productId: string, quantity?: number) => void;
  incrementStock: (productId: string, quantity?: number) => void;
  setInitialStock: (productId: string, quantity: number) => void;
  removeProduct: (productId: string) => void;
}

const defaultStock: Record<string, number> = {
  '1': 9,
  '2': 4,
  '3': 12,
  '4': 6,
  '5': 15,
  '6': 7,
  '7': 3,
  '8': 11,
};

const initialStock: Record<string, number> = {};
seedProducts.forEach((p) => {
  initialStock[p.id] = defaultStock[p.id] ?? 10;
});

export const useStockStore = create<StockStore>((set, get) => ({
  stock: initialStock,
  getStock: (productId) => get().stock[productId] ?? 0,
  decrementStock: (productId, quantity = 1) =>
    set((state) => ({
      stock: {
        ...state.stock,
        [productId]: Math.max(0, (state.stock[productId] ?? 0) - quantity),
      },
    })),
  incrementStock: (productId, quantity = 1) =>
    set((state) => ({
      stock: {
        ...state.stock,
        [productId]: (state.stock[productId] ?? 0) + quantity,
      },
    })),
  setInitialStock: (productId, quantity) =>
    set((state) => ({
      stock: { ...state.stock, [productId]: quantity },
    })),
  removeProduct: (productId) =>
    set((state) => {
      const { [productId]: _, ...rest } = state.stock;
      return { stock: rest };
    }),
}));
