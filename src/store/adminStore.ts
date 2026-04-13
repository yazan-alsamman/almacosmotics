import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { getStoredLocale, translate } from '@/i18n/translations';
import { Order, RegisteredUser } from '@/types';

interface AdminState {
  orders: Order[];
  users: RegisteredUser[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  upsertUser: (user: Pick<RegisteredUser, 'id' | 'name' | 'phone' | 'isVerified'>) => void;
}

const seedUsers: RegisteredUser[] = [
  {
    id: 'u-demo-1',
    name: 'Layla Karim',
    phone: '+963933000000',
    isVerified: true,
    registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    orderIds: [],
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      orders: [],
      users: seedUsers,

      addOrder: (order) => {
        const phone = order.customer.phone;
        set((s) => {
          const idx = s.users.findIndex((u) => u.phone === phone);
          let users = [...s.users];
          if (idx >= 0) {
            const oids = new Set([...users[idx].orderIds, order.id]);
            users[idx] = { ...users[idx], orderIds: [...oids], name: order.customer.name || users[idx].name };
          } else {
            users = [
              ...users,
              {
                id: `u-${order.id}`,
                name: order.customer.name,
                phone,
                isVerified: true,
                registeredAt: new Date().toISOString(),
                orderIds: [order.id],
              },
            ];
          }
          return { orders: [order, ...s.orders], users };
        });
      },

      updateOrderStatus: (orderId, status) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
        toast.message(translate(getStoredLocale(), 'toasts.orderUpdated'), {
          description: `${orderId} → ${status}`,
        });
      },

      upsertUser: (user) => {
        const existing = get().users.find((u) => u.phone === user.phone);
        if (existing) {
          set((s) => ({
            users: s.users.map((u) =>
              u.phone === user.phone ? { ...u, name: user.name, isVerified: user.isVerified } : u
            ),
          }));
          return;
        }
        const nu: RegisteredUser = {
          ...user,
          registeredAt: new Date().toISOString(),
          orderIds: [],
        };
        set((s) => ({ users: [...s.users, nu] }));
      },
    }),
    { name: 'alma-admin' }
  )
);
