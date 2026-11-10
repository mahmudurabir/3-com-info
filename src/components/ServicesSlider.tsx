import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveTab, ServiceSlideItem } from '../types';
import { 
  ArrowLeftRight, 
  ShoppingBag, 
  Wrench, 
  Copy, 
  FileCheck2, 
  Wifi, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ServicesSliderProps {
  setActiveTab: (tab: ActiveTab) => void;
  slides?: ServiceSlideItem[];
}

interface ServiceSlide {
  id: string;
  number: string;
  title: string;
  tagline: string;
  tag: string;
  description: string;
  highlights: string[];
  image: string;
  actionText: string;
  actionTab: ActiveTab;
  icon: React.ReactNode;
}

const SERVICES_SLIDES: ServiceSlide[] = [
  {
    id: 'money',
    number: '01',
    title: "Transfert d'argent partout dans le monde",
    tagline: "Western Union, Ria, MoneyGram, Ding, Orange Money et Joxko",
    tag: "Western Union • Ria • MoneyGram",
    description: "Envoyez de l'argent partout dans le monde avec taux de change direct. Western Union, Ria, MoneyGram, Ding, Orange Money et Joxko au comptoir.",
    highlights: [
      "Taux de change en direct Google / Interbancaire",
      "Retrait espèces immédiat & dépôt bancaire",
      "Reçu officiel et transaction sécurisée"
    ],
    image: "/assets/aistudio/slide-1-transfert-argent_2eaa4866.png",
    actionText: "Simuler un envoi d'argent",
    actionTab: 'money',
    icon: <ArrowLeftRight className="w-5 h-5" />
  },
  {
    id: 'phones',
    number: '02',
    title: "Téléphones, informatique et accessoires",
    tagline: "Smartphones neufs et reconditionnés certifiés",
    tag: "Apple • Samsung • Xiaomi • Coques & Verres 9H",
    description: "Smartphones neufs et reconditionnés certifiés, coques antichocs, verres trempés 9H avec pose offerte et chargeurs rapides.",
    highlights: [
      "Garantie magasin de 12 à 24 mois sur les téléphones",
      "Pose de protection écran 9H offerte sur place",
      "Accessoires certifiés et chargeurs GaN rapides"
    ],
    image: "/assets/aistudio/slide-2-telephones-informatique_6bbdcef5.png",
    actionText: "Voir le catalogue produits",
    actionTab: 'accessories',
    icon: <ShoppingBag className="w-5 h-5" />
  },
  {
    id: 'repairs',
    number: '03',
    title: "Votre téléphone réparé, sans attendre",
    tagline: "Réparation express en 30 minutes sans rendez-vous",
    tag: "Atelier SAV Romainville • 30 Minutes",
    description: "Remplacement d'écrans cassés, batteries affaiblies, connecteurs de charge, désoxydation et désimlockage permanent.",
    highlights: [
      "Diagnostic gratuit et réparation sans rendez-vous en 30 min",
      "Pièces détachées rigoureusement testées et garanties",
      "Désimlockage permanent pour tout opérateur dans le monde"
    ],
    image: "/assets/aistudio/slide-3-reparation-express_b234977c.png",
    actionText: "Estimer une réparation",
    actionTab: 'repairs',
    icon: <Wrench className="w-5 h-5" />
  },
  {
    id: 'printing',
    number: '04',
    title: "Copiez, imprimez, numérisez",
    tagline: "Noir et blanc ou couleur haute fidélité",
    tag: "A4 / A3 • Clé USB • E-mail • Smartphone",
    description: "Noir et blanc ou couleur haute fidélité, depuis clé USB, e-mail ou smartphone.",
    highlights: [
      "Tarifs transparents : N&B dès 0,15 € / Couleur HD dès 0,40 €",
      "Impression instantanée depuis USB, smartphone ou e-mail",
      "Numérisation HD de documents vers e-mail ou clé USB"
    ],
    image: "/assets/aistudio/slide-4-photocopie-impression_b1477245.png",
    actionText: "Écrivez-nous sur WhatsApp",
    actionTab: 'print',
    icon: <Copy className="w-5 h-5" />
  },
  {
    id: 'lamination',
    number: '05',
    title: "Plastification et fax",
    tagline: "Plastification thermique A4, A3 et cartes",
    tag: "Protection thermique • Fax France & Monde",
    description: "Plastification thermique A4, A3 et cartes. Envoi et réception de fax, France et international.",
    highlights: [
      "Pochettes thermiques rigides imperméables et anti-déchirure",
      "Formats A4, A3, cartes professionnelles et badges",
      "Envoi et réception de télécopies avec accusé officiel"
    ],
    image: "/assets/aistudio/slide-5-plastification-fax_7ff9a156.png",
    actionText: "Écrivez-nous sur WhatsApp",
    actionTab: 'print',
    icon: <FileCheck2 className="w-5 h-5" />
  },
  {
    id: 'cyber',
    number: '06',
    title: "Internet et démarches en ligne",
    tagline: "Ordinateurs en fibre, démarches administratives",
    tag: "Fibre Très Haut Débit • Espace informatique",
    description: "Ordinateurs en fibre, démarches administratives, billets de train et d’avion, CV.",
    highlights: [
      "Fibre très haut débit avec postes individuels calmes",
      "Accompagnement et aide de notre équipe au comptoir",
      "Confidentialité garantie : aucune donnée personnelle conservée"
    ],
    image: "/assets/aistudio/slide-6-internet-demarches_be1360e2.png",
    actionText: "Écrivez-nous sur WhatsApp",
    actionTab: 'services',
    icon: <Wifi className="w-5 h-5" />
  }
];

export const ServicesSlider: React.FC<ServicesSliderProps> = ({ setActiveTab, slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Decreased auto slide change time to 3 seconds as requested
  const SLIDE_INTERVAL_MS = 3000;

  const getIconForTab = (tab: ActiveTab) => {
    switch (tab) {
      case 'money': return <ArrowLeftRight className="w-5 h-5" />;
      case 'accessories': return <ShoppingBag className="w-5 h-5" />;
      case 'repairs': return <Wrench className="w-5 h-5" />;
      case 'print': return <Copy className="w-5 h-5" />;
      case 'services': return <Wifi className="w-5 h-5" />;
      default: return <FileCheck2 className="w-5 h-5" />;
    }
  };

  const sanitizeImageUrl = (url: string | undefined): string => {
    if (!url) return '/assets/aistudio/slide-1-transfert-argent_2eaa4866.png';
    if (url.startsWith('/src/assets/images/')) {
      return url.replace('/src/assets/images/', '/assets/images/');
    }
    // Convert old generic images to the new vector slide banners
    if (url.includes('money_transfer.jpg')) return '/assets/aistudio/slide-1-transfert-argent_2eaa4866.png';
    if (url.includes('phones_accessories.jpg')) return '/assets/aistudio/slide-2-telephones-informatique_6bbdcef5.png';
    if (url.includes('phone_repair.jpg')) return '/assets/aistudio/slide-3-reparation-express_b234977c.png';
    if (url.includes('document_printing.jpg')) return '/assets/aistudio/slide-4-photocopie-impression_b1477245.png';
    if (url.includes('document_lamination.jpg')) return '/assets/aistudio/slide-5-plastification-fax_7ff9a156.png';
    if (url.includes('cyber_internet.jpg')) return '/assets/aistudio/slide-6-internet-demarches_be1360e2.png';
    return url;
  };

  const activeSlidesList = (slides && slides.length > 0 ? slides : SERVICES_SLIDES).map((s, idx) => ({
    ...s,
    image: sanitizeImageUrl(s.image),
    number: s.number || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`),
    highlights: s.highlights || [],
    icon: getIconForTab(s.actionTab)
  }));

  const safeIndex = currentIndex >= activeSlidesList.length ? 0 : currentIndex;
  const currentSlide = activeSlidesList[safeIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlidesList.length);
  }, [activeSlidesList.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlidesList.length) % activeSlidesList.length);
  }, [activeSlidesList.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSlideClick = () => {
    if (currentSlide.actionText.toLowerCase().includes('whatsapp')) {
      const url = `https://wa.me/33758464762?text=${encodeURIComponent(
        `Bonjour 3 Communes Informatique, je vous contacte concernant votre service : ${currentSlide.title}`
      )}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      return;
    }
    setActiveTab(currentSlide.actionTab);
  };

  // Autoplay management (3000ms interval)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, SLIDE_INTERVAL_MS);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide, currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <section className="space-y-4">
      {/* Section Header with Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vitrine Officielle • 3 Communes Informatique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Tous nos services en boutique
          </h2>
        </div>

        {/* Play/Pause & Prev/Next Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-emerald-800 hover:border-emerald-300 transition shadow-2xs cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
            title={isPlaying ? "Mettre en pause le défilement" : "Reprendre le défilement automatique"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Lecture</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={prevSlide}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-emerald-800 hover:border-emerald-300 transition shadow-2xs cursor-pointer"
            title="Service précédent"
            aria-label="Service précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-gray-700 px-1 min-w-[48px] text-center">
            {currentIndex + 1} / {activeSlidesList.length}
          </span>

          <button
            type="button"
            onClick={nextSlide}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-emerald-800 hover:border-emerald-300 transition shadow-2xs cursor-pointer"
            title="Service suivant"
            aria-label="Service suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FULL RESPONSIVE POSTER BANNER (Focus Mode Target) */}
      <div 
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-emerald-300/40 bg-[#163829] group select-none flex flex-col justify-between"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner Graphic display with smooth transition */}
        <div 
          onClick={handleSlideClick}
          className="relative w-full cursor-pointer overflow-hidden aspect-[16/9] sm:aspect-[1920/800] bg-[#1a4332] flex items-center justify-center"
          title={`Cliquer pour accéder au service : ${currentSlide.title}`}
        >
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.title}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain sm:object-cover transition-all duration-500 ease-in-out group-hover:scale-[1.01]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('slide-1-transfert-argent')) {
                target.src = '/assets/aistudio/slide-1-transfert-argent_2eaa4866.png';
              }
            }}
          />

          {/* Discreet Floating Action Pill at top right on hover */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            <span className="bg-black/75 backdrop-blur-md text-white border border-white/25 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
              <span>{currentSlide.actionText}</span>
              {currentSlide.actionText.toLowerCase().includes('whatsapp') ? (
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </span>
          </div>

          {/* Side Chevron Arrows: Placed safely at the far edges so they NEVER block slide text */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer z-20"
            title="Image précédente"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer z-20"
            title="Image suivante"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* BOTTOM CONTROLS & DOTS BAR: Sleek, high-contrast, never blocks slide graphic */}
        <div className="p-3 sm:p-3.5 bg-emerald-950/90 backdrop-blur-md border-t border-emerald-800/60 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center space-x-2 text-xs text-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">{currentSlide.number}</span>
            <span className="text-emerald-400">•</span>
            <span className="truncate max-w-[170px] sm:max-w-md font-semibold text-white">{currentSlide.title}</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {activeSlidesList.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-7 bg-emerald-400 shadow-xs' 
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                title={`Aller à : ${slide.title}`}
                aria-label={`Aller au slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Direct Action button */}
          <button
            type="button"
            onClick={handleSlideClick}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-bold bg-[#3f704d] hover:bg-[#335c3f] text-white px-3.5 py-1.5 rounded-xl border border-emerald-400/40 transition cursor-pointer shadow-xs active:scale-98"
          >
            <span>{currentSlide.actionText}</span>
            {currentSlide.actionText.toLowerCase().includes('whatsapp') ? (
              <ExternalLink className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* USER CHOOSER BAR: Clean Interactive Selector Cards below banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {activeSlidesList.map((slide, idx) => {
          const isSelected = currentIndex === idx;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#3f704d] bg-emerald-50/90 ring-2 ring-[#3f704d]/25 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#3f704d] text-white' : 'bg-emerald-50 text-emerald-800'}`}>
                  {slide.icon}
                </div>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-[#3f704d]' : 'text-gray-400'}`}>
                  {slide.number}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-950 font-extrabold' : 'text-gray-800'}`}>
                  {slide.title}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {slide.tag}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </section>
  );
};
