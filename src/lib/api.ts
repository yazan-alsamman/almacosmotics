/**
 * API service layer — structured for future Node.js/Express backend integration.
 * Currently returns mock data. Replace BASE_URL and remove mocks when backend is ready.
 */

import { products } from '@/data/products';
import { Product, Order, User } from '@/types';

const BASE_URL = '/api'; // Future: 'https://api.almacosmetics.com'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const headers = {
  'Content-Type': 'application/json',
};

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      // Future: return fetch(`${BASE_URL}/products`).then(r => r.json());
      return Promise.resolve(products);
    },
    getById: async (id: string): Promise<Product | undefined> => {
      return Promise.resolve(products.find(p => p.id === id));
    },
    getByCategory: async (category: string): Promise<Product[]> => {
      return Promise.resolve(products.filter(p => p.category === category));
    },
  },

  orders: {
    create: async (order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
      // Future: return fetch(`${BASE_URL}/orders`, { method: 'POST', headers, body: JSON.stringify(order) }).then(r => r.json());
      return Promise.resolve({
        ...order,
        id: `ORD-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    },
  },

  auth: {
    sendOTP: async (phone: string): Promise<{ success: boolean }> => {
      console.log(`[Mock] Sending OTP to ${phone}`);
      return Promise.resolve({ success: true });
    },
    verifyOTP: async (phone: string, otp: string): Promise<{ user: User; token: string }> => {
      console.log(`[Mock] Verifying OTP ${otp} for ${phone}`);
      return Promise.resolve({
        user: { id: '1', name: '', phone, isVerified: true },
        token: 'mock-jwt-token',
      });
    },
  },
};