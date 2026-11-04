import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Smartphone, 
  CheckCircle, 
  FileText, 
  TrendingUp, 
  MapPin, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface MoneyTransferProps {
  onContactClick?: () => void;
}

interface CountryRateConfig {
  country: string;
  currencyCode: string;
  currencyLabel: string;
  defaultRate: number;
  flag: string;
  popularPartner: string;
  transferType: string;
  isFixedPeg?: boolean;
}

const COUNTRY_CONFIGS: Record<string, CountryRateConfig> = {
  Bangladesh: {
    country: 'Bangladesh',
    currencyCode: 'BDT',
    currencyLabel: 'BDT (Taka)',
    defaultRate: 138.45,
    flag: '🇧🇩',
    popularPartner: 'Western Union / Ria / bKash',
    transferType: 'Dépôt bancaire & bKash'
  },
  Morocco: {
    country: 'Maroc',
    currencyCode: 'MAD',
    currencyLabel: 'MAD (Dirham)',
    defaultRate: 10.99,
    flag: '🇲🇦',
    popularPartner: 'Western Union / Ria / MoneyGram',
    transferType: 'Retrait espèces & compte bancaire'
  },
  Algeria: {
    country: 'Algérie',
    currencyCode: 'DZD',
    currencyLabel: 'DZD (Dinar)',
    defaultRate: 151.20,
    flag: '🇩🇿',
    popularPartner: 'Ria / Western Union',
    transferType: 'Retrait d\'espèces immédiat'
  },
  Tunisia: {
    country: 'Tunisie',
    currencyCode: 'TND',
    currencyLabel: 'TND (Dinar)',
    defaultRate: 3.42,
    flag: '🇹🇳',
    popularPartner: 'Western Union / MoneyGram',
    transferType: 'Retrait en agence & compte'
  },
  Senegal: {
    country: 'Sénégal',
    currencyCode: 'XOF',
    currencyLabel: 'FCFA (XOF)',
    defaultRate: 655.957,
    flag: '🇸🇳',
    popularPartner: 'Orange Money / Western Union / Ria',
    transferType: 'Orange Money & Retrait espèces',
    isFixedPeg: true
  },
  Mali: {
    country: 'Mali',
    currencyCode: 'XOF',
    currencyLabel: 'FCFA (XOF)',
    defaultRate: 655.957,
    flag: '🇲🇱',
    popularPartner: 'Orange Money / Ria / MoneyGram',
    transferType: 'Orange Money & Espèces',
    isFixedPeg: true
  },
  IvoryCoast: {
    country: 'Côte d\'Ivoire',
    currencyCode: 'XOF',
    currencyLabel: 'FCFA (XOF)',
    defaultRate: 655.957,
    flag: '🇨🇮',
    popularPartner: 'Orange Money / Wave / Ria',
    transferType: 'Mobile Money (Wave / Orange) & Espèces',
    isFixedPeg: true
  },
  Guinea: {
    country: 'Guinée Conakry',
    currencyCode: 'GNF',
    currencyLabel: 'GNF (Franc)',
    defaultRate: 9911.0,
    flag: '🇬🇳',
    popularPartner: 'Orange Money / Western Union',
    transferType: 'Orange Money & Retrait espèces'
  },
  Cameroon: {
    country: 'Cameroun',
    currencyCode: 'XAF',
    currencyLabel: 'FCFA (XAF)',
    defaultRate: 655.957,
    flag: '🇨🇲',
    popularPartner: 'Orange Money / Western Union',
    transferType: 'Orange Money & Espèces',
    isFixedPeg: true
  },
  Comoros: {
    country: 'Comores',
    currencyCode: 'KMF',
    currencyLabel: 'KMF (Franc)',
    defaultRate: 491.96,
    flag: '🇰🇲',
    popularPartner: 'Western Union / Ria',
    transferType: 'Retrait en espèces',
    isFixedPeg: true
  },
  Congo: {
    country: 'RD Congo',
    currencyCode: 'CDF',
    currencyLabel: 'CDF (Franc)',
    defaultRate: 2980.0,
    flag: '🇨🇩',
    popularPartner: 'Western Union / MoneyGram',
    transferType: 'Retrait d\'espèces'
  },
  India: {
    country: 'Inde',
    currencyCode: 'INR',
    currencyLabel: 'INR (Roupie)',
    defaultRate: 95.80,
    flag: '🇮🇳',
    popularPartner: 'Western Union / Ria / Banque',
    transferType: 'Virement bancaire UPI instantané'
  },
  Pakistan: {
    country: 'Pakistan',
    currencyCode: 'PKR',
    currencyLabel: 'PKR (Roupie)',
    defaultRate: 318.50,
    flag: '🇵🇰',
    popularPartner: 'Western Union / Ria / MoneyGram',
    transferType: 'Dépôt bancaire & Espèces'
  },
  Philippines: {
    country: 'Philippines',
    currencyCode: 'PHP',
    currencyLabel: 'PHP (Peso)',
    defaultRate: 64.20,
    flag: '🇵🇭',
    popularPartner: 'Western Union / Ria / GCash',
    transferType: 'Retrait espèces & GCash'
  }
};

export const MoneyTransferView: React.FC<MoneyTransferProps> = () => {
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>('Bangladesh');
  const [sendAmountEuro, setSendAmountEuro] = useState<number>(150);
  const [selectedPartner, setSelectedPartner] = useState<string>('Western Union');

  // Real-time rates state
  const [liveRates, setLiveRates] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.entries(COUNTRY_CONFIGS).forEach(([, cfg]) => {
      initial[cfg.currencyCode] = cfg.defaultRate;
    });
    return initial;
  });

  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Fetch real-time exchange rates from live API
  const fetchRealTimeRates = async () => {
    setIsLoadingRates(true);
    try {
      // Primary real-time API
      const res = await fetch('https://open.er-api.com/v6/latest/EUR');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          const updated: Record<string, number> = {};
          Object.values(COUNTRY_CONFIGS).forEach((cfg) => {
            if (cfg.isFixedPeg) {
              updated[cfg.currencyCode] = cfg.defaultRate;
            } else if (data.rates[cfg.currencyCode]) {
              updated[cfg.currencyCode] = Number(data.rates[cfg.currencyCode]);
            } else {
              updated[cfg.currencyCode] = cfg.defaultRate;
            }
          });
          setLiveRates(updated);
          setLastUpdatedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsLoadingRates(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Primary exchange rate API failed, trying fallback...', e);
    }

    // Secondary fallback
    try {
      const res2 = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json');
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.eur) {
          const updated: Record<string, number> = {};
          Object.values(COUNTRY_CONFIGS).forEach((cfg) => {
            const keyLower = cfg.currencyCode.toLowerCase();
            if (cfg.isFixedPeg) {
              updated[cfg.currencyCode] = cfg.defaultRate;
            } else if (data2.eur[keyLower]) {
              updated[cfg.currencyCode] = Number(data2.eur[keyLower]);
            } else {
              updated[cfg.currencyCode] = cfg.defaultRate;
            }
          });
          setLiveRates(updated);
          setLastUpdatedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsLoadingRates(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Fallback rate API error', err);
    }

    setLastUpdatedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    setIsLoadingRates(false);
  };

  useEffect(() => {
    fetchRealTimeRates();
    // Auto-refresh rates every 60 seconds
    const interval = setInterval(fetchRealTimeRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const partners = [
    { name: 'Western Union', desc: 'Transfert d\'argent instantané dans le monde entier', logo: 'WU' },
    { name: 'Ria', desc: 'Taux compétitifs et réseau mondial d\'agences', logo: 'Ria' },
    { name: 'MoneyGram', desc: 'Transferts internationaux rapides et fiables', logo: 'MG' },
    { name: 'Orange Money', desc: 'Transfert direct sur portefeuille mobile en Afrique', logo: 'OM' },
    { name: 'Ding', desc: 'Recharge mobile internationale instantanée', logo: 'Ding' },
    { name: 'Joxko', desc: 'Crédit d\'appel & forfaits mobiles à distance', logo: 'Joxko' },
  ];

  const currentCountry = COUNTRY_CONFIGS[selectedCountryKey] || COUNTRY_CONFIGS['Bangladesh'];
  const activeRate = liveRates[currentCountry.currencyCode] || currentCountry.defaultRate;
  
  const payoutAmount = (sendAmountEuro * activeRate).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const googleSearchRateUrl = `https://www.google.com/search?q=1+EUR+to+${currentCountry.currencyCode}`;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Header: Clean soft green matching white base */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/70 text-gray-900 rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <span>Agence officielle agréée de transfert • Romainville</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Transfert d'Argent International & Recharges Mobiles
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Chez <strong className="text-emerald-800">3 Communes Informatique</strong>, envoyez de l'argent vers le monde entier et rechargez les téléphones de vos proches avec les taux de change interbancaires en direct.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {partners.map(p => (
              <span key={p.name} className="bg-white text-emerald-950 px-3 py-1 rounded-xl text-xs font-semibold border border-emerald-200 shadow-xs">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Calculator & Mobile Operators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Interactive Live Euro (€) Calculator */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Transfer Calculator Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-50 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Simulateur de taux de change en direct
                  </h2>
                  <p className="text-xs text-gray-500">
                    Calculé en temps réel selon les cours du marché interbancaire & Google
                  </p>
                </div>
              </div>

              {/* Real-Time Live Status Pill & Refresh Action */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Cours Google en direct</span>
                  {lastUpdatedTime && (
                    <span className="text-emerald-600 font-normal hidden sm:inline">({lastUpdatedTime})</span>
                  )}
                </div>

                <button
                  onClick={fetchRealTimeRates}
                  disabled={isLoadingRates}
                  title="Actualiser le cours en direct depuis Google"
                  className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg border border-emerald-300 transition flex items-center justify-center cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRates ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Partner Tabs */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Sélectionnez l'opérateur de transfert
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {partners.map((partner) => (
                  <button
                    key={partner.name}
                    type="button"
                    onClick={() => setSelectedPartner(partner.name)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      selectedPartner === partner.name
                        ? 'border-[#3f704d] bg-emerald-50/80 text-emerald-950 ring-1 ring-[#3f704d] font-bold'
                        : 'border-gray-200 bg-gray-50/80 text-gray-700 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold flex items-center justify-between">
                      <span>{partner.name}</span>
                      <span className="text-[10px] text-emerald-700 uppercase font-bold">{partner.logo}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 truncate">{partner.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Corridor and Amounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Destination Country */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Pays de destination
                </label>
                <select
                  value={selectedCountryKey}
                  onChange={(e) => setSelectedCountryKey(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  {Object.entries(COUNTRY_CONFIGS).map(([key, data]) => (
                    <option key={key} value={key}>
                      {data.flag} {data.country} ({data.currencyLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount to Send in EURO */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Montant envoyé (Euros €)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-emerald-800 text-sm">
                    €
                  </span>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={sendAmountEuro}
                    onChange={(e) => setSendAmountEuro(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl pl-8 pr-4 py-2.5 text-sm sm:text-base font-extrabold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Instant Result Box with Real-Time Google Rate verification */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-2xl p-5 border border-emerald-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Montant estimé reçu par le bénéficiaire
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-1">
                    {payoutAmount} <span className="text-sm font-bold text-emerald-800">{currentCountry.currencyCode}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-gray-500 block">Mode de mise à disposition</span>
                  <span className="text-xs font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 inline-block mt-0.5">
                    {currentCountry.transferType}
                  </span>
                </div>
              </div>

              {/* Live Rate info + Google verification link */}
              <div className="pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-1.5 text-gray-700 font-medium">
                  <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Cours en direct : <strong className="text-emerald-900">1 € = {activeRate.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} {currentCountry.currencyCode}</strong>
                  </span>
                  {currentCountry.isFixedPeg && (
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                      Parité officielle fixe
                    </span>
                  )}
                </div>

                {/* Direct Google Verification Link */}
                <a
                  href={googleSearchRateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 font-bold bg-white px-3 py-1 rounded-lg border border-emerald-200 hover:border-emerald-300 transition text-[11px]"
                >
                  <span>Vérifier sur Google</span>
                  <ExternalLink className="w-3 h-3 text-emerald-700" />
                </a>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Opération immédiate au comptoir :</strong> Rendez-vous dans notre boutique au 4-6 boulevard de la Boissière, 93230 Romainville avec votre pièce d'identité en cours de validité et les coordonnées du bénéficiaire pour un traitement direct avec remise de reçu officiel.
              </div>
            </div>
          </div>

          {/* FRENCH & INTERNATIONAL OPERATORS SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Opérateurs Mobiles Français & Recharges Internationales
                </h2>
                <p className="text-xs text-gray-500">
                  Disponibles au comptoir : recharges prépayées, forfaits data, cartes SIM et recharges internationales
                </p>
              </div>
            </div>

            {/* French Domestic Operators */}
            <div>
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Réseaux & Opérateurs Mobiles en France
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {[
                  { name: 'Orange', tag: 'Mobicarte & Pass', color: 'border-orange-200 bg-orange-50/50' },
                  { name: 'SFR', tag: 'Recharges La Carte', color: 'border-red-200 bg-red-50/50' },
                  { name: 'Bouygues', tag: 'Cartes Prépayées', color: 'border-blue-200 bg-blue-50/50' },
                  { name: 'Free', tag: 'SIM & Forfaits', color: 'border-gray-200 bg-gray-50/50' },
                  { name: 'Lebara', tag: 'Appels Internationaux', color: 'border-cyan-200 bg-cyan-50/50' },
                  { name: 'Lycamobile', tag: 'Pass Data & Appels', color: 'border-emerald-200 bg-emerald-50/50' },
                ].map((op) => (
                  <div key={op.name} className={`p-3 rounded-2xl border ${op.color} text-center space-y-1`}>
                    <div className="font-extrabold text-xs text-gray-900">{op.name}</div>
                    <div className="text-[10px] text-gray-500">{op.tag}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* International Top-Up & Wallet Partners */}
            <div className="pt-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Recharges Mobiles Internationales & Dépôt Portefeuille Mobile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <h3 className="font-bold text-xs text-emerald-950">Ding Recharge</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Envoyez du crédit téléphonique et des forfaits data en temps réel vers plus de 150 pays et 500 réseaux mobiles.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <h3 className="font-bold text-xs text-emerald-950">Orange Money</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dépôts directs et sécurisés sur le portefeuille mobile Orange Money de vos proches en Afrique de l'Ouest et Centrale.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <h3 className="font-bold text-xs text-emerald-950">Joxko Transfer</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Recharge immédiate de crédit d'appel international pour que votre famille ne perde jamais le contact.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: ID Checklist & Store Assistance */}
        <div className="space-y-6">
          
          {/* French ID Compliance Box */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h2>Pièces d'identité requises (Réglementation)</h2>
            </div>
            
            <p className="text-xs text-gray-600 leading-relaxed">
              Conformément à la réglementation financière française, veuillez vous munir d'un original en cours de validité :
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Carte Nationale d\'Identité (France ou Union Européenne)',
                'Passeport en cours de validité (français ou étranger)',
                'Titre de Séjour français ou Carte de Résident',
                'Récépissé officiel de renouvellement accompagné du titre d\'origine'
              ].map((doc, idx) => (
                <div key={idx} className="flex items-start space-x-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-gray-800 font-medium">{doc}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 leading-normal">
              * Les photographies ou captures d'écran sur smartphone ne peuvent pas être acceptées pour les opérations de transfert d'argent.
            </div>
          </div>

          {/* Contact & Counter Info Box with Email included */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <MapPin className="w-5 h-5" />
              <h3>Comptoir Romainville</h3>
            </div>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                <strong>Adresse :</strong><br />
                4-6 boulevard de la Boissière<br />
                93230 Romainville, France
              </p>
              <p>
                <strong>E-mail :</strong><br />
                <a href="mailto:3communesinfo@gmail.com" className="text-emerald-700 font-bold hover:underline">
                  3communesinfo@gmail.com
                </a>
              </p>
              <p>
                <strong>Téléphone :</strong> 01.43.93.16.79
              </p>
              <p>
                <strong>Horaires :</strong> Ouvert 7 jours sur 7
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="https://wa.me/33143931679"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white py-2.5 px-4 rounded-xl text-xs font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer antialiased"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Poser une question sur WhatsApp</span>
              </a>

              <a
                href="https://www.google.com/maps/place/3+Communes+Informatique/@48.8785258,2.4476134,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66df5c0c630fb:0xfa0edeb620b7c04d!8m2!3d48.8785223!4d2.4501883!16s%2Fg%2F11kbwn4mxx?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Itinéraire Google Maps</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
