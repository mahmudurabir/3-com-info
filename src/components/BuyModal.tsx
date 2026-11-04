import React, { useState } from 'react';
import { Product, OrderConfirmation } from '../types';
import { X, Check, ShieldCheck, MapPin, Truck, CreditCard, Banknote, ShoppingBag } from 'lucide-react';

interface BuyModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: (confirmation: OrderConfirmation) => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  product,
  onClose,
  onSuccess
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'counter' | 'online'>('counter');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const totalPrice = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = 'ORD-3CI-' + Math.floor(1000 + Math.random() * 9000);
      const confirmation: OrderConfirmation = {
        orderId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || 'Not specified',
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice,
        deliveryMethod,
        paymentMethod,
        orderDate: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        notes
      };

      setIsSubmitting(false);
      onSuccess(confirmation);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header: Clean soft green */}
        <div className="bg-emerald-800 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0">
              <ShoppingBag className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                Commande & Retrait Immédiat
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                Commander {product.name}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-center space-x-4 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-emerald-200 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <h3 className="text-sm font-bold text-gray-900 truncate mt-1">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.warranty}</p>
              <div className="text-base font-extrabold text-emerald-800 mt-0.5">
                {product.price} € <span className="text-xs font-normal text-gray-500">l'unité</span>
              </div>
            </div>
            
            {/* Quantity */}
            <div className="flex flex-col items-end">
              <label className="text-[11px] font-semibold text-gray-600 mb-1">Quantité</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold hover:bg-emerald-100 flex items-center justify-center text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="font-bold text-sm text-gray-800 w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold hover:bg-emerald-100 flex items-center justify-center text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            
            {/* Delivery Choice */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mode de réception
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-3 rounded-2xl border text-left transition flex items-start space-x-3 cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MapPin className={`w-4 h-4 mt-0.5 ${deliveryMethod === 'pickup' ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-bold text-xs">Retrait en magasin</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      4-6 bd de la Boissière, 93230 Romainville (Prêt en 15 min)
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-3 rounded-2xl border text-left transition flex items-start space-x-3 cursor-pointer ${
                    deliveryMethod === 'delivery'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Truck className={`w-4 h-4 mt-0.5 ${deliveryMethod === 'delivery' ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-bold text-xs">Livraison express</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Romainville, Montreuil, Noisy & Île-de-France
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Choice */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mode de paiement
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('counter')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center space-x-3 cursor-pointer ${
                    paymentMethod === 'counter'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="font-bold text-xs">Paiement au comptoir</div>
                    <div className="text-[11px] text-gray-500">Espèces, Carte bancaire ou Sans contact</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center space-x-3 cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="font-bold text-xs">Simulation carte bancaire</div>
                    <div className="text-[11px] text-gray-500">Confirmation immédiate de commande</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nom et prénom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex. Jean Dupont"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex. 06 12 34 56 78"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Adresse e-mail (pour le reçu de confirmation)
                </label>
                <input
                  type="email"
                  placeholder="ex. client@exemple.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Total Summary */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Total</span>
                <div className="text-2xl font-extrabold text-emerald-800">
                  {totalPrice.toFixed(2)} €
                </div>
              </div>

              {/* Slightly green button, strictly NO emoji in button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-bold py-3 px-6 rounded-2xl shadow-sm transition transform active:scale-95 text-xs sm:text-sm flex items-center space-x-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Traitement en cours...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirmer la commande</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantie magasin 3 COMMUNES INFORMATIQUE • Service client : 01.43.93.16.79</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
