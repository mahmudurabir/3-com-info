import { AuditLogEntry } from '../types';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-init-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    formattedTime: new Date(Date.now() - 1000 * 60 * 18).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    adminId: 'admin-1',
    adminUsername: 'admin',
    adminName: 'Direction Boutique',
    adminRole: 'Super Admin',
    action: 'UPDATE_PRODUCT',
    summary: 'Mise à jour du stock pour Apple iPhone 15 / 128 Go',
    details: 'Stock actualisé à 6 unités • Prix confirmé à 799,00 €',
    targetItemName: 'Apple iPhone 15 / 128 Go'
  },
  {
    id: 'audit-init-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    formattedTime: new Date(Date.now() - 1000 * 60 * 45).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    adminId: 'admin-2',
    adminUsername: 'manager',
    adminName: 'Marc Lefebvre',
    adminRole: 'Store Manager',
    action: 'ADD_PRODUCT',
    summary: 'Ajout de la référence "Enceinte Bluetooth portable"',
    details: 'Rayon : Audio et accessoires connectés • Prix : 39,00 € • Stock initial : 12 unités',
    targetItemName: 'Enceinte Bluetooth portable'
  },
  {
    id: 'audit-init-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    formattedTime: new Date(Date.now() - 1000 * 60 * 90).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    adminId: 'admin-2',
    adminUsername: 'manager',
    adminName: 'Marc Lefebvre',
    adminRole: 'Store Manager',
    action: 'LOGIN',
    summary: 'Connexion administrateur depuis le poste comptoir (Romainville)',
    details: 'Authentification validée avec le rôle Responsable Boutique.'
  },
  {
    id: 'audit-init-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    formattedTime: new Date(Date.now() - 1000 * 60 * 180).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    adminId: 'admin-3',
    adminUsername: 'staff',
    adminName: 'Saïd - Atelier SAV',
    adminRole: 'Staff',
    action: 'UPDATE_PRODUCT',
    summary: 'Réapprovisionnement : Chargeur USB-C 45–65 W',
    details: 'Ajout de 15 unités en stock (Total en rayon : 25)',
    targetItemName: 'Chargeur USB-C 45–65 W'
  },
  {
    id: 'audit-init-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    formattedTime: new Date(Date.now() - 1000 * 60 * 240).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    adminId: 'admin-1',
    adminUsername: 'admin',
    adminName: 'Direction Boutique',
    adminRole: 'Super Admin',
    action: 'LOGIN',
    summary: 'Ouverture de session sur le portail de gestion 3 Communes',
    details: 'Session sécurisée initialisée avec succès.'
  }
];
