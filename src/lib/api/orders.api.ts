import { Order } from '@/types';
import { useAdminStore } from '@/store/adminStore';

export const ordersApi = {
  async list(): Promise<Order[]> {
    return Promise.resolve(useAdminStore.getState().orders);
  },

  async updateStatus(orderId: string, status: Order['status']): Promise<void> {
    useAdminStore.getState().updateOrderStatus(orderId, status);
    return Promise.resolve();
  },
};
