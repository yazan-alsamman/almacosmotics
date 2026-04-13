export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  price: number;
  image: string;
  category: 'makeup' | 'skincare' | 'fragrance';
  rating: number;
  inStock: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
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
  customer: CustomerInfo;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  governorate: string;
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