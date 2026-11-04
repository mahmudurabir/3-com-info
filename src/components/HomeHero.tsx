import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  ArrowRight, 
  ArrowLeftRight, 
  ShoppingBag, 
  Printer, 
  Wrench, 
  Wifi, 
  PhoneCall, 
  MapPin, 
  FileCheck2,
  Copy,
  Mail,
  CheckCircle2,
  Send
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HomeHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBackend: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ setActiveTab }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const partners = [
    'Western Union',
    'Ria',
    'MoneyGram',
    'Ding',
    'Orange Money',
    'Joxko'
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Hero Welcome Card: Light, clean, refined styling matching base white */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/60 rounded-3xl p-6 sm:p-10 lg:p-12 border border-emerald-200/90 shadow-sm relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-8 space-y-5">
            {/* Business Badge with Logo - Refined non-bold styling */}
            <div className="inline-flex items-center space-x-2.5 bg-emerald-50 text-emerald-900 px-3.5 py-1.5 rounded-full text-xs font-normal border border-emerald-200">
              <img 
                src="/assets/aistudio/Green_Circle_3L_Gear_Emblem_2d47f1de.png" 
                alt="3 Communes Informatique" 
                className="w-5 h-5 object-contain shrink-0" 
              />
              <span className="font-medium text-emerald-900">3 Communes Informatique</span>
              <span className="text-emerald-400">•</span>
              <span className="text-gray-600 font-normal">Romainville (Paris)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Votre Espace Multimédia, Transfert d'Argent & Impression à Romainville.
            </h1>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Situé au 4-6 boulevard de la Boissière à Romainville, retrouvez tous vos services numériques et de communication réunis au même endroit : 
              <strong className="text-emerald-800"> envoi & réception d'argent</strong>, 
              <strong className="text-emerald-800"> vente & réparation de téléphones</strong>, 
              <strong className="text-emerald-800"> déblocage tout opérateur</strong>, 
              <strong className="text-emerald-800"> photocopie, impression HD, scan, fax & plastification</strong>, ainsi que nos 
              <strong className="text-emerald-800"> postes informatiques avec accès internet fibre</strong>.
            </p>

            {/* Quick Action Navigation Buttons (Slightly Green, strictly NO emojis in buttons) */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('accessories')}
                className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-sm transition flex items-center space-x-2 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Consulter le catalogue produits</span>
              </button>

              <button
                onClick={() => setActiveTab('money')}
                className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm border border-emerald-300 transition flex items-center space-x-2 active:scale-95 cursor-pointer shadow-xs"
              >
                <ArrowLeftRight className="w-4 h-4 text-emerald-700" />
                <span>Envoyer & recevoir de l'argent</span>
              </button>

              <button
                onClick={() => setActiveTab('print')}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-semibold px-4 py-3 rounded-2xl text-xs sm:text-sm border border-emerald-200 transition flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>Impression & démarches</span>
              </button>
            </div>

            {/* Partners Ribbon */}
            <div className="pt-4 border-t border-emerald-100 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
                Partenaires officiels transfert d'argent :
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {partners.map(p => (
                  <span key={p} className="bg-white text-emerald-950 px-3 py-1 rounded-xl border border-emerald-200 font-semibold shadow-xs">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Clean White & Soft Green In-Store Card with Email and Visible Map Preview */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Notre Boutique
              </span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ouvert 7 jours sur 7
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Address:</strong><br />
                  4-6 boulevard de la Boissiere<br />
                  93230 Romainville (France)
                </div>
              </div>

              {/* Mail Address explicitly added in Store Location as requested */}
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-gray-900">Email:</strong><br />
                  <a href="mailto:3communesinfo@gmail.com" className="text-emerald-700 hover:text-emerald-900 font-bold underline">
                    3communesinfo@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-gray-900">Phone:</strong><br />
                  <a href="tel:0143931679" className="text-emerald-700 hover:text-emerald-900 font-bold underline">
                    01.43.93.16.79
                  </a>
                </div>
              </div>

              {/* WhatsApp direct connection - Sharp vector icon */}
              <div className="flex items-center space-x-2.5">
                <WhatsAppIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-gray-900">WhatsApp:</strong><br />
                  <a 
                    href="https://wa.me/33143931679" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    01.43.93.16.79
                  </a>
                </div>
              </div>

              {/* Visible Google Map mini-frame */}
              <div className="rounded-xl overflow-hidden border border-emerald-200 shadow-xs h-36 relative mt-2">
                <iframe
                  title="3 Communes Informatique Google Map"
                  src="https://maps.google.com/maps?q=3+Communes+Informatique,+4-6+boulevard+de+la+Boissiere,+93230+Romainville&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="pt-1 text-[11px] text-gray-500">
                Lignes de bus à proximité : 129, 318, 105. Stationnement dépose-minute devant la boutique.
              </div>
            </div>

            <a
              href="https://www.google.com/maps/place/3+Communes+Informatique/@48.8785258,2.4476134,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66df5c0c630fb:0xfa0edeb620b7c04d!8m2!3d48.8785223!4d2.4501883!16s%2Fg%2F11kbwn4mxx?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Ouvrir dans Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>

      {/* 6 Key Core Service Entry Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Tous nos services en boutique
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Accueil et comptoir sans rendez-vous
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Money Transfer */}
          <div
            onClick={() => setActiveTab('money')}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition duration-200">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition">
                Transfert d'argent & recharges mobiles
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Western Union, Ria, MoneyGram, Ding, Orange Money et Joxko. Envois d'argent sécurisés vers le monde entier avec taux de change en direct.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Simuler un envoi d'argent</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Accessories & High-Tech */}
          <div
            onClick={() => setActiveTab('accessories')}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition duration-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition">
                Téléphones, Informatique & Accessoires du Quotidien
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Smartphones neufs et reconditionnés certifiés (iPhone, Galaxy, Xiaomi), coques & verres trempés 9H, chargeurs rapides, audio sans fil, informatique, outils et papeterie.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Voir le catalogue produits</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Repairs & Unlocking */}
          <div
            onClick={() => setActiveTab('repairs')}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition duration-200">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition">
                Réparation express & déblocage réseau
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Remplacement d'écrans cassés, batteries, connecteurs de charge, désoxydation après chute dans l'eau et désimlockage permanent tout opérateur.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Estimer une réparation</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Printing & Photocopying */}
          <div
            onClick={() => setActiveTab('print')}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition duration-200">
                <Copy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition">
                Photocopie, impression & numérisation
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Copies noir & blanc et couleur haute fidélité. Impression de vos dossiers, CV et contrats directement depuis clé USB, e-mail ou smartphone.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Simulateur de tarifs d'impression</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Lamination & Fax */}
          <div
            onClick={() => setActiveTab('print')}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition duration-200">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition">
                Plastification de documents & fax
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Plastification thermique rigide pour formats A4, A3 et cartes. Envoi et réception de fax en France et à l'international avec reçu de confirmation.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Découvrir la plastification</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Internet & Cyber Space */}
          <div
            onClick={() => setActiveTab('services')}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition duration-200">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-800 transition">
                Postes internet & démarches en ligne
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ordinateurs connectés à la fibre très haut débit. Vos démarches administratives, réservations de billets de train/avion, CV et démarches en ligne.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Voir tous nos services</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* VISIBLE GOOGLE MAP SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
          <div>
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              Plan interactif & itinéraire
            </span>
            <h2 className="text-xl sm:text-2xl font-normal text-gray-800 mt-0.5">
              Trouver <span className="font-medium text-emerald-900">3 Communes Informatique</span> à Romainville
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              4-6 boulevard de la Boissière, 93230 Romainville • En face de l'arrêt de bus Boissière / 3 Communes
            </p>
          </div>

          <a
            href="https://www.google.com/maps/place/3+Communes+Informatique/@48.8785258,2.4476134,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66df5c0c630fb:0xfa0edeb620b7c04d!8m2!3d48.8785223!4d2.4501883!16s%2Fg%2F11kbwn4mxx?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noreferrer"
            className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-medium py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Ouvrir dans Google Maps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Visible interactive responsive map iframe */}
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-emerald-200 shadow-xs relative">
          <iframe
            title="3 Communes Informatique Location Map"
            src="https://maps.google.com/maps?q=3+Communes+Informatique,+4-6+boulevard+de+la+Boissiere,+93230+Romainville&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 pt-1">
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <strong className="text-gray-900 block mb-0.5">En Bus</strong>
            Lignes 129, 318, 105 jusqu'à l'arrêt « Boissière / 3 Communes » (moins d'1 minute à pied).
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <strong className="text-gray-900 block mb-0.5">En Métro</strong>
            Ligne 11 stations : Romainville - Carnot ou Mairie des Lilas.
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <strong className="text-gray-900 block mb-0.5">Stationnement</strong>
            Emplacement dépose-minute gratuit disponible directement devant la devanture.
          </div>
        </div>
      </section>

      {/* LAST SECTION OF HOME: EMAIL & CONTACT DETAILS */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
          <div>
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              Contact direct & renseignements clients
            </span>
            <h2 className="text-xl sm:text-2xl font-normal text-gray-800 mt-1">
              Contactez <span className="font-medium text-emerald-900">3 Communes Informatique</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Une question sur un transfert d'argent, une impression ou un tarif de réparation ? Contactez-nous par e-mail, téléphone ou WhatsApp.
            </p>
          </div>

          <a
            href="mailto:3communesinfo@gmail.com"
            className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-medium py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Envoyer un e-mail</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Email Info Card */}
          <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Mail className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail officiel de la boutique</div>
            <a 
              href="mailto:3communesinfo@gmail.com" 
              className="text-base font-semibold text-emerald-900 hover:underline block break-all"
            >
              3communesinfo@gmail.com
            </a>
            <p className="text-[11px] text-gray-500">
              Envoyez-nous vos fichiers à imprimer ou vos demandes de devis à tout moment.
            </p>
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone direct & WhatsApp</div>
            <div className="text-base font-semibold text-emerald-900">
              <a href="tel:0143931679" className="hover:underline">01.43.93.16.79</a>
            </div>
            <div className="pt-1">
              <a 
                href="https://wa.me/33143931679" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-white bg-[#3f704d] hover:bg-[#335c3f] font-medium px-3.5 py-1.5 rounded-lg border border-[#3f704d] transition antialiased cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Message sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Address & Store Visit Card */}
          <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse du magasin</div>
            <div className="text-sm font-medium text-gray-900 leading-snug">
              4-6 boulevard de la Boissière<br />
              93230 Romainville, France
            </div>
            <p className="text-[11px] text-gray-500">
              Ouvert 7 jours sur 7. Stationnement dépose-minute gratuit disponible.
            </p>
          </div>

        </div>

        {/* Quick Message Form */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-medium text-sm text-gray-800">
            Envoyez un message direct à l'équipe de Romainville
          </h3>

          <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Votre nom complet"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Votre adresse e-mail"
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] focus:outline-none"
              />
            </div>
            <textarea
              rows={3}
              required
              placeholder="Comment pouvons-nous vous aider ? (ex. impression de documents, devis écran de smartphone, envoi Western Union...)"
              value={inquiryMsg}
              onChange={(e) => setInquiryMsg(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] focus:outline-none"
            />

            <div className="flex items-center justify-between">
              {sentSuccess ? (
                <div className="text-xs text-emerald-800 font-medium flex items-center space-x-1.5 bg-emerald-100 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Message bien envoyé ! Nous vous répondrons dans les plus brefs délais.</span>
                </div>
              ) : <div></div>}

              {/* Button color #3f704d, strictly NO emoji */}
              <button
                type="submit"
                className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-medium py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-1.5 cursor-pointer ml-auto"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
};
