import { CustomerRequest } from '../types';

export const INITIAL_CUSTOMER_REQUESTS: CustomerRequest[] = [
  {
    id: 'ORD-3CI-4819',
    type: 'order',
    customerName: 'Karim Benali',
    customerPhone: '06 12 34 56 78',
    customerEmail: 'k.benali@gmail.com',
    title: 'iPhone 15 Pro Max 256GB - Titane Naturel',
    details: 'Retrait direct au magasin de Romainville avec pose de verre trempé 9H offerte demandée.',
    quantity: 1,
    totalPrice: 1199,
    deliveryMethod: 'pickup',
    paymentMethod: 'counter',
    date: 'Aujourd\'hui à 11:20',
    status: 'new',
    channel: 'web'
  },
  {
    id: 'DEM-918234',
    type: 'product_request',
    customerName: 'Fatou Diallo',
    customerPhone: '07 58 11 22 33',
    customerEmail: 'fatou.diallo@outlook.fr',
    title: 'Chargeur sans fil magnétique 3-en-1 pour iPhone & Apple Watch',
    details: 'Cherche un modèle pliable compact couleur noire ou blanche.',
    date: 'Aujourd\'hui à 09:45',
    status: 'contacted',
    channel: 'whatsapp'
  },
  {
    id: 'REP-3CI-5182',
    type: 'repair_booking',
    customerName: 'Thomas Leroy',
    customerPhone: '06 88 99 00 11',
    customerEmail: 'thomas.leroy93@yahoo.fr',
    title: 'Samsung Galaxy S22 Ultra - Écran cassé',
    details: 'Écran OLED scintille suite à une chute. Devis 30 minutes sans rdv.',
    totalPrice: 139,
    date: 'Hier à 16:30',
    status: 'completed',
    channel: 'web'
  }
];
