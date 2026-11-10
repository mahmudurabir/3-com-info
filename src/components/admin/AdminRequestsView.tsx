import React, { useState } from 'react';
import { CustomerRequest } from '../../types';
import { 
  Inbox, 
  Search, 
  Phone, 
  Mail, 
  ShoppingBag, 
  PackagePlus, 
  Wrench, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { WhatsAppIcon } from '../WhatsAppIcon';

interface AdminRequestsViewProps {
  requests: CustomerRequest[];
  onUpdateRequestStatus: (id: string, status: CustomerRequest['status']) => void;
  onDeleteRequest: (id: string) => void;
  onClearCompleted?: () => void;
}

export const AdminRequestsView: React.FC<AdminRequestsViewProps> = ({
  requests,
  onUpdateRequestStatus,
  onDeleteRequest,
  onClearCompleted
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'order' | 'product_request' | 'repair_booking'>('all');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.customerEmail && r.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesType = typeFilter === 'all' || r.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const countNew = requests.filter((r) => r.status === 'new').length;
  const countContacted = requests.filter((r) => r.status === 'contacted').length;
  const countCompleted = requests.filter((r) => r.status === 'completed').length;

  const getTypeBadge = (type: CustomerRequest['type']) => {
    switch (type) {
      case 'order':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <ShoppingBag className="w-3 h-3 text-emerald-700" />
            <span>Commande d'article</span>
          </span>
        );
      case 'product_request':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <PackagePlus className="w-3 h-3 text-blue-700" />
            <span>Demande de produit</span>
          </span>
        );
      case 'repair_booking':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
            <Wrench className="w-3 h-3 text-amber-700" />
            <span>Devis réparation</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: CustomerRequest['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="bg-red-100 text-red-800 border border-red-300 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>Nouveau (À traiter)</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Client contacté</span>
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Traité / Récupéré</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-gray-100 text-gray-700 border border-gray-300 font-medium px-2.5 py-0.5 rounded-full text-[11px]">
            Annulé
          </span>
        );
    }
  };

  const getCleanPhoneForWhatsApp = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '33' + clean.slice(1);
    }
    return clean;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
            <Inbox className="w-3.5 h-3.5 text-emerald-800" />
            <span>Boîte de réception des clients</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Commandes, Demandes & Réservations Clients
          </h2>
          <p className="text-xs text-gray-600 max-w-xl mt-1 leading-relaxed">
            Chaque fois qu'un client passe une commande, demande un produit spécifique ou réserve une réparation, la demande arrive ici en temps réel ainsi que sur votre WhatsApp officiel (+33 7 58 46 47 62).
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-2.5 shrink-0 text-center">
          <div className="bg-white border border-red-200 p-2.5 rounded-xl shadow-2xs">
            <span className="text-xl font-extrabold text-red-600 block">{countNew}</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase">Nouvelles</span>
          </div>
          <div className="bg-white border border-blue-200 p-2.5 rounded-xl shadow-2xs">
            <span className="text-xl font-extrabold text-blue-600 block">{countContacted}</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase">En cours</span>
          </div>
          <div className="bg-white border border-emerald-200 p-2.5 rounded-xl shadow-2xs">
            <span className="text-xl font-extrabold text-emerald-700 block">{countCompleted}</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase">Traitées</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom client, téléphone, e-mail, modèle ou référence (ex. ORD-3CI, Karim, iPhone)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-1 shrink-0 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-gray-400 mr-1" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto cursor-pointer"
            >
              <option value="all">Tous types de demandes</option>
              <option value="order">📦 Commandes d'articles</option>
              <option value="product_request">✨ Demandes de produits</option>
              <option value="repair_booking">🔧 Réservations réparation</option>
            </select>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes ({requests.length})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              statusFilter === 'new'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            <span>Nouvelles ({countNew})</span>
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'contacted'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            En contact ({countContacted})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Traitées ({countCompleted})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => {
            const cleanPhone = getCleanPhoneForWhatsApp(req.customerPhone);
            const waGreeting = encodeURIComponent(
              `Bonjour ${req.customerName || 'bonjour'} ! C'est 3 Communes Informatique (Romainville) suite à votre demande sur notre site concernant "${req.title}". Nous sommes à votre disposition !`
            );

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-xs hover:shadow-md ${
                  req.status === 'new'
                    ? 'border-red-300 ring-2 ring-red-100'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                      {req.id}
                    </span>
                    {getTypeBadge(req.type)}
                    <span className="text-[11px] text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{req.date}</span>
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2">
                    <label className="text-[11px] text-gray-500 font-semibold">Statut :</label>
                    <select
                      value={req.status}
                      onChange={(e) => onUpdateRequestStatus(req.id, e.target.value as any)}
                      className="text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                    >
                      <option value="new">🔴 Nouveau</option>
                      <option value="contacted">🔵 Client contacté</option>
                      <option value="completed">🟢 Traité / Terminé</option>
                      <option value="cancelled">⚪ Annulé</option>
                    </select>
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                {/* Content info */}
                <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Col 1: Customer Details */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Coordonnées Client
                    </span>
                    <p className="font-bold text-sm text-gray-900">{req.customerName || 'Client'}</p>
                    <p className="text-xs text-gray-700 flex items-center space-x-1 font-semibold">
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>{req.customerPhone}</span>
                    </p>
                    {req.customerEmail && (
                      <p className="text-xs text-gray-500 flex items-center space-x-1 truncate">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{req.customerEmail}</span>
                      </p>
                    )}
                  </div>

                  {/* Col 2: Requested Item / Details */}
                  <div className="space-y-1 md:col-span-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Article / Service demandé
                    </span>
                    <p className="font-bold text-xs sm:text-sm text-gray-900">{req.title}</p>
                    {req.details && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        {req.details}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-gray-600">
                      {req.quantity && (
                        <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                          Quantité : {req.quantity}
                        </span>
                      )}
                      {req.totalPrice !== undefined && (
                        <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                          Montant : {req.totalPrice.toFixed(2)} €
                        </span>
                      )}
                      {req.deliveryMethod && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                          Mode : {req.deliveryMethod === 'pickup' ? 'Retrait boutique' : 'Livraison express'}
                        </span>
                      )}
                      {req.paymentMethod && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                          Paiement : {req.paymentMethod === 'counter' ? 'Au comptoir' : 'En ligne / CB'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: WhatsApp client in 1 click, Call, Delete */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {/* WhatsApp Direct with prefilled message */}
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${waGreeting}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-[#3f704d] hover:bg-[#335c3f] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-2xs"
                      title="Contacter directement le client sur WhatsApp"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>

                    {/* Phone Call direct */}
                    <a
                      href={`tel:${req.customerPhone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-800" />
                      <span>Appeler</span>
                    </a>

                    {/* Email direct if provided */}
                    {req.customerEmail && (
                      <a
                        href={`mailto:${req.customerEmail}?subject=${encodeURIComponent(`3 Communes Informatique - Suite à votre demande "${req.title}"`)}`}
                        className="inline-flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-xl transition"
                      >
                        <Mail className="w-3.5 h-3.5 text-gray-600" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer la demande de ${req.customerName} (${req.id}) ?`)) {
                        onDeleteRequest(req.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer text-xs flex items-center space-x-1"
                    title="Supprimer cette demande"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Supprimer</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-2">
            <Inbox className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-800 text-sm">Aucune demande trouvée</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Toutes les demandes passées par les visiteurs (commandes d'appareils, demandes de produits et devis réparations) s'afficheront ici.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
