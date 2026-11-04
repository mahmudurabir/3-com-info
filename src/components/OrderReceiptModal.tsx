import React from 'react';
import { OrderConfirmation } from '../types';
import { CheckCircle2, Printer, X, MapPin } from 'lucide-react';

interface OrderReceiptModalProps {
  order: OrderConfirmation | null;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-100 overflow-hidden my-auto animate-in zoom-in-95">
        
        {/* Receipt Header */}
        <div className="bg-emerald-800 text-white p-6 text-center space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-emerald-700 text-emerald-200 flex items-center justify-center mx-auto mb-2 border border-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-emerald-200">
            Commande Confirmée
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            3 COMMUNES INFORMATIQUE
          </h2>
          <p className="text-xs text-emerald-100">
            4-6 boulevard de la Boissière, 93230 Romainville
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Numéro de référence commande
            </span>
            <div className="text-2xl font-extrabold tracking-wider text-emerald-950 font-mono">
              {order.orderId}
            </div>
            <div className="text-[11px] text-gray-500">{order.orderDate}</div>
          </div>

          <div className="space-y-2 border-b border-gray-100 pb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Client :</span>
              <strong className="text-gray-900">{order.customerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Téléphone :</span>
              <strong className="text-gray-900">{order.customerPhone}</strong>
            </div>
            {order.customerEmail !== 'Not specified' && (
              <div className="flex justify-between">
                <span className="text-gray-500">E-mail :</span>
                <span className="text-gray-700">{order.customerEmail}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Mode de retrait :</span>
              <strong className="text-emerald-800">
                {order.deliveryMethod === 'pickup' 
                  ? 'Retrait en magasin (boutique de Romainville)' 
                  : 'Livraison express (Île-de-France)'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Paiement :</span>
              <span className="text-gray-700">
                {order.paymentMethod === 'counter' ? 'Paiement au comptoir' : 'Paiement par carte bancaire'}
              </span>
            </div>
          </div>

          <div className="space-y-2 border-b border-gray-100 pb-4">
            <div className="flex justify-between font-bold text-gray-800">
              <span>{order.productName}</span>
              <span>x{order.quantity}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Prix unitaire</span>
              <span>{order.unitPrice.toFixed(2)} €</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-xs font-bold uppercase text-gray-700">Total</span>
            <span className="text-2xl font-black text-emerald-900">
              {order.totalPrice.toFixed(2)} €
            </span>
          </div>

          {order.deliveryMethod === 'pickup' && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start space-x-2 text-[11px] text-gray-600">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                Votre commande est préparée sous 15 minutes au <strong>4-6 bd de la Boissière, 93230 Romainville</strong>.
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le reçu</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#3f704d] hover:bg-[#335c3f] text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
            >
              Fermer
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
