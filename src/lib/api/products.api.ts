import { Product } from '@/types';
import { useCatalogStore } from '@/store/catalogStore';

/** Replace bodies with fetch('/api/products', ...) when connecting Express */
export const productsApi = {
  async list(): Promise<Product[]> {
    return Promise.resolve(useCatalogStore.getState().products);
  },

  async getById(id: string): Promise<Product | undefined> {
    return Promise.resolve(useCatalogStore.getState().products.find((p) => p.id === id));
  },

  async create(payload: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    return Promise.resolve(useCatalogStore.getState().addProduct(payload));
  },

  async update(id: string, patch: Partial<Product>): Promise<void> {
    useCatalogStore.getState().updateProduct(id, patch);
    return Promise.resolve();
  },

  async remove(id: string): Promise<void> {
    useCatalogStore.getState().deleteProduct(id);
    return Promise.resolve();
  },
};
