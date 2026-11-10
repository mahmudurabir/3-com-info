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

export interface CustomerRequest {
  id: string; // e.g. "ORD-3CI-4819", "REQ-1029", "REP-3CI-5182"
  type: 'order' | 'product_request' | 'repair_booking';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  title: string;
  details?: string;
  quantity?: number;
  totalPrice?: number;
  deliveryMethod?: 'pickup' | 'delivery';
  paymentMethod?: 'counter' | 'online';
  date: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  channel: 'web' | 'whatsapp' | 'email';
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
  | 'DELETE_ADMIN'
  | 'UPDATE_REPAIRS'
  | 'UPDATE_PRINT_PRICING'
  | 'UPDATE_MONEY_SETTINGS'
  | 'UPDATE_SLIDER'
  | 'UPDATE_STORE_SETTINGS'
  | 'RESET_SYSTEM';

export interface RepairServiceTariff {
  id: string;
  name: string; // e.g. "Remplacement d'écran / vitre OLED"
  price: string; // e.g. "À partir de 49 €"
  numericPrice?: number;
  time: string; // e.g. "30 à 45 min"
  warranty: string; // e.g. "Garantie 6 mois"
  deviceType?: string; // e.g. "iPhone", "Samsung", "Tous"
  description?: string;
  active: boolean;
}

export interface PrintPricingSettings {
  bwA4: number; // e.g. 0.15
  bwA3: number; // e.g. 0.30
  colorA4: number; // e.g. 0.40
  colorA3: number; // e.g. 0.80
  laminationA4: number; // e.g. 2.00
  scanPerPage: number; // e.g. 0.30
  faxPerPage: number; // e.g. 1.50
  internetHourlyRate: number; // e.g. 2.50
  bindingPerPage?: number; // e.g. 3.00
}

export interface MoneyTransferPartner {
  id: string;
  name: string; // e.g. "Western Union", "Ria", "MoneyGram"
  feeFrom: string; // e.g. "À partir de 1,90 €"
  speed: string; // e.g. "Instantané"
  description: string;
  active: boolean;
}

export interface ServiceSlideItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  tag: string;
  description: string;
  highlights: string[];
  image: string;
  actionText: string;
  actionTab: ActiveTab;
}

export interface StoreSettings {
  storeName: string;
  streetAddress: string;
  cityZip: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  announcementBanner: string;
  announcementActive: boolean;
  warrantyInfo: string;
  transitInfo: string;
}

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
    id: 'admin-safayet',
    username: 'safayetsharif5',
    name: 'Safayet Sharif',
    email: 'safayetsharif5@gmail.com',
    role: 'Super Admin',
    password: 'admin3communes',
    avatarColor: '#1e3a24',
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

