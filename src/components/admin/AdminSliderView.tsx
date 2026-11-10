import React, { useState } from 'react';
import { ServiceSlideItem, AdminRole } from '../../types';
import { Layers, Plus, Edit3, Trash2, Check, RotateCcw, Save, X, Image as ImageIcon, Sparkles, ExternalLink } from 'lucide-react';

interface AdminSliderViewProps {
  slides: ServiceSlideItem[];
  onUpdateSlides: (slides: ServiceSlideItem[]) => void;
  onResetSlides: () => void;
  adminRole: AdminRole;
  showFeedback: (msg: string) => void;
  logAuditAction: (action: string, summary: string, details?: string) => void;
}

export const AdminSliderView: React.FC<AdminSliderViewProps> = ({
  slides,
  onUpdateSlides,
  onResetSlides,
  adminRole,
  showFeedback,
  logAuditAction
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceSlideItem>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<Omit<ServiceSlideItem, 'id' | 'number'>>({
    title: '',
    tagline: '',
    tag: '',
    description: '',
    highlights: ['Point fort 1', 'Point fort 2', 'Point fort 3'],
    image: '/assets/aistudio/slide-2-telephones-informatique_6bbdcef5.png',
    actionText: 'En savoir plus',
    actionTab: 'home'
  });

  const canEdit = adminRole === 'Super Admin' || adminRole === 'Store Manager';

  const startEdit = (slide: ServiceSlideItem) => {
    setEditingId(slide.id);
    setEditForm({ ...slide });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.title) return;
    const updated = slides.map((s) =>
      s.id === id ? ({ ...s, ...editForm } as ServiceSlideItem) : s
    );
    onUpdateSlides(updated);
    setEditingId(null);
    setEditForm({});
    showFeedback(`Affiche du carrousel mise à jour : ${editForm.title}`);
    logAuditAction('UPDATE_SLIDER', `Modification de l'affiche slider : ${editForm.title}`);
  };

  const handleDelete = (id: string) => {
    const target = slides.find((s) => s.id === id);
    if (!target) return;
    if (confirm(`Supprimer l'affiche "${target.title}" du carrousel ?`)) {
      const updated = slides.filter((s) => s.id !== id);
      onUpdateSlides(updated);
      showFeedback(`Affiche supprimée : ${target.title}`);
      logAuditAction('UPDATE_SLIDER', `Suppression affiche slider : ${target.title}`);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title.trim()) return;

    const nextNumber = (slides.length + 1).toString().padStart(2, '0');
    const newSlide: ServiceSlideItem = {
      id: 'slide-' + Date.now(),
      number: nextNumber,
      title: newForm.title.trim(),
      tagline: newForm.tagline || '',
      tag: newForm.tag || 'Offre Boutique',
      description: newForm.description || '',
      highlights: newForm.highlights?.filter(Boolean) || ['Service garanti'],
      image: newForm.image || '/assets/aistudio/slide-2-telephones-informatique_6bbdcef5.png',
      actionText: newForm.actionText || 'Découvrir',
      actionTab: newForm.actionTab || 'home'
    };

    onUpdateSlides([...slides, newSlide]);
    setIsAddingNew(false);
    showFeedback(`Nouvelle affiche ajoutée au carrousel : ${newSlide.title}`);
    logAuditAction('UPDATE_SLIDER', `Création nouvelle affiche carrousel : ${newSlide.title}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-base text-gray-900">
              Gestion des Affiches & Carrousel des Services (Slider)
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl">
            Personnalisez les affiches grand format paysages du carrousel d'accueil : modifiez les titres percutants, sous-titres, descriptifs, puces clés et visuels professionnels.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une affiche</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Réinitialiser toutes les affiches du carrousel aux valeurs d\'origine ?')) {
                  onResetSlides();
                  showFeedback('Affiches réinitialisées');
                  logAuditAction('RESET_SYSTEM', 'Réinitialisation des affiches slider par défaut');
                }
              }}
              title="Rétablir affiches par défaut"
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 p-2 rounded-xl text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add New Slide Form */}
      {isAddingNew && canEdit && (
        <form onSubmit={handleCreateNew} className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="font-bold text-sm text-emerald-950 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Créer une nouvelle affiche pour le carrousel</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Titre principal de l'affiche *</label>
              <input
                type="text"
                required
                placeholder="Ex: Arrivage iPhone 16 & Packs accessoires..."
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Sous-titre accrocheur</label>
              <input
                type="text"
                placeholder="Ex: Les meilleurs tarifs de Paris Est avec garantie..."
                value={newForm.tagline}
                onChange={(e) => setNewForm({ ...newForm, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Badge thématique (Tag)</label>
              <input
                type="text"
                placeholder="Ex: Nouveauté • Garantie 24 mois"
                value={newForm.tag}
                onChange={(e) => setNewForm({ ...newForm, tag: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Chemin ou URL de l'image paysage (16:9)</label>
              <input
                type="text"
                placeholder="/src/assets/images/... ou https://..."
                value={newForm.image}
                onChange={(e) => setNewForm({ ...newForm, image: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Texte du bouton d'action</label>
              <input
                type="text"
                placeholder="Ex: Voir les offres, Commander..."
                value={newForm.actionText}
                onChange={(e) => setNewForm({ ...newForm, actionText: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block font-bold text-gray-700 mb-1">Description détaillée de l'affiche</label>
              <textarea
                rows={2}
                placeholder="Explication claire du service ou de l'offre..."
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d] resize-none"
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
              <span>Ajouter l'affiche</span>
            </button>
          </div>
        </form>
      )}

      {/* Slides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {slides.map((slide, idx) => {
          const isEditing = editingId === slide.id;

          if (isEditing) {
            return (
              <div key={slide.id} className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-400 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Édition Affiche #{slide.number}</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">Titre principal</label>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">Sous-titre</label>
                  <input
                    type="text"
                    value={editForm.tagline || ''}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                    className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Badge / Tag</label>
                    <input
                      type="text"
                      value={editForm.tag || ''}
                      onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Texte Bouton</label>
                    <input
                      type="text"
                      value={editForm.actionText || ''}
                      onChange={(e) => setEditForm({ ...editForm, actionText: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600">URL / Chemin image paysage</label>
                  <input
                    type="text"
                    value={editForm.image || ''}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-mono"
                  />
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
                    onClick={() => handleSaveEdit(slide.id)}
                    className="px-3 py-1 bg-[#3f704d] text-white rounded-lg text-xs font-bold"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={slide.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col sm:flex-row">
              {/* Image Thumbnail */}
              <div className="sm:w-44 h-32 sm:h-auto bg-gray-100 relative shrink-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                  #{slide.number || (idx + 1).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Slide Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {slide.tag}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1 line-clamp-1">{slide.title}</h4>
                  <p className="text-xs font-medium text-emerald-900 line-clamp-1">{slide.tagline}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{slide.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">Bouton : {slide.actionText}</span>
                  {canEdit && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => startEdit(slide)}
                        className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="Modifier cette affiche"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer cette affiche"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
