import React, { useState } from 'react';
import { MoneyTransferPartner, AdminRole } from '../../types';
import { ArrowLeftRight, Plus, Edit3, Trash2, Check, RotateCcw, Save, X, ShieldCheck, Zap } from 'lucide-react';

interface AdminMoneyTransferViewProps {
  partners: MoneyTransferPartner[];
  onUpdatePartners: (partners: MoneyTransferPartner[]) => void;
  onResetPartners: () => void;
  adminRole: AdminRole;
  showFeedback: (msg: string) => void;
  logAuditAction: (action: string, summary: string, details?: string) => void;
}

export const AdminMoneyTransferView: React.FC<AdminMoneyTransferViewProps> = ({
  partners,
  onUpdatePartners,
  onResetPartners,
  adminRole,
  showFeedback,
  logAuditAction
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MoneyTransferPartner>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<Omit<MoneyTransferPartner, 'id'>>({
    name: '',
    feeFrom: 'À partir de 1,90 €',
    speed: 'Instantané',
    description: '',
    active: true
  });

  const canEdit = adminRole === 'Super Admin' || adminRole === 'Store Manager';

  const startEdit = (p: MoneyTransferPartner) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.name) return;
    const updated = partners.map((p) =>
      p.id === id ? ({ ...p, ...editForm } as MoneyTransferPartner) : p
    );
    onUpdatePartners(updated);
    setEditingId(null);
    setEditForm({});
    showFeedback(`Partenaire de transfert mis à jour : ${editForm.name}`);
    logAuditAction('UPDATE_MONEY_SETTINGS', `Mise à jour opérateur transfert : ${editForm.name}`, `Frais: ${editForm.feeFrom} • Délai: ${editForm.speed}`);
  };

  const handleToggleActive = (id: string) => {
    const target = partners.find((p) => p.id === id);
    if (!target) return;
    const newStatus = !target.active;
    const updated = partners.map((p) =>
      p.id === id ? { ...p, active: newStatus } : p
    );
    onUpdatePartners(updated);
    showFeedback(`${target.name} ${newStatus ? 'activé' : 'désactivé'}`);
    logAuditAction('UPDATE_MONEY_SETTINGS', `Opérateur ${newStatus ? 'activé' : 'désactivé'} : ${target.name}`);
  };

  const handleDelete = (id: string) => {
    const target = partners.find((p) => p.id === id);
    if (!target) return;
    if (confirm(`Supprimer l'opérateur de transfert "${target.name}" ?`)) {
      const updated = partners.filter((p) => p.id !== id);
      onUpdatePartners(updated);
      showFeedback(`Opérateur supprimé : ${target.name}`);
      logAuditAction('UPDATE_MONEY_SETTINGS', `Suppression opérateur transfert : ${target.name}`);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim()) return;

    const newPartner: MoneyTransferPartner = {
      id: 'partner-' + Date.now(),
      name: newForm.name.trim(),
      feeFrom: newForm.feeFrom || 'Taux comptoir',
      speed: newForm.speed || 'Instantané',
      description: newForm.description || '',
      active: true
    };

    onUpdatePartners([...partners, newPartner]);
    setIsAddingNew(false);
    setNewForm({
      name: '',
      feeFrom: 'À partir de 1,90 €',
      speed: 'Instantané',
      description: '',
      active: true
    });
    showFeedback(`Nouvel opérateur ajouté : ${newPartner.name}`);
    logAuditAction('UPDATE_MONEY_SETTINGS', `Création nouvel opérateur transfert : ${newPartner.name}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-base text-gray-900">
              Gestion des Opérateurs de Transfert d'Argent & Recharges
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl">
            Configurez les réseaux de transfert officiels (Western Union, Ria, MoneyGram, Orange Money, Ding, Joxko), activez/désactivez des corridors et ajustez les barèmes d'envoi et d'appel.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un opérateur</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Réinitialiser la liste des partenaires de transfert par défaut ?')) {
                  onResetPartners();
                  showFeedback('Opérateurs de transfert réinitialisés');
                  logAuditAction('RESET_SYSTEM', 'Réinitialisation des opérateurs de transfert par défaut');
                }
              }}
              title="Rétablir liste par défaut"
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 p-2 rounded-xl text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add New Partner Form */}
      {isAddingNew && canEdit && (
        <form onSubmit={handleCreateNew} className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Ajouter un nouvel opérateur ou réseau de recharge</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nom de l'opérateur *</label>
              <input
                type="text"
                required
                placeholder="Ex: Western Union, Ria, MoneyGram, Wave..."
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Frais affichés (texte)</label>
              <input
                type="text"
                placeholder="Ex: À partir de 1,90 €"
                value={newForm.feeFrom}
                onChange={(e) => setNewForm({ ...newForm, feeFrom: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Délai / Vitesse d'envoi</label>
              <input
                type="text"
                placeholder="Ex: Instantané, Quelques minutes..."
                value={newForm.speed}
                onChange={(e) => setNewForm({ ...newForm, speed: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-gray-700 mb-1">Description / Corridors couverts</label>
              <input
                type="text"
                placeholder="Ex: Envois vers plus de 200 pays, retrait espèces immédiat au guichet..."
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3f704d] hover:bg-[#335c3f] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer l'opérateur</span>
            </button>
          </div>
        </form>
      )}

      {/* Partners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => {
          const isEditing = editingId === p.id;

          if (isEditing) {
            return (
              <div key={p.id} className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-400 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">Nom de l'opérateur</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Frais dès</label>
                    <input
                      type="text"
                      value={editForm.feeFrom || ''}
                      onChange={(e) => setEditForm({ ...editForm, feeFrom: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Vitesse</label>
                    <input
                      type="text"
                      value={editForm.speed || ''}
                      onChange={(e) => setEditForm({ ...editForm, speed: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600">Description</label>
                  <textarea
                    rows={2}
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-1.5 pt-1">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSaveEdit(p.id)}
                    className="px-3 py-1 bg-[#3f704d] text-white rounded-lg text-xs font-bold"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={p.id}
              className={`bg-white p-4 rounded-2xl border transition shadow-2xs space-y-3 ${
                p.active ? 'border-gray-200 hover:border-emerald-300' : 'border-gray-200 opacity-60 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">{p.name}</h4>
                </div>

                <button
                  onClick={() => canEdit && handleToggleActive(p.id)}
                  disabled={!canEdit}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                    p.active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {p.active ? 'Actif' : 'Désactivé'}
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {p.feeFrom}
                </span>
                <span className="text-gray-500 text-[11px] flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{p.speed}</span>
                </span>
              </div>

              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                {p.description}
              </p>

              {canEdit && (
                <div className="flex justify-end space-x-1 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(p)}
                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
