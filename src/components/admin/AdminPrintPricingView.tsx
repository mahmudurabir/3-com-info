import React, { useState } from 'react';
import { PrintPricingSettings, AdminRole } from '../../types';
import { Printer, Copy, Scan, Send, FileCheck2, Save, RotateCcw, Check, Sparkles, Wifi } from 'lucide-react';

interface AdminPrintPricingViewProps {
  pricing: PrintPricingSettings;
  onUpdatePricing: (pricing: PrintPricingSettings) => void;
  onResetPricing: () => void;
  adminRole: AdminRole;
  showFeedback: (msg: string) => void;
  logAuditAction: (action: string, summary: string, details?: string) => void;
}

export const AdminPrintPricingView: React.FC<AdminPrintPricingViewProps> = ({
  pricing,
  onUpdatePricing,
  onResetPricing,
  adminRole,
  showFeedback,
  logAuditAction
}) => {
  const [form, setForm] = useState<PrintPricingSettings>({ ...pricing });
  const [hasChanges, setHasChanges] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setForm({ ...pricing });
    setHasChanges(false);
  }, [pricing]);

  const canEdit = adminRole === 'Super Admin' || adminRole === 'Store Manager';

  const handleChange = (key: keyof PrintPricingSettings, val: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: Math.max(0, val)
    }));
    setHasChanges(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePricing(form);
    setHasChanges(false);
    showFeedback('Tarifs d\'impression et bureautique enregistrés avec succès !');
    logAuditAction(
      'UPDATE_PRINT_PRICING',
      'Mise à jour des tarifs d\'impression & reprographie',
      `A4 N&B: ${form.bwA4}€ • A4 Couleur: ${form.colorA4}€ • Plastification: ${form.laminationA4}€ • Scan: ${form.scanPerPage}€ • Fax: ${form.faxPerPage}€`
    );
  };

  // Live test preview calculations
  const previewPages = 10;
  const previewBwA4Total = previewPages * form.bwA4;
  const previewColorA4Total = previewPages * form.colorA4;
  const previewLamination = 2 * form.laminationA4;
  const previewScan = 5 * form.scanPerPage;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-base text-gray-900">
              Grille Tarifaire Impression, Photocopies & Bureautique
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl">
            Définissez le prix unitaire par page des photocopies (noir & blanc et couleur en formats A4 et A3), ainsi que les tarifs de plastification, numérisation HD, fax et postes internet fibre. Les simulateurs clients du site s'ajustent instantanément.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              if (confirm('Rétablir les tarifs d\'impression recommandés par défaut ?')) {
                onResetPricing();
                showFeedback('Tarifs d\'impression réinitialisés');
                logAuditAction('RESET_SYSTEM', 'Réinitialisation des tarifs impression par défaut');
              }
            }}
            title="Rétablir tarifs par défaut"
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tarifs par défaut</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Pricing Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: A4 N&B */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">A4 Noir & Blanc</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">/ page</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                disabled={!canEdit}
                value={form.bwA4}
                onChange={(e) => handleChange('bwA4', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 0,15 € / page</p>
          </div>

          {/* Card 2: A4 Couleur */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">A4 Couleur HD</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">/ page</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                disabled={!canEdit}
                value={form.colorA4}
                onChange={(e) => handleChange('colorA4', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 0,40 € / page</p>
          </div>

          {/* Card 3: A3 N&B */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">A3 Noir & Blanc</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">/ page</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                disabled={!canEdit}
                value={form.bwA3}
                onChange={(e) => handleChange('bwA3', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 0,30 € / page</p>
          </div>

          {/* Card 4: A3 Couleur */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">A3 Couleur HD</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">/ page</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                disabled={!canEdit}
                value={form.colorA3}
                onChange={(e) => handleChange('colorA3', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 0,80 € / page</p>
          </div>

          {/* Card 5: Plastification */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">Plastification A4 thermique</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">/ doc</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.10"
                min="0.10"
                disabled={!canEdit}
                value={form.laminationA4}
                onChange={(e) => handleChange('laminationA4', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 2,00 € / document</p>
          </div>

          {/* Card 6: Scan HD */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">Numérisation / Scan HD</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">/ page</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0.05"
                disabled={!canEdit}
                value={form.scanPerPage}
                onChange={(e) => handleChange('scanPerPage', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 0,30 € / page PDF</p>
          </div>

          {/* Card 7: Fax */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">Envoi / Réception Fax</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">/ page</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.10"
                min="0.10"
                disabled={!canEdit}
                value={form.faxPerPage}
                onChange={(e) => handleChange('faxPerPage', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 1,50 € avec accusé</p>
          </div>

          {/* Card 8: Internet Fibre */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-800">Poste Internet Fibre</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">/ heure</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.50"
                min="0.50"
                disabled={!canEdit}
                value={form.internetHourlyRate}
                onChange={(e) => handleChange('internetHourlyRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-extrabold text-emerald-950 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-800">€</span>
            </div>
            <p className="text-[11px] text-gray-500">Exemple : 2,50 € / heure</p>
          </div>

        </div>

        {/* Live Simulator Preview for Admin verification */}
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-950">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Aperçu en direct du simulateur client avec ces tarifs</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-gray-500 block text-[11px]">10 pages A4 N&B</span>
              <span className="font-bold text-emerald-900">{previewBwA4Total.toFixed(2)} €</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-gray-500 block text-[11px]">10 pages A4 Couleur</span>
              <span className="font-bold text-emerald-900">{previewColorA4Total.toFixed(2)} €</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-gray-500 block text-[11px]">2 plastifications A4</span>
              <span className="font-bold text-emerald-900">{previewLamination.toFixed(2)} €</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <span className="text-gray-500 block text-[11px]">5 scans HD vers email</span>
              <span className="font-bold text-emerald-900">{previewScan.toFixed(2)} €</span>
            </div>
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
              <span>Enregistrer tous les tarifs d'impression</span>
            </button>
          </div>
        )}

      </form>
    </div>
  );
};
