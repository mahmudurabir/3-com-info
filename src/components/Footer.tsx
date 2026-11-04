import React from 'react';
import { ActiveTab } from '../types';
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBackend: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenBackend }) => {
  return (
    <footer className="bg-emerald-950 text-white mt-16 border-t border-emerald-900">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Identity & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5">
              <img 
                src="/assets/aistudio/Green_Circle_3L_Gear_Emblem_2d47f1de.png" 
                alt="3 Communes Informatique" 
                className="w-12 h-12 object-contain shrink-0" 
              />
              <div className="flex flex-col">
                <span className="font-semibold text-xl tracking-tight text-emerald-400 leading-none">
                  3 Communes
                </span>
                <span className="font-normal text-xs tracking-wider text-emerald-200 uppercase mt-1">
                  Informatique
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Votre espace numérique et de communication de proximité à Romainville (93230) pour le transfert d'argent international, la vente & réparation de smartphones, le dépannage informatique, la reprographie, l'impression et les démarches administratives.
            </p>

            <div className="text-xs text-emerald-300 font-semibold flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Agent Agréé : Western Union, Ria, MoneyGram</span>
            </div>
          </div>

          {/* Col 2: In-Store Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Services en Boutique
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100">
              <li>
                <button 
                  onClick={() => setActiveTab('money')} 
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Transfert d'argent (Western Union, Ria, MoneyGram)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('money')} 
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Recharges mobiles (Orange, SFR, Bouygues, Free, Ding)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('accessories')} 
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Téléphones, ordinateurs, enceintes & écouteurs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('repairs')} 
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Réparation d'écran & batterie en 30 minutes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('repairs')} 
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Déblocage réseau tout opérateur
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('print')} 
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Photocopies, tirages & numérisation de documents
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('print')} 
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Plastification thermique & envoi de fax
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordinates & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Informations Boutique
            </h4>
            
            <div className="space-y-2.5 text-xs text-emerald-100">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>3 COMMUNES INFORMATIQUE</strong><br />
                  4-6 boulevard de la Boissière<br />
                  93230 Romainville, France
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:0143931679" className="hover:text-white font-bold">
                  01.43.93.16.79
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="https://wa.me/33143931679" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white font-medium"
                >
                  WhatsApp : 01.43.93.16.79
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:3communesinfo@gmail.com" className="hover:text-white">
                  3communesinfo@gmail.com
                </a>
              </div>

              <div className="pt-2 border-t border-emerald-900 text-[11px] text-emerald-300">
                Ouvert 7 jours sur 7. Accès sans rendez-vous pour l'ensemble des services.
              </div>
            </div>
          </div>

          {/* Col 4: Location & Transit Map */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Accès & Transports
            </h4>

            <div className="p-3.5 bg-emerald-900/60 rounded-2xl border border-emerald-800 text-xs text-emerald-200 space-y-2">
              <p>
                <strong>Bus :</strong> Lignes 129, 318, 105 (Arrêt : Boissière / 3 Communes).
              </p>
              <p>
                <strong>Métro :</strong> Ligne 11 (Romainville - Carnot / Mairie des Lilas).
              </p>
              <p>
                <strong>Stationnement :</strong> Arrêt minute et places de stationnement devant la boutique.
              </p>

              <a
                href="https://www.google.com/maps/place/3+Communes+Informatique/@48.8785258,2.4476134,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66df5c0c630fb:0xfa0edeb620b7c04d!8m2!3d48.8785223!4d2.4501883!16s%2Fg%2F11kbwn4mxx?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-white bg-[#3f704d] hover:bg-[#335c3f] px-3.5 py-2 rounded-xl font-bold transition text-xs shadow-xs cursor-pointer"
              >
                <span>Ouvrir dans Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenBackend}
                className="text-[11px] text-emerald-400 hover:text-emerald-200 underline font-medium cursor-pointer"
              >
                Espace Gestion & Administration
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300 gap-3">
          <div>
            © {new Date().getFullYear()} <strong>3 COMMUNES INFORMATIQUE</strong>. Tous droits réservés.
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>4-6 bd de la Boissière, 93230 Romainville</span>
            <span>•</span>
            <span>01.43.93.16.79</span>
            <span>•</span>
            <span>3communesinfo@gmail.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
