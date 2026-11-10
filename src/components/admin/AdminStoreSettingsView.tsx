import React, { useState } from 'react';
import { StoreSettings, AdminRole } from '../../types';
import { Store, Phone, Mail, MapPin, Clock, Bell, Shield, Save, RotateCcw, Check, MessageSquare } from 'lucide-react';
import { WhatsAppIcon } from '../WhatsAppIcon';

interface AdminStoreSettingsViewProps {
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  onResetSettings: () => void;
  adminRole: AdminRole;
  showFeedback: (msg: string) => void;
  logAuditAction: (action: string, summary: string, details?: string) => void;
}

export const AdminStoreSettingsView: React.FC<AdminStoreSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  adminRole,
  showFeedback,
  logAuditAction
}) => {
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    setForm({ ...settings });
    setHasChanges(false);
  }, [settings]);

  const canEdit = adminRole === 'Super Admin' || adminRole === 'Store Manager';

  const handleChange = (key: keyof StoreSettings, val: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: val
    }));
    setHasChanges(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setHasChanges(false);
    showFeedback('Coordonnées & paramètres de la boutique enregistrés avec succès !');
    logAuditAction(
      'UPDATE_STORE_SETTINGS',
      'Mise à jour des coordonnées et paramètres généraux de la boutique',
      `Tél: ${form.phone} • WhatsApp: ${form.whatsapp} • Email: ${form.email}`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-base text-gray-900">
              Paramètres Généraux, Coordonnées & Bandeau d'Annonce
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl">
            Modifiez les coordonnées officielles de 3 Communes Informatique (téléphone, WhatsApp, e-mail, adresse, horaires d'ouverture) ainsi que le bandeau d'annonces diffusé en haut du site.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              if (confirm('Rétablir les coordonnées et paramètres par défaut de la boutique ?')) {
                onResetSettings();
                showFeedback('Paramètres boutique réinitialisés');
                logAuditAction('RESET_SYSTEM', 'Réinitialisation des coordonnées boutique par défaut');
              }
            }}
            title="Rétablir paramètres par défaut"
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Paramètres par défaut</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Contact Info Grid */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-2xs">
          <h4 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>Coordonnées de Contact & Accès Client</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nom de l'établissement</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Téléphone direct boutique</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d] font-bold text-emerald-950"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Numéro WhatsApp officiel</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d] font-bold text-emerald-950"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Adresse E-mail officielle</label>
              <input
                type="email"
                disabled={!canEdit}
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Adresse de la boutique</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.streetAddress}
                onChange={(e) => handleChange('streetAddress', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Code Postal, Ville & Pays</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.cityZip}
                onChange={(e) => handleChange('cityZip', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Horaires d'ouverture</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Accès transports & stationnement</label>
              <input
                type="text"
                disabled={!canEdit}
                value={form.transitInfo}
                onChange={(e) => handleChange('transitInfo', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner Section */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h4 className="font-bold text-sm text-gray-900 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-emerald-700" />
              <span>Bandeau d'Annonce en Tête de Site</span>
            </h4>

            <label className="flex items-center space-x-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={form.announcementActive}
                disabled={!canEdit}
                onChange={(e) => handleChange('announcementActive', e.target.checked)}
                className="w-4 h-4 text-[#3f704d] rounded border-gray-300 focus:ring-[#3f704d]"
              />
              <span className="font-semibold text-gray-700">Activer le bandeau d'alerte</span>
            </label>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block font-bold text-gray-700">
              Message d'annonce diffusé aux visiteurs
            </label>
            <input
              type="text"
              disabled={!canEdit}
              placeholder="Ex: Ouvert 7j/7 sans interruption • Arrivage régulier de téléphones & accessoires..."
              value={form.announcementBanner}
              onChange={(e) => handleChange('announcementBanner', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
            />
            {form.announcementActive && (
              <div className="p-3 bg-emerald-100/70 text-emerald-950 rounded-xl border border-emerald-300 text-xs flex items-center space-x-2">
                <span className="font-bold text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-full uppercase">
                  Aperçu
                </span>
                <span className="font-medium truncate">{form.announcementBanner}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Bar */}
        {canEdit && (
          <div className="flex items-center justify-between pt-2">
            <div>
              {hasChanges && (
                <span className="text-xs text-amber-700 font-semibold animate-pulse">
                  Modifications non enregistrées
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!hasChanges}
              className="bg-[#3f704d] hover:bg-[#335c3f] disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer tous les paramètres boutique</span>
            </button>
          </div>
        )}

      </form>

    </div>
  );
};
