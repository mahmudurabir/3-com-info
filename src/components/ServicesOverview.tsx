import React from 'react';
import { ActiveTab } from '../types';
import { 
  ArrowLeftRight, 
  Wifi, 
  Smartphone, 
  Wrench, 
  Unlock, 
  ShoppingBag, 
  Copy, 
  Printer, 
  Scan, 
  FileCheck2, 
  PhoneCall, 
  ArrowRight
} from 'lucide-react';

interface ServicesOverviewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ setActiveTab }) => {
  const allServices = [
    {
      title: "Envoi & Retrait d'Argent International",
      description: "Partenaire officiel agréé Western Union, Ria, MoneyGram, Orange Money, Ding et Joxko. Envois rapides et sécurisés vers le monde entier avec taux de change transparents.",
      icon: <ArrowLeftRight className="w-6 h-6" />,
      actionTab: 'money' as ActiveTab,
      actionText: "Simuler un transfert d'argent",
      tag: "Western Union & Ria"
    },
    {
      title: "Espace Cyber & Postes Internet",
      description: "Postes informatiques équipés de la fibre très haut débit pour vos démarches administratives (CAF, Ameli, ANTS), réservations de billets, CV et navigation web.",
      icon: <Wifi className="w-6 h-6" />,
      actionTab: 'services' as ActiveTab,
      actionText: "Postes internet en libre accès",
      tag: "Fibre Très Haut Débit"
    },
    {
      title: "Vente de Téléphones (Neufs & Reconditionnés)",
      description: "Large sélection d'Apple iPhone, Samsung Galaxy, Xiaomi et téléphones à touches classiques, rigoureusement testés, désimlockés tout opérateur et garantis.",
      icon: <Smartphone className="w-6 h-6" />,
      actionTab: 'accessories' as ActiveTab,
      actionText: "Voir les téléphones disponibles",
      tag: "Garantie 12/24 Mois"
    },
    {
      title: "Réparation Express Téléphones & PC",
      description: "Remplacement d'écran, batterie, connecteur de charge, micros/haut-parleurs et désoxydation liquide réalisés sur place en 30 minutes avec des pièces certifiées.",
      icon: <Wrench className="w-6 h-6" />,
      actionTab: 'repairs' as ActiveTab,
      actionText: "Estimer ma réparation",
      tag: "Prise en charge 30 min"
    },
    {
      title: "Déblocage & Désimlockage Réseau",
      description: "Désimlockage officiel et définitif de votre smartphone pour l'utiliser avec n'importe quelle carte SIM (Orange, SFR, Bouygues, Free ou opérateurs étrangers).",
      icon: <Unlock className="w-6 h-6" />,
      actionTab: 'repairs' as ActiveTab,
      actionText: "Tarifs de déblocage",
      tag: "Définitif & Garanti"
    },
    {
      title: "Accessoires Mobiles & Équipements Audio",
      description: "Chargeurs rapides GaN, câbles renforcés tressés, écouteurs sans fil, enceintes Bluetooth, coques antichocs et pose gratuite de verre trempé 9H.",
      icon: <ShoppingBag className="w-6 h-6" />,
      actionTab: 'accessories' as ActiveTab,
      actionText: "Découvrir les accessoires",
      tag: "Pose de verre offerte"
    },
    {
      title: "Photocopies Noir & Blanc et Couleur",
      description: "Reprographie haute résolution en noir & blanc ou couleur éclatante, recto-verso automatique, formats standard A4 et grand format A3 sur papier de qualité.",
      icon: <Copy className="w-6 h-6" />,
      actionTab: 'print' as ActiveTab,
      actionText: "Consulter les tarifs photocopie",
      tag: "Dès 0,15 €"
    },
    {
      title: "Impression de Documents & Rapports",
      description: "Imprimez vos fichiers PDF, contrats Word, CV, thèses et mémoires directement depuis une clé USB, un smartphone ou par e-mail à 3communesinfo@gmail.com.",
      icon: <Printer className="w-6 h-6" />,
      actionTab: 'print' as ActiveTab,
      actionText: "Calculer le prix d'impression",
      tag: "Tirage immédiat"
    },
    {
      title: "Numérisation HD de Documents (Scanner)",
      description: "Numérisation rapide de dossiers administratifs, pièces d'identité, passeports et diplômes directement vers votre boîte e-mail ou sur clé USB.",
      icon: <Scan className="w-6 h-6" />,
      actionTab: 'print' as ActiveTab,
      actionText: "Numériser des documents",
      tag: "Envoi direct par e-mail"
    },
    {
      title: "Envoi de Fax & Plastification de Documents",
      description: "Envois et réceptions de télécopies en France et à l'international avec accusé. Plastification thermique protectrice A4 et A3 pour préserver durablement vos documents.",
      icon: <FileCheck2 className="w-6 h-6" />,
      actionTab: 'print' as ActiveTab,
      actionText: "Options de plastification & fax",
      tag: "Formats A4 & A3"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header: Soft light green gradient */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/70 text-gray-900 rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <span>3 COMMUNES INFORMATIQUE</span>
            <span>•</span>
            <span>Romainville 93230</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Tous vos services numériques & transferts au même endroit
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Dans notre boutique au 4-6 boulevard de la Boissière à Romainville, nous vous accueillons avec écoute, réactivité et des tarifs clairs et transparents.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allServices.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  {service.icon}
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                  {service.tag}
                </span>
              </div>

              <h2 className="text-base font-bold text-gray-900 leading-snug">
                {service.title}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100">
              <button
                onClick={() => setActiveTab(service.actionTab)}
                className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{service.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* In-Store Callout Banner */}
      <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-emerald-950">
            Une question sur une démarche ou un service ?
          </h3>
          <p className="text-xs text-emerald-800">
            Notre équipe vous accueille et vous accompagne au comptoir à Romainville 7 jours sur 7.
          </p>
        </div>

        <a
          href="tel:0143931679"
          className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Appeler le 01.43.93.16.79</span>
        </a>
      </div>

    </div>
  );
};
