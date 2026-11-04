import React, { useState } from 'react';
import { 
  Wrench, 
  Unlock, 
  ShieldCheck, 
  Clock, 
  CheckCircle
} from 'lucide-react';

export const RepairsAndUnlockingView: React.FC = () => {
  const [deviceType, setDeviceType] = useState<string>('iPhone');
  const [issue, setIssue] = useState<string>('Remplacement d\'écran / vitre OLED');
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');

  const REPAIR_PRICES: Record<string, { price: string; time: string; warranty: string }> = {
    'Remplacement d\'écran / vitre OLED': { price: 'À partir de 49 €', time: '30 à 45 min', warranty: 'Garantie 6 mois' },
    'Remplacement de batterie': { price: 'À partir de 35 €', time: '20 à 30 min', warranty: 'Garantie 6 mois' },
    'Connecteur de charge / Port USB-C': { price: 'À partir de 39 €', time: '30 min', warranty: 'Garantie 6 mois' },
    'Désimlockage réseau / Déblocage tout opérateur': { price: 'À partir de 20 €', time: '15 à 30 min', warranty: 'Déblocage permanent' },
    'Réinitialisation compte & code de verrouillage': { price: 'À partir de 25 €', time: '30 à 60 min', warranty: 'Service garanti' },
    'Désoxydation bain à ultrasons (téléphone tombé dans l\'eau)': { price: '35 € forfait diagnostic', time: '2 à 3 heures', warranty: 'Bain ultrasons' },
    'Réparation caméra avant / arrière': { price: 'À partir de 40 €', time: '40 min', warranty: 'Garantie 6 mois' },
    'Haut-parleur & écouteur d\'appel': { price: 'À partir de 30 €', time: '30 min', warranty: 'Garantie 6 mois' },
  };

  const currentInfo = REPAIR_PRICES[issue] || {
    price: 'Sur devis',
    time: '30 min',
    warranty: 'Garantie 6 mois'
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const ord = 'REP-3CI-' + Math.floor(1000 + Math.random() * 9000);
    setBookedSuccess(`Prise en charge pré-enregistrée ! Réf : ${ord}. Venez déposer votre appareil à notre atelier au 4-6 bd de la Boissière.`);
    setCustomerName('');
    setCustomerPhone('');
    setDeviceModel('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/70 text-gray-900 rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <span>Atelier de Réparation Express en Boutique</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Réparation Téléphones, Tablettes, PC & Déblocage Réseau
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Écran cassé, batterie affaiblie, connecteur encrassé ou téléphone bloqué : nos techniciens réparent votre appareil sur place en 30 minutes avec des pièces certifiées et garanties.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Estimator & Drop-off Booking (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-emerald-700" />
              <span>Tarifs des réparations & estimation immédiate</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Type d'appareil / Marque</label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="iPhone">Apple iPhone (Tous modèles)</option>
                  <option value="Samsung">Samsung Galaxy (Séries S, A, Z)</option>
                  <option value="Xiaomi">Xiaomi / Redmi / Poco</option>
                  <option value="Huawei">Huawei / Honor</option>
                  <option value="Oppo">Oppo / Realme / Vivo</option>
                  <option value="PC">Ordinateur Portable / PC Fixe</option>
                  <option value="Tablet">iPad & Tablettes Android</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Panne ou réparation souhaitée</label>
                <select
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {Object.keys(REPAIR_PRICES).map((iss) => (
                    <option key={iss} value={iss}>{iss}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Preview Banner */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                  Tarif indicatif en boutique
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-0.5">
                  {currentInfo.price}
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs text-gray-600">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Délai moyen : <strong className="text-gray-900">{currentInfo.time}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-900 font-bold">{currentInfo.warranty}</span>
                </div>
              </div>
            </div>

            {/* Drop-off slot form */}
            <form onSubmit={handleBooking} className="space-y-4 pt-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                Pré-enregistrement express pour dépôt en magasin
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Votre nom *</label>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="ex. 06 12 34 56 78"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Modèle exact</label>
                  <input
                    type="text"
                    placeholder="ex. iPhone 13 128 Go"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Slightly green button, strictly NO emoji in button */}
              <button
                type="submit"
                className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Enregistrer ma demande de réparation</span>
              </button>

              {bookedSuccess && (
                <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-medium border border-emerald-300">
                  {bookedSuccess}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Unlocking & Guarantees */}
        <div className="space-y-6">
          
          {/* Unlocking card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <Unlock className="w-5 h-5 text-emerald-700" />
              <h3>Désimlockage & Déblocage Tout Opérateur</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Votre téléphone est bloqué sur le réseau Orange, SFR, Bouygues Telecom, Free ou un opérateur étranger ? Nous effectuons le déblocage permanent officiel sans aucune perte de vos données personnelles.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-semibold">
              Déblocage à partir de 20 € • Réalisé directement en boutique
            </div>
          </div>

          {/* Guarantees card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-sm text-emerald-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Garantie 3 COMMUNES INFORMATIQUE</span>
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Chaque intervention comprend une série de tests matériels complets (tactile, haut-parleur, microphone, capteurs photo et intensité de charge) avant la remise de l'appareil.
            </p>
            <div className="pt-2 text-gray-700 border-t border-emerald-100">
              Besoin d'un renseignement immédiat ? Appelez-nous au <strong>01.43.93.16.79</strong>.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
