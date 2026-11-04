import React, { useState } from 'react';
import { ActiveTab } from '../types';
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
  Layers
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBackend: () => void;
  productsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100">
      
      {/* Top Bar */}
      <div className="bg-emerald-50/90 text-emerald-950 text-xs py-2 px-3 sm:px-6 border-b border-emerald-100/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Status & Address */}
          <div className="flex items-center space-x-3 overflow-hidden text-[11px] sm:text-xs">
            <span className="flex items-center space-x-1.5 bg-emerald-100/90 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Ouvert 7j/7</span>
            </span>
            <span className="text-emerald-300 hidden md:inline">|</span>
            <a 
              href="https://maps.google.com/?q=4-6+boulevard+de+la+Boissiere+93230+Romainville" 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 transition truncate max-w-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">4-6 bd de la Boissiere, 93230 Romainville</span>
            </a>
          </div>

          {/* Contact Direct & WhatsApp Action (Razor-sharp vector icon, no blur) */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs ml-auto">
            {/* Phone */}
            <a 
              href="tel:0143931679" 
              className="flex items-center space-x-1 text-emerald-900 hover:text-emerald-700 font-medium px-2 py-1 rounded-lg hover:bg-emerald-100/60 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>01.43.93.16.79</span>
            </a>

            {/* WhatsApp Button: Crystal clear, crisp edges, no blurry rasterization */}
            <a 
              href="https://wa.me/33143931679" 
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and Brand Title - Refined typography (3 Communes font weight balanced, not bold) */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3.5 cursor-pointer group"
            >
              <img 
                src="/assets/aistudio/Green_Circle_3L_Gear_Emblem_2d47f1de.png" 
                alt="3 Communes Informatique" 
                className="w-12 h-12 object-contain shrink-0 group-hover:scale-105 transition-transform duration-200" 
              />

              {/* Refined Typography for 3 Communes Informatique - Elegant and light/medium */}
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-medium text-xl sm:text-2xl tracking-tight text-emerald-800 group-hover:text-emerald-900 transition-colors leading-none">
                    3 Communes
                  </span>
                  <span className="font-normal text-base sm:text-lg tracking-normal text-gray-700 group-hover:text-gray-900 transition-colors leading-none">
                    Informatique
                  </span>
                </div>
                <span className="text-[10px] font-normal tracking-[0.16em] text-emerald-700/80 uppercase mt-1">
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
          <div className="flex items-center space-x-2 xl:hidden">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1.5 cursor-pointer ${
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
              className="p-2 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              href="https://wa.me/33143931679"
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
