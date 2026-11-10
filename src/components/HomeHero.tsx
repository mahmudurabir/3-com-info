import React, { useState } from 'react';
import { ActiveTab, StoreSettings, ServiceSlideItem } from '../types';
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
  Send,
  PackagePlus
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ServicesSlider } from './ServicesSlider';

interface HomeHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBackend: () => void;
  onRequestProduct?: (initialQuery?: string, initialCategory?: string) => void;
  slides?: ServiceSlideItem[];
  storeSettings?: StoreSettings;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ 
  setActiveTab, 
  onRequestProduct,
  slides,
  storeSettings 
}) => {
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
            <div className="inline-flex items-center flex-wrap gap-1.5 sm:gap-2 bg-emerald-50 text-emerald-900 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-normal border border-emerald-200 max-w-full">
              <img 
                src="/assets/logo.svg" 
                alt="3 Communes Informatique" 
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain shrink-0" 
              />
              <span className="font-semibold text-emerald-900">3 Communes Informatique</span>
              <span className="text-emerald-400 hidden xs:inline">•</span>
              <span className="text-gray-600 font-normal">Romainville (Paris)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Votre Espace Multimédia, Transfert d'Argent, Réparation & déblocage à Romainville
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
                onClick={() => onRequestProduct && onRequestProduct()}
                className="bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-950 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm border border-emerald-300/80 transition flex items-center space-x-2 active:scale-95 cursor-pointer shadow-xs"
              >
                <PackagePlus className="w-4 h-4 text-emerald-800" />
                <span>Demander un nouveau produit</span>
              </button>

              <button
                onClick={() => setActiveTab('money')}
                className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm border border-emerald-300 transition flex items-center space-x-2 active:scale-95 cursor-pointer shadow-xs"
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
                {storeSettings?.openingHours || 'Ouvert 7 jours sur 7'}
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900">Address:</strong><br />
                  {storeSettings?.streetAddress || '4-6 boulevard de la Boissiere'}<br />
                  {storeSettings?.cityZip || '93230 Romainville'} (France)
                </div>
              </div>

              {/* Mail Address explicitly added in Store Location as requested */}
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-gray-900">Email:</strong><br />
                  <a href={`mailto:${storeSettings?.email || '3communesinfo@gmail.com'}`} className="text-emerald-700 hover:text-emerald-900 font-bold underline">
                    {storeSettings?.email || '3communesinfo@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-gray-900">Phone:</strong><br />
                  <a href={`tel:${(storeSettings?.phone || '0143931679').replace(/[^0-9+]/g, '')}`} className="text-emerald-700 hover:text-emerald-900 font-bold underline">
                    {storeSettings?.phone || '01.43.93.16.79'}
                  </a>
                </div>
              </div>

              {/* WhatsApp direct connection - Sharp vector icon */}
              <div className="flex items-center space-x-2.5">
                <WhatsAppIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-gray-900">WhatsApp:</strong><br />
                  <a 
                    href={`https://wa.me/${(storeSettings?.whatsapp || '33758464762').replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    {storeSettings?.whatsapp || '+33 7 58 46 47 62'}
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

      {/* 6 Key Core Service Entry Interactive Auto-Slider */}
      <ServicesSlider setActiveTab={setActiveTab} slides={slides} />

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

      {/* SECTION: DEMANDE DE NOUVEAU PRODUIT, COMMANDE SPÉCIALE & CONTACT */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
              <PackagePlus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Commande spéciale & Recherche de produit</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              Demander un nouveau produit <span className="font-medium text-emerald-900">ou commander une référence</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              Vous recherchez un smartphone particulier, un accessoire spécifique, une pièce ou un composant informatique introuvable ? Demandez-le nous : nous pouvons commander sous 24h à 48h ou vérifier notre arrivage en direct !
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onRequestProduct && onRequestProduct()}
              className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-semibold py-2.5 px-5 rounded-2xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-2 cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Demander un produit</span>
            </button>
            <a
              href="https://wa.me/33758464762?text=Bonjour%203%20Communes%20Informatique%2C%20je%20recherche%20un%20produit%20sp%C3%A9cifique%20%3A"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold py-2.5 px-4 rounded-2xl text-xs sm:text-sm border border-emerald-200 transition flex items-center space-x-2 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Demande WhatsApp</span>
            </a>
          </div>
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
                href="https://wa.me/33758464762" 
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

        {/* Quick Product Inquiry & Message Form */}
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
          <div className="flex items-center space-x-2">
            <PackagePlus className="w-4 h-4 text-emerald-800" />
            <h3 className="font-semibold text-sm text-gray-800">
              Formulaire rapide de demande de produit ou d'information
            </h3>
          </div>

          <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Votre nom complet"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Votre numéro (tél / WhatsApp) ou e-mail"
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] focus:outline-none"
              />
            </div>
            <textarea
              rows={3}
              required
              placeholder="Quel produit ou modèle recherchez-vous ? (ex. iPhone 16 Pro Max 256 Go, Écran Samsung A54, Coque hydrogel découpable, Chargeur PC portable Lenovo 65W...)"
              value={inquiryMsg}
              onChange={(e) => setInquiryMsg(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] focus:outline-none resize-none"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {sentSuccess ? (
                <div className="text-xs text-emerald-800 font-medium flex items-center space-x-1.5 bg-emerald-100 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Demande de produit bien reçue ! Nous vérifions la disponibilité et vous répondons sous peu.</span>
                </div>
              ) : (
                <span className="text-[11px] text-gray-500">
                  Réponse rapide par WhatsApp, téléphone ou e-mail. Retrait direct au 4-6 bd de la Boissière.
                </span>
              )}

              {/* Button color #3f704d, strictly NO emoji */}
              <button
                type="submit"
                className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-semibold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center space-x-1.5 cursor-pointer shrink-0 ml-auto"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer ma demande de produit</span>
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
};
