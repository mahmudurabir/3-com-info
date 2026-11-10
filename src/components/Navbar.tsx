import React, { useState } from 'react';
import { ActiveTab, StoreSettings } from '../types';
import { 
  Phone, 
  MapPin, 
  Menu, 
  X, 
  Home as HomeIcon,
  ArrowLeftRight, 
  ShoppingBag, 
  Printer, 
  Wrench, 
  Layers,
  ShieldCheck
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { AdminAccount } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBackend: () => void;
  productsCount: number;
  storeSettings?: StoreSettings;
  currentUser?: AdminAccount | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBackend,
  storeSettings,
  currentUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; isHome?: boolean }[] = [
    { 
      id: 'home', 
      label: 'Accueil', 
      icon: <HomeIcon className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
      isHome: true 
    },
    { 
      id: 'money', 
      label: 'Transfert d\'argent', 
      icon: <ArrowLeftRight className="w-4 h-4 shrink-0" strokeWidth={2} /> 
    },
    { 
      id: 'accessories', 
      label: 'Catalogue & Produits', 
      icon: <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={2} /> 
    },
    { 
      id: 'print', 
      label: 'Impression & Photocopie', 
      icon: <Printer className="w-4 h-4 shrink-0" strokeWidth={2} /> 
    },
    { 
      id: 'repairs', 
      label: 'Réparation & Déblocage', 
      icon: <Wrench className="w-4 h-4 shrink-0" strokeWidth={2} /> 
    },
    { 
      id: 'services', 
      label: 'Tous les services', 
      icon: <Layers className="w-4 h-4 shrink-0" strokeWidth={2} /> 
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phoneClean = (storeSettings?.phone || '0143931679').replace(/[^0-9+]/g, '');
  const whatsappClean = (storeSettings?.whatsapp || '33758464762').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100">
      
      {/* Top Bar */}
      <div className="bg-emerald-50/90 text-emerald-950 text-xs py-2 px-3 sm:px-6 border-b border-emerald-100/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Status & Address */}
          <div className="flex items-center space-x-3 overflow-hidden text-[11px] sm:text-xs">
            <span className="flex items-center space-x-1.5 bg-emerald-100/90 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{storeSettings?.openingHours || 'Ouvert 7j/7'}</span>
            </span>
            <span className="text-emerald-300 hidden md:inline">|</span>
            <a 
              href="https://maps.google.com/?q=4-6+boulevard+de+la+Boissiere+93230+Romainville" 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 transition truncate max-w-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">{storeSettings?.streetAddress || '4-6 bd de la Boissiere'}, {storeSettings?.cityZip || '93230 Romainville'}</span>
            </a>
          </div>

          {/* Contact Direct & WhatsApp Action (Razor-sharp vector icon, no blur) */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs ml-auto">
            {/* Phone */}
            <a 
              href={`tel:${phoneClean}`} 
              className="flex items-center space-x-1 text-emerald-900 hover:text-emerald-700 font-medium px-2 py-1 rounded-lg hover:bg-emerald-100/60 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{storeSettings?.phone || '01.43.93.16.79'}</span>
            </a>

            {/* Admin Active Session Indicator (persists across refresh & pages) */}
            {currentUser && (
              <button
                type="button"
                onClick={onOpenBackend}
                className="inline-flex items-center space-x-1.5 bg-emerald-950 text-white hover:bg-emerald-900 border border-emerald-700/60 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs cursor-pointer transition animate-in fade-in"
                title={`Session active : ${currentUser.name} (${currentUser.role}) - Cliquer pour ouvrir le panneau d'administration`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{currentUser.name}</span>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full font-semibold">
                  {currentUser.role}
                </span>
              </button>
            )}

            {/* WhatsApp Button: Crystal clear, crisp edges, no blurry rasterization */}
            <a 
              href={`https://wa.me/${whatsappClean}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 bg-[#3f704d] hover:bg-[#335c3f] active:bg-[#2d4f36] text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition border border-[#3f704d] cursor-pointer antialiased select-none"
              style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo and Brand Title - Scaled responsively for flawless mobile display */}
          <div className="flex items-center min-w-0 pr-2">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 sm:space-x-3.5 cursor-pointer group min-w-0 select-none"
            >
              <img 
                src="/assets/logo.svg" 
                alt="3 Communes Informatique" 
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200" 
              />

              {/* Refined Responsive Typography for 3 Communes Informatique - Never clips on mobile */}
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-baseline space-x-1 sm:space-x-1.5 leading-none">
                  <span className="font-semibold text-base sm:text-xl md:text-2xl tracking-tight text-emerald-800 group-hover:text-emerald-900 transition-colors whitespace-nowrap">
                    3 Communes
                  </span>
                  <span className="font-normal text-xs sm:text-base md:text-lg tracking-normal text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                    Informatique
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-normal tracking-[0.14em] sm:tracking-[0.16em] text-emerald-700/80 uppercase mt-0.5 whitespace-nowrap">
                  Paris • Romainville
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              
              if (item.isHome) {
                // High-End, Premium Home Button (crisp vector icon, sleek border & typography)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick('home')}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#3f704d] text-white font-semibold ring-1 ring-[#3f704d]/30'
                        : 'bg-white text-gray-700 hover:text-emerald-900 hover:bg-emerald-50/70 border border-emerald-200/80 font-medium'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-emerald-700'}>
                      {item.icon}
                    </span>
                    <span>Accueil</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#3f704d] text-white font-semibold ring-1 ring-[#3f704d]/30'
                      : 'bg-white text-gray-700 hover:text-emerald-900 hover:bg-emerald-50/70 border border-emerald-200/80 font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-emerald-700'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu & Refined Home Button */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 xl:hidden shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className={`hidden sm:flex px-3 py-1.5 rounded-xl text-xs transition items-center space-x-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#3f704d] text-white font-semibold'
                  : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50 font-medium'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 focus:outline-none cursor-pointer flex items-center space-x-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="text-[11px] font-semibold text-emerald-900 sm:hidden pr-0.5">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#3f704d] text-white font-semibold'
                      : 'bg-emerald-50/60 text-gray-800 hover:bg-emerald-100/70 border border-emerald-200/80 font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-emerald-700'}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Quick Contacts */}
          <div className="pt-3 border-t border-emerald-100 grid grid-cols-2 gap-2 text-xs">
            <a
              href="tel:0143931679"
              className="flex items-center justify-center space-x-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 py-2.5 rounded-xl font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>01.43.93.16.79</span>
            </a>
            <a
              href="https://wa.me/33758464762"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-1.5 bg-[#3f704d] hover:bg-[#335c3f] text-white py-2.5 rounded-xl font-medium antialiased"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
