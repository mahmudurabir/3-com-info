import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ShoppingBag, 
  ShieldCheck, 
  Store, 
  Phone, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Zap, 
  RotateCcw,
  Package,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onBuyProduct
}) => {
  // Build gallery array (fallback to main image if images array is empty)
  const galleryImages: string[] = React.useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'box' | 'services'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Gallery navigation handlers
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Find similar products in the same category (or same brand), excluding current
  const similarProducts = React.useMemo(() => {
    const inSameCategory = allProducts.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    if (inSameCategory.length >= 4) {
      return inSameCategory.slice(0, 4);
    }
    // If fewer than 4 in the same category, add other relevant items
    const others = allProducts.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...inSameCategory, ...others].slice(0, 4);
  }, [product, allProducts]);

  // WhatsApp click handler
  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Bonjour 3 Communes Informatique ! Je suis intéressé(e) par l'article suivant :\n\n📦 Produit : ${product.name}\n💶 Prix : ${product.price.toFixed(2)} €\n🏷️ Rayon : ${product.category}\n\nEst-il disponible pour un retrait immédiat au 4-6 boulevard de la Boissière à Romainville ?`
    );
    window.open(`https://wa.me/33143931679?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercent = product.originalPrice ? Math.round((discountAmount / product.originalPrice) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-12">
      
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pt-2 border-b border-gray-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-gray-700 hover:text-[#3f704d] font-bold py-1 px-2.5 rounded-xl hover:bg-emerald-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </button>

        <nav className="flex items-center space-x-2 text-gray-400 overflow-x-auto text-[11px] sm:text-xs">
          <span className="hover:text-gray-600 cursor-pointer" onClick={onBack}>Catalogue magasin</span>
          <span>/</span>
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Product Showcase: Multi-Picture Gallery + Broad Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (5 or 6 cols): Multi-Picture Gallery */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Hero Picture Container */}
          <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm aspect-square flex items-center justify-center p-4 sm:p-8 group">
            <img
              src={galleryImages[activeImageIndex] || product.image}
              alt={`${product.name} - Vue ${activeImageIndex + 1}`}
              className="w-full h-full object-contain max-h-[460px] transition duration-300 transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-white/95 px-3 py-1 rounded-xl shadow-xs border border-emerald-100 backdrop-blur-xs">
                {product.brand}
              </span>
              {discountPercent > 0 && (
                <span className="text-[11px] font-extrabold text-white bg-red-600 px-2.5 py-0.5 rounded-lg shadow-xs">
                  Économisez {discountPercent}% (-{discountAmount.toFixed(0)}€)
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 z-10">
              <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-xs backdrop-blur-xs ${
                product.stock <= 3 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {product.stock > 0 ? `En stock : ${product.stock} pièces` : 'Rupture temporaire'}
              </span>
            </div>

            {/* Left / Right Arrows for Gallery Navigation */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200 flex items-center justify-center transition hover:scale-105 cursor-pointer z-20"
                  aria-label="Photo précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200 flex items-center justify-center transition hover:scale-105 cursor-pointer z-20"
                  aria-label="Photo suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Photo Counter Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-xs z-10">
                  Photo {activeImageIndex + 1} sur {galleryImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Selector Bar (Multi-Picture Carousel) */}
          {galleryImages.length > 1 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Galerie photos ({galleryImages.length} photos) :
              </p>
              <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border-2 overflow-hidden shrink-0 transition cursor-pointer p-1 ${
                      activeImageIndex === idx
                        ? 'border-[#3f704d] ring-2 ring-emerald-500/30 scale-102 bg-white'
                        : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Miniature ${idx + 1}`}
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Romainville Store Address & In-Store Availability Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 flex items-start space-x-3 text-xs text-emerald-950">
            <Store className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-950">
                Disponible en retrait express au comptoir à Romainville
              </p>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                4-6 boulevard de la Boissière, 93230 Romainville (proche Montreuil et Noisy-le-Sec). Préparé en 15 minutes ! Ou livraison rapide sur Paris & Île-de-France.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column (6 cols): Broad Description, Pricing, Buy Action */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Title & Badges */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 font-medium">
                {product.category}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                {product.warranty || 'Garantie 12 mois'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.condition && (
              <p className="text-xs font-semibold text-gray-600 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>État : {product.condition}</span>
              </p>
            )}
          </div>

          {/* Pricing Row */}
          <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                Prix (TTC)
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                  {product.price.toFixed(2)} €
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-gray-500 block">Modes de paiement :</span>
              <span className="text-xs font-semibold text-emerald-900">
                En boutique (espèces / CB) ou en ligne
              </span>
            </div>
          </div>

          {/* Action Buttons: Buy + WhatsApp Shop Consultation */}
          <div className="space-y-3 pt-1">
            <button
              onClick={() => onBuyProduct(product)}
              className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white py-4 px-6 rounded-2xl text-base font-extrabold transition shadow-md active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Acheter maintenant • {product.price.toFixed(2)} €</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 py-3 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Conseil WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
                <span>{copiedLink ? 'Lien copié !' : 'Partager la fiche'}</span>
              </button>
            </div>
          </div>

          {/* Store Guarantees Checkmarks */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-gray-700">
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#3f704d] shrink-0" />
              <span>Garantie magasin incluse</span>
            </div>
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
              <Zap className="w-4 h-4 text-[#3f704d] shrink-0" />
              <span>100% testé & vérifié</span>
            </div>
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#3f704d] shrink-0" />
              <span>Pose offerte & configuration</span>
            </div>
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
              <RotateCcw className="w-4 h-4 text-[#3f704d] shrink-0" />
              <span>Découpe SIM & transfert</span>
            </div>
          </div>

          {/* Broad Description & Specification Tabs */}
          <div className="pt-4 space-y-4">
            
            {/* Tab Buttons */}
            <div className="flex items-center space-x-1 border-b border-gray-200 text-xs font-bold overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#3f704d] text-[#3f704d]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Description détaillée
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-[#3f704d] text-[#3f704d]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Fiche technique ({product.specs.length})
              </button>
              <button
                onClick={() => setActiveTab('box')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'box'
                    ? 'border-[#3f704d] text-[#3f704d]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Contenu du coffret
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'services'
                    ? 'border-[#3f704d] text-[#3f704d]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                SAV Romainville
              </button>
            </div>

            {/* Tab 1: Broad Description & Key Highlights */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs text-gray-700 leading-relaxed animate-in fade-in">
                <p className="text-sm font-medium text-gray-800 leading-relaxed">
                  {product.longDescription || product.description}
                </p>

                {/* Key feature bullets */}
                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                    Points forts & avantages
                  </h4>
                  <ul className="space-y-1.5 pt-1">
                    {product.specs.map((spec, i) => (
                      <li key={i} className="flex items-start space-x-2 text-gray-700 text-xs">
                        <Check className="w-4 h-4 text-[#3f704d] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Full Technical Specifications */}
            {activeTab === 'specs' && (
              <div className="space-y-3 text-xs animate-in fade-in">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-2xs">
                  <div className="p-3 bg-gray-50 flex items-center justify-between font-bold text-gray-800">
                    <span>Caractéristique</span>
                    <span>Détail</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-gray-700">
                    <span className="font-medium text-gray-500">Marque constructeur</span>
                    <span className="font-semibold">{product.brand}</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-gray-700">
                    <span className="font-medium text-gray-500">Rayon / Catégorie</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-gray-700">
                    <span className="font-medium text-gray-500">Couverture garantie</span>
                    <span className="text-[#3f704d] font-bold">{product.warranty}</span>
                  </div>
                  {product.specs.map((spec, i) => (
                    <div key={i} className="p-3 flex items-center justify-between text-gray-700">
                      <span className="font-medium text-gray-500">Caractéristique n°{i + 1}</span>
                      <span className="text-right font-medium max-w-xs">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: What's In The Box */}
            {activeTab === 'box' && (
              <div className="space-y-3 text-xs text-gray-700 animate-in fade-in">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center space-x-2">
                    <Package className="w-4 h-4 text-emerald-800" />
                    <span>Fourni avec votre achat :</span>
                  </h4>
                  <ul className="space-y-1.5 pt-1 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#3f704d]" />
                      <span>1x {product.name}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#3f704d]" />
                      <span>Câble de recharge / synchronisation adapté</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#3f704d]" />
                      <span>Facture officielle et certificat de garantie 3 Communes Informatique</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#3f704d]" />
                      <span>Pose offerte du verre trempé ou film hydrogel lors du retrait</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 4: Romainville Shop Services */}
            {activeTab === 'services' && (
              <div className="space-y-3 text-xs text-gray-700 animate-in fade-in">
                <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-2.5">
                  <h4 className="font-bold text-emerald-950 flex items-center space-x-2">
                    <Store className="w-4 h-4 text-emerald-800" />
                    <span>Garantie sérénité 3 Communes Informatique</span>
                  </h4>
                  <p className="text-emerald-900 leading-relaxed text-[11px]">
                    Chaque appareil et accessoire proposé dans notre boutique de Romainville est testé sur banc d'essai par nos techniciens. Vous bénéficiez d'un service après-vente de proximité au 4-6 boulevard de la Boissière.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-white text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                      Tél : 01.43.93.16.79
                    </span>
                    <span className="bg-white text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                      E-mail : 3communesinfo@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* SUGGESTION BAR WITH SIMILAR PRODUCTS ("below suggestion bar with similar product") */}
      {/* ============================================================ */}
      <section className="pt-10 border-t border-gray-200 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Recommandations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Produits similaires dans le rayon {product.category}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Découvrez d'autres modèles compatibles et accessoires disponibles immédiatement en boutique.
            </p>
          </div>

          <button
            onClick={onBack}
            className="text-xs font-bold text-[#3f704d] hover:text-[#335c3f] hover:underline self-start sm:self-auto cursor-pointer"
          >
            Voir tous les produits →
          </button>
        </div>

        {/* Similar Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {similarProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between cursor-pointer group"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square bg-gray-50 p-4 overflow-hidden flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                
                <span className="absolute top-3 left-3 text-[10px] font-bold text-emerald-950 bg-white/95 px-2 py-0.5 rounded-lg border border-emerald-100 shadow-2xs">
                  {item.brand}
                </span>

                <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                  {item.stock} en stock
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#3f704d] transition line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-base sm:text-lg font-black text-emerald-950">
                      {item.price.toFixed(2)} €
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through ml-1.5">
                        {item.originalPrice} €
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering onSelectProduct twice
                      onBuyProduct(item);
                    }}
                    className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex items-center space-x-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Acheter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
