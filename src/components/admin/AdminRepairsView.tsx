import React, { useState } from 'react';
import { RepairServiceTariff, AdminRole } from '../../types';
import { Wrench, Plus, Edit3, Trash2, Check, RotateCcw, ShieldCheck, Clock, Save, X, AlertCircle } from 'lucide-react';

interface AdminRepairsViewProps {
  repairTariffs: RepairServiceTariff[];
  onUpdateTariffs: (tariffs: RepairServiceTariff[]) => void;
  onResetTariffs: () => void;
  adminRole: AdminRole;
  showFeedback: (msg: string) => void;
  logAuditAction: (action: string, summary: string, details?: string) => void;
}

export const AdminRepairsView: React.FC<AdminRepairsViewProps> = ({
  repairTariffs,
  onUpdateTariffs,
  onResetTariffs,
  adminRole,
  showFeedback,
  logAuditAction
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RepairServiceTariff>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<Omit<RepairServiceTariff, 'id'>>({
    name: '',
    price: 'À partir de 39 €',
    numericPrice: 39,
    time: '30 min',
    warranty: 'Garantie 6 mois',
    deviceType: 'Tous modèles',
    description: '',
    active: true
  });

  const canEdit = adminRole === 'Super Admin' || adminRole === 'Store Manager';

  const startEdit = (tariff: RepairServiceTariff) => {
    setEditingId(tariff.id);
    setEditForm({ ...tariff });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.name || !editForm.price) return;
    const updated = repairTariffs.map((t) =>
      t.id === id ? ({ ...t, ...editForm } as RepairServiceTariff) : t
    );
    onUpdateTariffs(updated);
    setEditingId(null);
    setEditForm({});
    showFeedback(`Tarif réparation mis à jour : ${editForm.name}`);
    logAuditAction('UPDATE_REPAIRS', `Mise à jour du tarif réparation : ${editForm.name}`, `Nouveau prix: ${editForm.price} • Délai: ${editForm.time}`);
  };

  const handleToggleActive = (id: string) => {
    const target = repairTariffs.find((t) => t.id === id);
    if (!target) return;
    const newStatus = !target.active;
    const updated = repairTariffs.map((t) =>
      t.id === id ? { ...t, active: newStatus } : t
    );
    onUpdateTariffs(updated);
    showFeedback(`${target.name} ${newStatus ? 'activé' : 'désactivé'}`);
    logAuditAction('UPDATE_REPAIRS', `Service réparation ${newStatus ? 'activé' : 'désactivé'} : ${target.name}`);
  };

  const handleDelete = (id: string) => {
    const target = repairTariffs.find((t) => t.id === id);
    if (!target) return;
    if (confirm(`Confirmez-vous la suppression de la prestation "${target.name}" ?`)) {
      const updated = repairTariffs.filter((t) => t.id !== id);
      onUpdateTariffs(updated);
      showFeedback(`Prestation supprimée : ${target.name}`);
      logAuditAction('UPDATE_REPAIRS', `Suppression de la prestation réparation : ${target.name}`);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim() || !newForm.price.trim()) return;

    const newTariff: RepairServiceTariff = {
      id: 'rep-' + Date.now(),
      name: newForm.name.trim(),
      price: newForm.price.trim(),
      numericPrice: Number(newForm.numericPrice) || 30,
      time: newForm.time || '30 min',
      warranty: newForm.warranty || 'Garantie 6 mois',
      deviceType: newForm.deviceType || 'Tous modèles',
      description: newForm.description || '',
      active: true
    };

    onUpdateTariffs([newTariff, ...repairTariffs]);
    setIsAddingNew(false);
    setNewForm({
      name: '',
      price: 'À partir de 39 €',
      numericPrice: 39,
      time: '30 min',
      warranty: 'Garantie 6 mois',
      deviceType: 'Tous modèles',
      description: '',
      active: true
    });
    showFeedback(`Nouvelle prestation ajoutée : ${newTariff.name}`);
    logAuditAction('UPDATE_REPAIRS', `Création nouvelle prestation réparation : ${newTariff.name}`, `Tarif: ${newTariff.price}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Actions */}
      <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-base text-gray-900">
              Grille Tarifaire Réparations & Atelier SAV
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl">
            Modifiez en direct les tarifs d'écran, batterie, connecteurs et prestations de déblocage. Toutes les modifications sont immédiatement visibles sur le simulateur client et les devis en ligne.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une prestation</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Réinitialiser tous les tarifs de réparation aux valeurs d\'origine ?')) {
                  onResetTariffs();
                  showFeedback('Tarifs réparations réinitialisés');
                  logAuditAction('RESET_SYSTEM', 'Réinitialisation des tarifs de réparations par défaut');
                }
              }}
              title="Rétablir les tarifs recommandés"
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 p-2 rounded-xl text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add New Service Form */}
      {isAddingNew && canEdit && (
        <form onSubmit={handleCreateNew} className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Créer une nouvelle prestation de réparation</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Nom de la panne ou prestation *</label>
              <input
                type="text"
                required
                placeholder="Ex: Remplacement châssis arrière, Pose film hydrogel UV..."
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Tarif affiché (texte) *</label>
              <input
                type="text"
                required
                placeholder="Ex: À partir de 39 € ou 25 €"
                value={newForm.price}
                onChange={(e) => setNewForm({ ...newForm, price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Délai estimé</label>
              <input
                type="text"
                placeholder="Ex: 30 min, 1h, 24h..."
                value={newForm.time}
                onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Garantie</label>
              <input
                type="text"
                placeholder="Ex: Garantie 6 mois, Garantie 1 an..."
                value={newForm.warranty}
                onChange={(e) => setNewForm({ ...newForm, warranty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Appareils compatibles</label>
              <input
                type="text"
                placeholder="Ex: iPhone, Samsung, Xiaomi, Tous..."
                value={newForm.deviceType}
                onChange={(e) => setNewForm({ ...newForm, deviceType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Description / Précisions techniques</label>
              <input
                type="text"
                placeholder="Ex: Pièce certifiée d'origine, test complet des fonctions..."
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
              <span>Enregistrer la prestation</span>
            </button>
          </div>
        </form>
      )}

      {/* Repairs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/90 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Prestation & Panne</th>
                <th className="py-3 px-3">Tarif client</th>
                <th className="py-3 px-3">Délai atelier</th>
                <th className="py-3 px-3">Garantie</th>
                <th className="py-3 px-3 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {repairTariffs.map((t) => {
                const isEditing = editingId === t.id;

                if (isEditing) {
                  return (
                    <tr key={t.id} className="bg-emerald-50/60">
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Description..."
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full mt-1 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] text-gray-500"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editForm.price || ''}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className="w-28 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editForm.time || ''}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="w-24 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editForm.warranty || ''}
                          onChange={(e) => setEditForm({ ...editForm, warranty: e.target.value })}
                          className="w-28 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          En cours
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleSaveEdit(t.id)}
                          className="p-1.5 bg-[#3f704d] hover:bg-[#335c3f] text-white rounded-lg transition"
                          title="Sauvegarder"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                          title="Annuler"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={t.id} className={`hover:bg-gray-50/80 transition ${!t.active ? 'opacity-50 bg-gray-50' : ''}`}>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{t.name}</div>
                      {t.description && (
                        <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{t.description}</div>
                      )}
                      {t.deviceType && (
                        <span className="inline-block mt-1 text-[10px] bg-gray-100 text-gray-700 px-2 py-0.2 rounded font-medium">
                          {t.deviceType}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-extrabold text-emerald-900 text-xs sm:text-sm bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/80">
                        {t.price}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-gray-600 flex items-center space-x-1 mt-3">
                      <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{t.time}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 font-medium">
                      <div className="flex items-center space-x-1 text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="text-[11px]">{t.warranty}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => canEdit && handleToggleActive(t.id)}
                        disabled={!canEdit}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                          t.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {t.active ? 'Actif' : 'Masqué'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {canEdit ? (
                        <>
                          <button
                            onClick={() => startEdit(t)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Modifier ce tarif"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer cette prestation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Lecture seule</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
