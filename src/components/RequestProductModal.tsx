import React, { useState } from 'react';
import { X, Check, PackagePlus, Send, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { CustomerRequest } from '../types';

interface RequestProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
  onSaveRequest?: (request: CustomerRequest) => void;
}

export const RequestProductModal: React.FC<RequestProductModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialCategory = '',
  onSaveRequest
}) => {
  const [productName, setProductName] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory || 'Téléphones mobiles');
  const [details, setDetails] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Sync initial query if opened with specific query
  React.useEffect(() => {
    if (initialQuery) {
      setProductName(initialQuery);
    }
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialQuery, initialCategory]);

  if (!isOpen) return null;

  const categoriesList = [
    'Téléphones mobiles (Neuf / Reconditionné)',
    'Coques, Films hydrogel & Verres trempés',
    'Chargeurs, Câbles & Batteries externes',
    'Audio sans fil, Casques & Enceintes',
    'Informatique, Souris, Claviers & Stockage',
    'Pièces de réparation & Écrans',
    'Articles du quotidien & Papeterie',
    'Autre produit spécifique'
  ];

  const buildMessage = () => {
    return (
      `Bonjour 3 Communes Informatique !\n` +
      `Je souhaite demander la disponibilité ou commander le produit suivant :\n\n` +
      `📦 Produit / Modèle : ${productName || 'Non précisé'}\n` +
      `🏷️ Catégorie : ${category}\n` +
      `📝 Détails / Spécifications : ${details || 'Aucune précision'}\n` +
      `👤 Client : ${customerName || 'Client boutique'}\n` +
      `📞 Contact : ${customerContact || 'Direct WhatsApp'}\n\n` +
      `Pouvez-vous me confirmer le tarif et le délai de réception au 4-6 boulevard de la Boissière à Romainville ? Merci !`
    );
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    const msg = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/33758464762?text=${msg}`, '_blank');
    const ticketId = 'REQ-WA-' + Math.floor(1000 + Math.random() * 9000);
    setSubmittedTicket(ticketId);

    if (onSaveRequest) {
      onSaveRequest({
        id: ticketId,
        type: 'product_request',
        customerName: customerName || 'Client WhatsApp',
        customerPhone: customerContact || '+33 7 58 46 47 62',
        title: `${productName} (${category})`,
        details: details || 'Envoyé par message WhatsApp direct',
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'contacted',
        channel: 'whatsapp'
      });
    }
  };

  const handleEmailSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    const subject = encodeURIComponent(`Demande de produit : ${productName} (3 Communes Informatique)`);
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:3communesinfo@gmail.com?subject=${subject}&body=${body}`;
    const ticketId = 'REQ-ML-' + Math.floor(1000 + Math.random() * 9000);
    setSubmittedTicket(ticketId);

    if (onSaveRequest) {
      onSaveRequest({
        id: ticketId,
        type: 'product_request',
        customerName: customerName || 'Client E-mail',
        customerPhone: customerContact || 'Par e-mail',
        title: `${productName} (${category})`,
        details: details || 'Envoyé par e-mail à 3communesinfo@gmail.com',
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'new',
        channel: 'email'
      });
    }
  };

  const handleOnlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !customerContact.trim()) return;
    const ticketId = 'DEM-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedTicket(ticketId);

    if (onSaveRequest) {
      onSaveRequest({
        id: ticketId,
        type: 'product_request',
        customerName: customerName || 'Client boutique',
        customerPhone: customerContact,
        title: `${productName} (${category})`,
        details: details || 'Demande formulée en ligne sur le site web',
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'new',
        channel: 'web'
      });
    }
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setProductName('');
    setDetails('');
    setCustomerName('');
    setCustomerContact('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-emerald-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-[#3f704d] text-white p-5 sm:p-6 flex items-start justify-between relative">
          <div className="space-y-1 pr-6">
            <div className="inline-flex items-center space-x-1.5 bg-white/15 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-100">
              <PackagePlus className="w-3.5 h-3.5 text-emerald-200" />
              <span>Commande spéciale & Recherche de référence</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Demander un nouveau produit
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Vous cherchez un modèle spécifique de smartphone, un accessoire ou une pièce introuvable ? Dites-le nous, nous le commandons pour vous sous 24h à 48h !
            </p>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {submittedTicket ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#3f704d] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Demande enregistrée avec succès !
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Votre demande pour <strong className="text-emerald-900">{productName}</strong> a bien été transmise à notre équipe de la boutique 3 Communes Informatique.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 max-w-sm mx-auto text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Numéro de demande :</span>
                  <span className="font-mono font-bold text-emerald-900">{submittedTicket}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Boutique :</span>
                  <span className="font-medium text-gray-800">4-6 bd de la Boissière, Romainville</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Délai estimé :</span>
                  <span className="font-semibold text-emerald-800">24h à 48h selon fournisseur</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={`https://wa.me/33758464762?text=${encodeURIComponent(buildMessage())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center space-x-1.5 bg-[#3f704d] hover:bg-[#335c3f] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Suivre sur WhatsApp (+33 7 58 46 47 62)</span>
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOnlineSubmit} className="space-y-4">
              {/* Product Name Field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Nom ou modèle du produit recherché <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: iPhone 15 Pro Max 256 Go, Coque antichoc Samsung A35, Chargeur 65W..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3f704d] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Rayon ou catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details & Specs */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Précisions souhaitées (couleur, capacité, neuf ou reconditionné, urgence...)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Couleur noir ou titane, état excellent ou neuf avec boîte, besoin avant ce week-end..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3f704d] resize-none"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Votre prénom ou nom
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Alexandre D."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Téléphone (ou WhatsApp) / E-mail <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 06 XX XX XX XX ou email@..."
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                  />
                </div>
              </div>

              {/* Instant Action Options */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Envoyer votre demande via :
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* WhatsApp Direct Submit */}
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    disabled={!productName.trim()}
                    className="flex items-center justify-center space-x-2 bg-[#3f704d] hover:bg-[#335c3f] disabled:opacity-50 text-white py-2.5 px-3 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp (+33 7 58 46 47 62)</span>
                  </button>

                  {/* Email Direct Submit */}
                  <button
                    type="button"
                    onClick={handleEmailSend}
                    disabled={!productName.trim()}
                    className="flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-900 border border-emerald-200 py-2.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Envoyer par E-mail</span>
                  </button>
                </div>

                {/* Direct Online Validation */}
                <button
                  type="submit"
                  disabled={!productName.trim() || !customerContact.trim()}
                  className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-gray-300" />
                  <span>Enregistrer ma demande en ligne</span>
                </button>
              </div>

              <div className="text-[11px] text-gray-500 bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-start space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Notre équipe consulte nos grossistes et fournisseurs partenaires en continu. Nous vous prévenons dès confirmation du prix et arrivage au comptoir.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
