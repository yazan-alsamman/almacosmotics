import { RegisteredUser } from '@/types';
import { useAdminStore } from '@/store/adminStore';

export const usersApi = {
  async list(): Promise<RegisteredUser[]> {
    return Promise.resolve(useAdminStore.getState().users);
  },
};
