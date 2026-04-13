import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { useStockStore } from './stockStore';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  giftWrapping: boolean;
  bagPulseKey: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleGiftWrapping: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  giftWrapping: false,
  bagPulseKey: 0,

  addItem: (product, quantity = 1) => {
    const qty = Math.max(1, Math.floor(quantity));
    const stock = useStockStore.getState().getStock(product.id);
    const existing = get().items.find((i) => i.product.id === product.id);
    const inCart = existing?.quantity ?? 0;
    const maxCanAdd = Math.max(0, stock);
    const toAdd = Math.min(qty, maxCanAdd);
    if (toAdd <= 0) return;

    useStockStore.getState().decrementStock(product.id, toAdd);

    set((state) => {
      const existingItem = state.items.find((i) => i.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + toAdd } : i
          ),
          isOpen: true,
          bagPulseKey: state.bagPulseKey + 1,
        };
      }
      return {
        items: [...state.items, { product, quantity: toAdd }],
        isOpen: true,
        bagPulseKey: state.bagPulseKey + 1,
      };
    });
  },

  removeItem: (productId) =>
    set((state) => {
      const item = state.items.find((i) => i.product.id === productId);
      if (item) {
        useStockStore.getState().incrementStock(productId, item.quantity);
      }
      return { items: state.items.filter((i) => i.product.id !== productId) };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return state;
      if (quantity <= 0) {
        useStockStore.getState().incrementStock(productId, item.quantity);
        return {
          items: state.items.filter((i) => i.product.id !== productId),
        };
      }
      const delta = quantity - item.quantity;
      if (delta > 0) {
        const available = useStockStore.getState().getStock(productId);
        const allowed = Math.min(delta, available);
        if (allowed <= 0) return state;
        useStockStore.getState().decrementStock(productId, allowed);
        const newQty = item.quantity + allowed;
        return {
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: newQty } : i
          ),
        };
      }
      if (delta < 0) {
        useStockStore.getState().incrementStock(productId, -delta);
        return {
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        };
      }
      return state;
    }),

  toggleGiftWrapping: () => set((state) => ({ giftWrapping: !state.giftWrapping })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ items: [], giftWrapping: false }),

  subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
