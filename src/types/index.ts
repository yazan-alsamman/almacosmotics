export interface LatLng {
  lat: number;
  lng: number;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  howToUse: string;
  ingredients: string;
  /** Primary hero image */
  image: string;
  /** Extra images for gallery (may include primary) */
  gallery: string[];
  price: number;
  category: 'makeup' | 'skincare' | 'fragrance';
  rating: number;
  inStock: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

/** Admin & storefront order workflow */
export type OrderWorkflowStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'shipped'
  | 'delivered';

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  governorate: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  giftWrapping: boolean;
  giftWrappingFee: number;
  total: number;
  governorate: string;
  governorateId?: string;
  customer: CustomerInfo;
  status: OrderWorkflowStatus;
  createdAt: string;
  /** ISO date for requested delivery */
  deliveryDate?: string;
  /** Pin from checkout map */
  location?: LatLng;
}

export interface Governorate {
  id: string;
  name: string;
  nameAr: string;
  shippingFee: number;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  isVerified: boolean;
}

/** Admin directory — WhatsApp OTP members */
export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  isVerified: boolean;
  registeredAt: string;
  /** Linked order IDs for history */
  orderIds: string[];
}
