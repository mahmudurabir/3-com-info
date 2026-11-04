import React, { useState } from 'react';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Smartphone, 
  Laptop, 
  Volume2, 
  Headphones, 
  Zap, 
  Shield, 
  HardDrive, 
  Tag, 
  Check, 
  SlidersHorizontal,
  Eye,
  Wrench,
  Package,
  Printer
} from 'lucide-react';

interface AccessoriesCatalogProps {
  products: Product[];
  categories?: string[];
  onSelectProduct?: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
  onOpenBackend: () => void;
}

const KNOWN_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  // New French categories
  'Téléphones mobiles': <Smartphone className="w-4 h-4" />,
  'Coques & Protections': <Shield className="w-4 h-4" />,
  'Chargeurs & Câbles': <Zap className="w-4 h-4" />,
  'Audio & Connecté': <Headphones className="w-4 h-4" />,
  'Informatique & PC': <Laptop className="w-4 h-4" />,
  'Réparation & Outils': <Wrench className="w-4 h-4" />,
  'Articles du quotidien': <Package className="w-4 h-4" />,
  'Impression & Bureautique': <Printer className="w-4 h-4" />,
  // Legacy mappings
  'Phones': <Smartphone className="w-4 h-4" />,
  'Laptops': <Laptop className="w-4 h-4" />,
  'Speakers': <Volume2 className="w-4 h-4" />,
  'Headphones': <Headphones className="w-4 h-4" />,
  'Chargers & Cables': <Zap className="w-4 h-4" />,
  'Cases & Protection': <Shield className="w-4 h-4" />,
  'Storage & More': <HardDrive className="w-4 h-4" />,
};

export const AccessoriesCatalog: React.FC<AccessoriesCatalogProps> = ({
  products,
  categories = [
    'Téléphones mobiles',
    'Coques & Protections',
    'Chargeurs & Câbles',
    'Audio & Connecté',
    'Informatique & PC',
    'Réparation & Outils',
    'Articles du quotidien',
    'Impression & Bureautique'
  ],
  onSelectProduct,
  onBuyProduct,
  onOpenBackend
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryTabs = [
    { label: 'Tous les produits', value: 'All', icon: <ShoppingBag className="w-4 h-4" /> },
    ...categories.map((cat) => ({
      label: cat,
      value: cat,
      icon: KNOWN_CATEGORY_ICONS[cat] || <Tag className="w-4 h-4" />
    }))
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner: Soft light green gradient matching white base */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/70 text-gray-900 rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-200">
            <span>Inventaire en boutique • Magasin de Romainville</span>
            <span>•</span>
            <span>Stock en direct</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Téléphones, Informatique, Audio & Accessoires du Quotidien
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Équipements neufs sous emballage d'origine et reconditionnés certifiés avec garantie. Retrait express au comptoir en 15 minutes au 4-6 boulevard de la Boissière (Romainville) ou livraison rapide à Paris et en Île-de-France.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 items-center text-xs">
            <span className="bg-white text-emerald-950 px-3 py-1 rounded-xl border border-emerald-200 font-medium shadow-xs">
              Pose offerte des verres trempés en magasin
            </span>
            <span className="bg-white text-emerald-950 px-3 py-1 rounded-xl border border-emerald-200 font-medium shadow-xs">
              Jusqu'à 24 mois de garantie magasin
            </span>
            <button
              onClick={onOpenBackend}
              className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-3.5 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 transition ml-auto shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Gestion du stock (Admin)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar & Search */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-emerald-700" />
          <input
            type="text"
            placeholder="Rechercher un modèle, marque, caractéristique (ex. iPhone, Samsung, USB-C, GaN 65W, Papier, Ramette)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        {/* Responsive Categories Scrollable Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {categoryTabs.map((tab) => {
            const count = tab.value === 'All' 
              ? products.length 
              : products.filter(p => p.category === tab.value).length;
            const isActive = activeCategory === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#3f704d] text-white shadow-xs'
                    : 'bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100 border border-emerald-200/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-emerald-900 text-white' : 'bg-emerald-200/70 text-emerald-900'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectProduct && onSelectProduct(item)}
            className="bg-white rounded-3xl border border-emerald-100 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer hover:-translate-y-1"
          >
            {/* Top Image & Badge with Hover Hint */}
            <div className="relative bg-gray-50 aspect-4/3 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* View Details Hover Overlay */}
              <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                <span className="bg-white/95 text-emerald-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Eye className="w-3.5 h-3.5 text-[#3f704d]" />
                  <span>Voir la fiche & photos</span>
                </span>
              </div>
              
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-white/95 px-2.5 py-1 rounded-lg shadow-xs border border-emerald-100 backdrop-blur-xs">
                  {item.category}
                </span>
                {item.featured && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-emerald-700 px-2.5 py-0.5 rounded-lg shadow-xs">
                    Populaire
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 z-10">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs ${
                  item.stock <= 3 
                    ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                }`}>
                  {item.stock} en stock
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  {item.brand}
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-800 transition line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Key Specs */}
                <div className="space-y-1 pt-1">
                  {item.specs.slice(0, 3).map((spec, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-[11px] text-gray-600">
                      <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and BUY Button */}
              <div className="pt-4 border-t border-emerald-50 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">Prix</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg sm:text-xl font-extrabold text-emerald-900">
                      {item.price.toFixed(2)} €
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {item.originalPrice} €
                      </span>
                    )}
                  </div>
                </div>

                {/* BUY BUTTON: slightly green color, strictly NO emoji in button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyProduct(item);
                  }}
                  className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center space-x-1.5 cursor-pointer z-10"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acheter</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-emerald-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              Aucun produit trouvé dans cette catégorie
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Nous recevons des nouveautés chaque jour dans notre boutique au 4-6 bd de la Boissière. Contactez-nous au 01.43.93.16.79 pour toute disponibilité.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Afficher tous les produits
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
