export type ProductCategory = string;

export const DEFAULT_CATEGORIES: string[] = [
  'Téléphones mobiles',
  'Coques & Protections',
  'Chargeurs & Câbles',
  'Audio & Connecté',
  'Informatique & PC',
  'Réparation & Outils',
  'Articles du quotidien',
  'Impression & Bureautique'
];

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number; // in Euros €
  originalPrice?: number;
  stock: number;
  image: string;
  images?: string[]; // Multiple high-resolution photos for gallery
  description: string;
  longDescription?: string; // Broad description with full details
  specs: string[];
  features?: string[];
  boxIncludes?: string[];
  condition?: string;
  featured?: boolean;
  warranty: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderConfirmation {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'counter' | 'online';
  orderDate: string;
  notes?: string;
}

export type ActiveTab = 'home' | 'money' | 'accessories' | 'services' | 'repairs' | 'print';

export type AdminRole = 'Super Admin' | 'Store Manager' | 'Staff';

export interface AdminAccount {
  id: string;
  username: string; // e.g. "admin", "manager", "staff"
  name: string; // e.g. "Owner / Super Admin"
  email: string;
  role: AdminRole;
  password: string;
  avatarColor: string;
  createdAt: string;
  lastLoginAt?: string;
  status: 'active' | 'suspended';
}

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'ADD_PRODUCT'
  | 'UPDATE_PRODUCT'
  | 'DELETE_PRODUCT'
  | 'RESET_PRODUCTS'
  | 'ADD_CATEGORY'
  | 'DELETE_CATEGORY'
  | 'CREATE_ADMIN'
  | 'UPDATE_ADMIN'
  | 'DELETE_ADMIN';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO string
  formattedTime: string; // formatted date & time
  adminId: string;
  adminUsername: string;
  adminName: string;
  adminRole: AdminRole;
  action: AuditActionType;
  summary: string;
  details?: string;
  targetItemName?: string;
}

export const INITIAL_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'admin-1',
    username: 'admin',
    name: 'Direction Boutique',
    email: '3communesinfo@gmail.com',
    role: 'Super Admin',
    password: 'admin3communes',
    avatarColor: '#3f704d',
    createdAt: '2026-01-01T08:00:00.000Z',
    status: 'active'
  },
  {
    id: 'admin-2',
    username: 'manager',
    name: 'Marc Lefebvre',
    email: 'manager@3communes.fr',
    role: 'Store Manager',
    password: 'manager3communes',
    avatarColor: '#2563eb',
    createdAt: '2026-02-15T09:30:00.000Z',
    status: 'active'
  },
  {
    id: 'admin-3',
    username: 'staff',
    name: 'Saïd - Atelier SAV',
    email: 'tech@3communes.fr',
    role: 'Staff',
    password: 'staff3communes',
    avatarColor: '#d97706',
    createdAt: '2026-03-10T11:15:00.000Z',
    status: 'active'
  }
];

