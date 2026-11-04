import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // 1. TÉLÉPHONES MOBILES
  // ==========================================
  {
    id: 'prod-ph-ip13',
    name: 'Apple iPhone 13 (128 Go) - Reconditionné Certifié',
    category: 'Téléphones mobiles',
    brand: 'Apple',
    price: 489,
    originalPrice: 549,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smartphone Apple avec écran OLED Super Retina XDR 6,1", double appareil photo avancé et compatibilité 5G ultra-rapide. Reconditionné certifié.',
    longDescription: 'L\'Apple iPhone 13 128 Go offre un équilibre parfait entre puissance, autonomie et compacité. Équipé de la puce A15 Bionic ultra-rapide et d\'un double capteur photo 12 MP avec mode Cinématique et stabilisation optique par déplacement de capteur. Chaque unité reconditionnée est minutieusement vérifiée par nos techniciens au 4-6 boulevard de la Boissière (Romainville) sur 45 points de contrôle : santé de la batterie supérieure à 88%, TrueTone actif, Face ID opérationnel et aucun blocage iCloud. 100% débloqué tout opérateur avec garantie magasin de 12 mois.',
    specs: [
      'Écran Super Retina XDR OLED 6,1 pouces (2532 x 1170 px)',
      'Puce A15 Bionic (CPU 6 cœurs, GPU 4 cœurs, Neural Engine 16 cœurs)',
      'Double capteur photo 12 MP (Grand-angle + Ultra grand-angle)',
      'Mode Cinématique 1080p à 30 i/s et enregistrement HDR Dolby Vision',
      'Batterie testée avec capacité garantie > 88%',
      'Connectivité 5G, Wi-Fi 6, Bluetooth 5.0, NFC pour Apple Pay',
      '100% débloqué tous réseaux français et internationaux'
    ],
    boxIncludes: ['iPhone 13 128 Go', 'Câble USB-C vers Lightning de charge rapide', 'Extracteur de carte SIM', 'Certificat de test et garantie 12 mois'],
    condition: 'Reconditionné certifié (Grade A+ Très bon état)',
    featured: true,
    warranty: 'Garantie magasin 12 mois'
  },
  {
    id: 'prod-ph-ip14',
    name: 'Apple iPhone 14 (128 Go) - Reconditionné Certifié',
    category: 'Téléphones mobiles',
    brand: 'Apple',
    price: 589,
    originalPrice: 659,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smartphone polyvalent avec écran OLED, appareil photo avancé Photonic Engine, autonomie prolongée et connectivité 5G.',
    longDescription: 'L\'iPhone 14 améliore la capture photo en basse lumière grâce au moteur de traitement Photonic Engine et intègre les fonctionnalités de sécurité détection des accidents graves et SOS d\'urgence par satellite. Testé et nettoyé dans notre atelier de Romainville. Appareil en parfait état de fonctionnement avec batterie saine et écran d\'origine sans rayures gênantes.',
    specs: [
      'Écran 6,1" Super Retina XDR OLED',
      'Puce A15 Bionic avec GPU 5 cœurs performant',
      'Capteur principal 12 MP avec ouverture f/1.5 plus lumineuse',
      'Mode Action pour des vidéos ultra-stables en mouvement',
      'Détection des accidents et appel d\'urgence automatique',
      'Autonomie jusqu\'à 20 heures de lecture vidéo',
      'Débloqué tout opérateur avec garantie magasin'
    ],
    boxIncludes: ['iPhone 14 128 Go', 'Câble de recharge rapide tressé', 'Outil d\'éjection SIM', 'Fiche de contrôle qualité'],
    condition: 'Reconditionné certifié (Grade A+)',
    featured: true,
    warranty: 'Garantie magasin 12 mois'
  },
  {
    id: 'prod-ph-ip15',
    name: 'Apple iPhone 15 (128 Go) - USB-C & Dynamic Island',
    category: 'Téléphones mobiles',
    brand: 'Apple',
    price: 729,
    originalPrice: 799,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Modèle avec connecteur universel USB-C, Dynamic Island interactive et appareil photo principal haute résolution 48 MP.',
    longDescription: 'L\'iPhone 15 adopte enfin le port universel USB-C et la célèbre interface interactive Dynamic Island pour suivre vos notifications et trajets en direct. Doté d\'un capteur principal révolutionnaire de 48 MP avec téléobjectif 2x optique intégré et dos en verre teinté dans la masse au toucher soyeux. Contrôlé et vérifié sans aucun verrouillage iCloud par notre équipe technique.',
    specs: [
      'Écran Super Retina XDR OLED 6,1" avec Dynamic Island',
      'Capteur principal 48 MP avec zoom téléobjectif optique 2x',
      'Puce A16 Bionic 6 cœurs ultra-efficiente',
      'Connecteur universel USB-C pour charge et transfert',
      'Dos en verre teinté dans la masse résistant aux chocs',
      'Portraits nouvelle génération avec mise au point après la prise de vue',
      'Garantie magasin pièces et main d\'œuvre'
    ],
    boxIncludes: ['iPhone 15 128 Go', 'Câble USB-C vers USB-C officiel', 'Emballage de protection', 'Facture et garantie boutique'],
    condition: 'Comme neuf (Reconditionné Grade A++)',
    featured: true,
    warranty: 'Garantie magasin 12 mois'
  },
  {
    id: 'prod-ph-ip16',
    name: 'Apple iPhone 16 (128 Go) - Puce A18 & Camera Control',
    category: 'Téléphones mobiles',
    brand: 'Apple',
    price: 899,
    originalPrice: 969,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smartphone récent de la gamme iPhone, équipé de la puce A18 surpuissante, du nouveau bouton Commande de l\'appareil photo et compatible Apple Intelligence.',
    longDescription: 'Le tout nouvel iPhone 16 révolutionne la prise de vue avec son bouton capacitif Camera Control sur le flanc pour ajuster zoom, ouverture et exposition d\'un glissement de doigt. Équipé de la nouvelle puce A18 conçue pour l\'IA, d\'un blindage Ceramic Shield de dernière génération 50% plus résistant et d\'une autonomie encore renforcée. Disponible neuf en retrait direct en magasin.',
    specs: [
      'Écran 6,1" Super Retina XDR OLED jusqu\'à 2000 nits en extérieur',
      'Puce A18 avec Neural Engine 16 cœurs optimisé Apple Intelligence',
      'Nouveau bouton tactile dédié Camera Control',
      'Fusion Camera 48 MP + Ultra grand-angle avec mise au point macro',
      'Bouton Action personnalisable',
      'Autonomie record jusqu\'à 22h de lecture vidéo',
      'Garantie légale de conformité 24 mois'
    ],
    boxIncludes: ['iPhone 16 128 Go', 'Câble de charge USB-C tressé (1 m)', 'Documentation officielle Apple', 'Facture d\'achat'],
    condition: 'Neuf sous emballage scellé',
    featured: true,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-sam-a15',
    name: 'Samsung Galaxy A15 / A16 (128 Go) - 4G / 5G',
    category: 'Téléphones mobiles',
    brand: 'Samsung',
    price: 159,
    originalPrice: 189,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smartphone d\'entrée de gamme fiable et endurant pour appels, réseaux sociaux, WhatsApp et navigation quotidienne. Batterie 5000 mAh.',
    longDescription: 'Le Samsung Galaxy A15 / A16 est le best-seller incontournable pour un smartphone complet à prix très accessible. Il intègre un superbe écran Super AMOLED 90Hz éclatant de 6,5 pouces, une triple caméra 50 MP nette et une batterie géante de 5 000 mAh capable de tenir deux jours sans recharge. Configuré et prêt à l\'emploi dans notre boutique.',
    specs: [
      'Écran 6,5" Super AMOLED 90 Hz Full HD+ (2340 x 1080 px)',
      'Processeur Octa-Core véloce avec 4 Go de RAM',
      'Stockage 128 Go extensible par carte MicroSD jusqu\'à 1 To',
      'Triple capteur photo 50 MP + 5 MP Ultra grand-angle + 2 MP Macro',
      'Batterie longue durée 5000 mAh avec charge rapide 25W',
      'Capteur d\'empreinte digitale latéral et reconnaissance faciale',
      'Double SIM pratique pour usage pro et perso'
    ],
    boxIncludes: ['Samsung Galaxy A15 / A16 128 Go', 'Câble USB-C vers USB-C', 'Éjecteur SIM', 'Guide de mise en route'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-sam-a25',
    name: 'Samsung Galaxy A25 / A26 5G (128 Go / 6 Go RAM)',
    category: 'Téléphones mobiles',
    brand: 'Samsung',
    price: 219,
    originalPrice: 259,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Modèle de milieu de gamme avec écran AMOLED 120Hz très fluide, stabilisation optique OIS, connectivité 5G et son stéréo Dolby Atmos.',
    longDescription: 'Parfait pour ceux qui cherchent la fluidité d\'un écran 120Hz et la vitesse de la 5G sans compromis budgétaire. Le capteur 50 MP est doté d\'une stabilisation optique matérielle (OIS) pour éviter les flous de bougé, même la nuit. Les haut-parleurs stéréo Dolby Atmos garantissent un confort d\'écoute immersif.',
    specs: [
      'Écran 6,5" Super AMOLED 120 Hz (1000 nits Vision Booster)',
      'Puce Exynos 1280 5G gravée en 5nm',
      '6 Go de RAM + 128 Go de stockage + Slot MicroSD',
      'Capteur photo 50 MP stabilisé optiquement (OIS)',
      'Haut-parleurs stéréo compatibles Dolby Atmos',
      'Batterie 5000 mAh avec charge 25W',
      'Jusqu\'à 4 générations de mises à jour Android garanties'
    ],
    boxIncludes: ['Galaxy A25 5G', 'Câble USB-C', 'Outil SIM', 'Notice en français'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-sam-a35',
    name: 'Samsung Galaxy A35 / A36 5G (128 Go)',
    category: 'Téléphones mobiles',
    brand: 'Samsung',
    price: 299,
    originalPrice: 349,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smartphone de milieu de gamme avec finition dos en verre premium, résistance à l\'eau IP67, écran AMOLED 120Hz et sécurité Samsung Knox.',
    longDescription: 'Le Galaxy A35 apporte des prestations haut de gamme à un tarif maîtrisé : dos en verre élégant, certification d\'étanchéité à l\'eau et à la poussière IP67, écran Corning Gorilla Glass Victus+ et enregistrement vidéo 4K UHD avec stabilisation vidéo numérique VDIS.',
    specs: [
      'Écran 6,6" Super AMOLED 120 Hz FHD+ Infinity-O',
      'Protection verre Corning Gorilla Glass Victus+',
      'Certification d\'étanchéité eau & poussière IP67',
      'Triple capteur 50 MP OIS + 8 MP Ultra grand-angle + 5 MP Macro',
      'Samsung Knox Vault pour protéger vos mots de passe et données bancaires',
      'Batterie 5000 mAh longue endurance',
      'Prise en charge 5G & eSIM'
    ],
    boxIncludes: ['Samsung Galaxy A35 5G', 'Câble de transfert et charge USB-C', 'Éjecteur tiroir SIM', 'Manuel'],
    condition: 'Neuf scellé',
    featured: false,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-sam-s24',
    name: 'Samsung Galaxy S24 / S25 5G (128 Go / 256 Go) - Galaxy AI',
    category: 'Téléphones mobiles',
    brand: 'Samsung',
    price: 699,
    originalPrice: 799,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gamme flagship premium destinée aux utilisateurs exigeants : Galaxy AI avec traduction instantanée, écran Dynamic AMOLED 2X 2600 nits et zoom optique pro.',
    longDescription: 'Le fleuron de la gamme Galaxy intègre l\'intelligence artificielle Galaxy AI : Entourer pour chercher avec Google, traduction instantanée de vos appels téléphoniques dans plus de 13 langues, et retouche photo générative avancée. Châssis en aluminium Armor Aluminum ultra-résistant et triple capteur photo de niveau professionnel.',
    specs: [
      'Écran 6,2" Dynamic AMOLED 2X adaptatif 1-120 Hz (Luminosité pic 2600 nits)',
      'Fonctions complètes Galaxy AI (Traduction en direct, Note Assist, Circle to Search)',
      'Triple capteur photo : 50 MP principal + 10 MP Téléobjectif 3x optique + 12 MP Ultra grand-angle',
      'Enregistrement vidéo jusqu\'à 8K à 30 i/s',
      'Châssis Armor Aluminum et verre Gorilla Glass Armor',
      '7 ans de mises à jour logicielles et correctifs de sécurité garantis',
      'Compatible recharge sans fil rapide et partage d\'énergie'
    ],
    boxIncludes: ['Samsung Galaxy S24 5G', 'Câble USB-C haute performance', 'Outil tiroir SIM', 'Facture et garantie'],
    condition: 'Neuf boîte d\'origine',
    featured: true,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-xiaomi-13',
    name: 'Xiaomi Redmi 13 / 14C (128 Go / 6 Go RAM)',
    category: 'Téléphones mobiles',
    brand: 'Xiaomi',
    price: 139,
    originalPrice: 169,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Téléphone économique idéal pour les usages essentiels, grand écran 6,79" 90Hz, appareil photo 108 MP et batterie 5030 mAh.',
    longDescription: 'Le Redmi 13 / 14C combine un tarif très accessible avec un grand écran immersif et un capteur photo principal 108 MP surprenant de netteté pour cette catégorie de prix. Idéal pour un premier téléphone ou pour naviguer sur le web, consulter ses mails et passer des appels vidéo en toute simplicité.',
    specs: [
      'Grand écran 6,79" FHD+ 90 Hz certifié faible émission de lumière bleue TÜV Rheinland',
      'Capteur photo principal 108 MP avec zoom 3x sans perte',
      'Batterie 5030 mAh avec charge rapide 33W',
      'Processeur MediaTek Helio G91-Ultra fluide',
      'Prise casque audio jack 3,5 mm présente',
      'Capteur d\'empreintes sur la tranche et déverrouillage facial',
      'Protection dos en verre élégant'
    ],
    boxIncludes: ['Xiaomi Redmi 13', 'Chargeur secteur mural rapide 33W', 'Câble USB-C', 'Coque de protection transparente offerte', 'Éjecteur SIM'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-xiaomi-note13',
    name: 'Xiaomi Redmi Note 13 / Note 14 (128 Go / 256 Go)',
    category: 'Téléphones mobiles',
    brand: 'Xiaomi',
    price: 199,
    originalPrice: 239,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gamme populaire de milieu de gamme plébiscitée pour son écran AMOLED 120Hz aux bordures ultra-fines, triple capteur 108 MP et son autonomie.',
    longDescription: 'Le champion du rapport équipement-prix : écran AMOLED 120Hz d\'une luminosité de pointe de 1800 nits avec capteur d\'empreintes sous l\'écran, haut-parleurs stéréo Dolby Atmos et module photo 108 MP très performant. Livré avec son chargeur complet dans la boîte.',
    specs: [
      'Écran 6,67" AMOLED 120 Hz FHD+ aux bordures ultra-fines',
      'Luminosité pic 1800 nits et verre Corning Gorilla Glass 3',
      'Triple capteur photo 108 MP + 8 MP ultra grand-angle + 2 MP macro',
      'Lecteur d\'empreintes digitales intégré directement sous l\'écran',
      'Batterie 5000 mAh avec charge rapide 33W',
      'Certification de résistance aux éclaboussures IP54',
      'Double haut-parleur stéréo avec Dolby Atmos'
    ],
    boxIncludes: ['Redmi Note 13', 'Adaptateur secteur 33W d\'origine', 'Câble USB Type-C', 'Coque silicone protectrice', 'Guide utilisateur'],
    condition: 'Neuf boîte d\'origine',
    featured: true,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-moto-g',
    name: 'Motorola Moto G series (Moto G54 5G / G84)',
    category: 'Téléphones mobiles',
    brand: 'Motorola',
    price: 169,
    originalPrice: 199,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smartphone Android simple et pratique, interface épurée sans publicité, excellente autonomie 5000 mAh, écran 120Hz et 5G rapide.',
    longDescription: 'Pour tous les clients qui souhaitent une expérience Android fluide, propre et sans surcouche intrusive. Les smartphones Motorola Moto G se distinguent par leurs gestes intuitifs (secouer pour allumer la lampe torche), un capteur 50 MP avec stabilisation optique OIS et un son Dolby Atmos chaleureux.',
    specs: [
      'Écran 6,5" Full HD+ avec rafraîchissement fluide 120 Hz',
      'Connectivité 5G rapide pour tous opérateurs français',
      'Capteur photo principal 50 MP avec stabilisation optique OIS',
      'Interface Android pure sans applications indésirables',
      'Batterie grande autonomie 5000 mAh avec charge TurboPower',
      'Son spatial et haut-parleurs stéréo Dolby Atmos',
      'Mémoire généreuse de 256 Go de stockage'
    ],
    boxIncludes: ['Motorola Moto G', 'Chargeur TurboPower', 'Câble USB-C', 'Coque de protection souple', 'Outil SIM'],
    condition: 'Neuf boîte d\'origine',
    featured: false,
    warranty: 'Garantie constructeur 24 mois'
  },
  {
    id: 'prod-ph-nokia-feature',
    name: 'Nokia / HMD Feature Phone (Nokia 105 / 110 4G)',
    category: 'Téléphones mobiles',
    brand: 'Nokia',
    price: 39,
    originalPrice: 49,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Téléphone classique à touches pour appels clairs et SMS, autonomie record de plusieurs jours en veille, radio FM sans fil et lampe torche intégrée.',
    longDescription: 'Le téléphone de référence pour les seniors, les professionnels sur les chantiers ou toute personne souhaitant un téléphone secondaire ultra-simple et résistant aux chocs. Clavier physique à grandes touches bien espacées, volume d\'écoute puissant avec compatibilité voix 4G VoLTE pour des appels d\'une clarté parfaite.',
    specs: [
      'Clavier à touches physiques confortables et lisibles',
      'Compatibilité réseau 4G VoLTE pour des appels vocaux HD sans coupure',
      'Batterie amovible offrant plusieurs jours d\'autonomie en conversation',
      'Lampe torche LED puissante intégrée activable en un clic',
      'Radio FM fonctionnant sans fil et jeu Snake classique',
      'Prise audio jack 3,5 mm et port de recharge standard',
      'Robuste boîtier en polycarbonate teinté dans la masse résistant aux chutes'
    ],
    boxIncludes: ['Nokia Feature Phone', 'Batterie amovible', 'Chargeur mural micro-USB / USB-C', 'Guide d\'utilisation simplifié'],
    condition: 'Neuf sous boîte',
    featured: false,
    warranty: 'Garantie 2 ans'
  },

  // ==========================================
  // 2. COQUES ET PROTECTIONS
  // ==========================================
  {
    id: 'prod-coque-clear-ip',
    name: 'Coque Transparente Anti-Jaunissement — iPhone (13 / 14 / 15 / 16)',
    category: 'Coques & Protections',
    brand: 'ProShield',
    price: 15,
    originalPrice: 19,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Coque souple en TPU transparent haute clarté avec traitement anti-UV anti-jaunissement et coussins d\'air d\'absorption des chocs aux 4 coins.',
    longDescription: 'Préservez la couleur d\'origine de votre iPhone tout en le protégeant des chutes quotidiennes. Fabriquée à partir d\'un polymère haute transparence enrichi d\'une couche anti-oxydation pour éviter le jaunissement prématuré. Découpes laser précises pour chaque modèle : iPhone 13, 14, 15, 16. Bords surélevés de 1,2 mm pour isoler l\'écran et les lentilles photo des surfaces planes.',
    specs: [
      'Polymère TPU allemand Bayer haute transparence 99.9%',
      'Technologie Air-Cushion aux 4 angles contre les chutes jusqu\'à 2 mètres',
      'Traitement anti-UV empêchant l\'oxydation et le jaunissement',
      'Bords surélevés pour protéger l\'écran et le bloc optique',
      'Compatible recharge sans fil Qi et MagSafe',
      'Disponible en magasin pour toutes les déclinaisons d\'iPhone'
    ],
    boxIncludes: ['Coque transparente modèle exact', 'Chiffonnette microfibre'],
    condition: 'Neuf sous blister scellé',
    featured: true,
    warranty: 'Garantie légale 2 ans'
  },
  {
    id: 'prod-coque-silicone-sam',
    name: 'Coque Silicone Toucher Doux — Samsung Galaxy A & S Series',
    category: 'Coques & Protections',
    brand: 'SamFit',
    price: 14,
    originalPrice: 18,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Coque souple avec finition mate anti-traces, doublure intérieure en microfibre douce protégeant la face arrière des micro-rayures.',
    longDescription: 'Conçue sur mesure pour les modèles Samsung Galaxy A15, A25, A35, A55 et série S. Sa texture en silicone liquide offre une prise en main soyeuse et antidérapante. L\'intérieur est tapissé d\'une feutrine microfibre pour empêcher la poussière de rayer la coque arrière du smartphone.',
    specs: [
      'Silicone liquide soyeux mat anti-traces de doigts',
      'Doublure intérieure en microfibre anti-rayures',
      'Protection intégrale des bords et des boutons',
      'Découpes exactes pour haut-parleurs, port USB-C et capteurs',
      'Nettoyage facile d\'un coup de lingette',
      'Nombreux coloris disponibles au comptoir (Noir, Bleu nuit, Vert sapin, Rose poudré)'
    ],
    boxIncludes: ['Coque silicone personnalisée au modèle'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-coque-antichoc',
    name: 'Coque Antichoc Renforcée Double Couche (Béquille / Anneau)',
    category: 'Coques & Protections',
    brand: 'ArmorShield',
    price: 18,
    originalPrice: 24,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Coque de protection maximale hybride polycarbonate rigide + TPU souple avec coins blindés et anneau béquille rotatif 360° intégré.',
    longDescription: 'Idéale pour les personnes actives, artisans ou maladroits : cette coque combine un cœur souple absorbant l\'onde de choc et une carapace en polycarbonate dur. L\'anneau métallique rotatif à 360° sert à sécuriser la prise en main, regarder des vidéos mains-libres et se fixe directement sur les supports magnétiques de voiture.',
    specs: [
      'Structure double couche hybride TPU + Polycarbonate blindé',
      'Certifiée résistance aux chutes de niveau militaire (MIL-STD-810G)',
      'Anneau béquille en alliage de zinc rotatif à 360°',
      'Plaque métallique intégrée pour support magnétique de voiture',
      'Rebords surélevés de 2 mm pour l\'écran et les appareils photo'
    ],
    boxIncludes: ['Coque antichoc renforcée pour modèle spécifique'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-verre-ip',
    name: 'Verre Trempé 9H Haute Résistance — iPhone (Pose offerte en magasin)',
    category: 'Coques & Protections',
    brand: 'OpticGlass',
    price: 10,
    originalPrice: 15,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Protection d\'écran en véritable verre trempé dureté 9H, bords incurvés 2.5D, traitement oléophobe anti-traces et transparence 100%.',
    longDescription: 'Le verre trempé 9H constitue le rempart essentiel contre les bris de vitre et rayures profondes de clés ou pièces. Découpé au millimètre près pour chaque génération d\'iPhone (13, 14, 15, 16). Notre équipe en boutique à Romainville assure la pose professionnelle sans bulle ni poussière directement au comptoir.',
    specs: [
      'Dureté certifiée 9H contre les rayures d\'objets métalliques',
      'Épaisseur ultra-fine 0,33 mm préservant la sensibilité tactile 3D Touch',
      'Traitement oléophobe hydrophobe réduisant les empreintes grasses',
      'Bords biseautés 2.5D doux au passage du doigt',
      'Pose professionnelle offerte et garantie sans bulle en magasin'
    ],
    boxIncludes: ['Verre trempé 9H calibré', 'Lingette nettoyante humide à l\'alcool', 'Chiffon microfibre', 'Stickers anti-poussière'],
    condition: 'Neuf sous blister rigide',
    featured: true,
    warranty: 'Garantie pose réussie en magasin'
  },
  {
    id: 'prod-verre-sam',
    name: 'Verre Trempé 9H Haute Résistance — Samsung Galaxy',
    category: 'Coques & Protections',
    brand: 'OpticGlass',
    price: 10,
    originalPrice: 15,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Verre trempé découpé avec précision pour modèles Samsung Galaxy A & S. Parfaite compatibilité avec le lecteur d\'empreinte sous l\'écran.',
    longDescription: 'Conçu spécialement pour les écrans Super AMOLED Samsung, ce verre haute pureté garantit une réactivité tactile instantanée et permet le déverrouillage biométrique par empreinte digitale sans aucun ralentissement. Pose méticuleuse réalisée sur place par nos soins.',
    specs: [
      'Indice de dureté 9H résistant aux chocs frontaux',
      'Compatible capteur d\'empreinte ultrasonique et optique sous l\'écran',
      'Format adapté compatible avec toutes les coques du marché',
      'Transparence optique haute fidélité pour des couleurs éclatantes',
      'Pose gratuite en atelier au 4-6 bd de la Boissière'
    ],
    boxIncludes: ['Verre trempé 9H Samsung', 'Kit de préparation complet (lingette + microfibre + adhésif dépoussiérant)'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie magasin'
  },
  {
    id: 'prod-film-hydrogel',
    name: 'Film Hydrogel Découpable Sur Mesure (Tous Modèles & Tablettes)',
    category: 'Coques & Protections',
    brand: 'HydroNano Pro',
    price: 15,
    originalPrice: 20,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Film souple nouvelle génération autorégénérant découpé au traceur laser en boutique. Idéal pour écrans incurvés et modèles rares.',
    longDescription: 'Grâce à notre traceur de découpe de précision en magasin, nous découpons en quelques secondes le film hydrogel adapté exactement à votre modèle de téléphone, montre connectée ou tablette (Samsung Edge, Huawei, Xiaomi, Oppo, Honor, iPhone...). Sa matière nano-moléculaire absorbe les chocs et résorbe les micro-rayures en 24h.',
    specs: [
      'Technologie autorégénérante : les micro-rayures disparaissent en 24h',
      'Épouse parfaitement les bords incurvés des écrans 3D',
      'Ne se casse jamais et ne s\'effrite pas comme le verre',
      'Découpe laser immédiate en magasin pour plus de 8 000 modèles d\'appareils',
      'Pose réalisée sur place avec raclette professionnelle'
    ],
    boxIncludes: ['Film hydrogel découpé sur mesure', 'Pose complète réalisée en boutique'],
    condition: 'Neuf découpé en direct',
    featured: true,
    warranty: 'Garantie pose sans bulle'
  },
  {
    id: 'prod-protec-camera',
    name: 'Protection Caméra Arrière en Verre Trempé & Bague Aluminium',
    category: 'Coques & Protections',
    brand: 'LensGuard',
    price: 8,
    originalPrice: 12,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Protecteur individuel renforcé pour objectifs photo. Préserve les lentilles des rayures de clés sans altérer la qualité des clichés de nuit.',
    longDescription: 'Les blocs photos imposants des smartphones modernes sont les premiers exposés aux bris en cas de choc sur le dos. Nos protections en verre optique 9H avec cerclage en alliage d\'aluminium protègent individuellement chaque capteur photo sans provoquer de reflets indésirables au flash.',
    specs: [
      'Verre trempé 9H haute transparence optique 99.9%',
      'Cercle en aluminium noir ou argent coordonné au téléphone',
      'Anneau noir anti-reflet empêchant l\'éblouissement lors des photos au flash',
      'Adhésif puissant sans résidu au retrait'
    ],
    boxIncludes: ['Jeu de lentilles protectrices selon modèle', 'Kit de nettoyage optique'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie 1 an'
  },

  // ==========================================
  // 3. CHARGEURS, CÂBLES ET ÉNERGIE
  // ==========================================
  {
    id: 'prod-ch-20w',
    name: 'Chargeur USB-C Power Delivery 20 W — Charge Rapide',
    category: 'Chargeurs & Câbles',
    brand: 'PowerFast',
    price: 19,
    originalPrice: 25,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Adaptateur secteur compact 20W Power Delivery officiel. Recharge 50% de la batterie de votre iPhone ou smartphone en seulement 30 minutes.',
    longDescription: 'L\'indispensable du quotidien : adaptateur mural compact équipé d\'un port USB-C compatible avec le protocole universel USB Power Delivery 3.0. Il délivre la puissance optimale pour les iPhone (11 à 16), les iPad et les smartphones Android. Doté de circuits de sécurité intelligents contre les surtensions et les surchauffes.',
    specs: [
      'Puissance de sortie max : 20 Watts Power Delivery',
      'Entrée : 100-240V ~ 50/60Hz (universel pour voyages)',
      'Recharge rapide : 0 à 50% en ~30 minutes',
      'Puce de contrôle thermique intelligent régulant la charge',
      'Format ultra-compact facile à glisser dans une poche ou un sac',
      'Certifié conforme aux normes européennes CE et RoHS'
    ],
    boxIncludes: ['Adaptateur secteur USB-C 20W', 'Notice de sécurité'],
    condition: 'Neuf emballé',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-ch-30w',
    name: 'Chargeur USB-C 30 W Rapide & Efficace',
    category: 'Chargeurs & Câbles',
    brand: 'VoltPro',
    price: 25,
    originalPrice: 32,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Chargeur secteur haute performance 30W idéal pour iPad Pro, MacBook Air, tablettes et smartphones haut de gamme.',
    longDescription: 'Offrez une charge plus soutenue à vos appareils énergivores. Ce chargeur 30W prend en charge les protocoles PD 3.0 et PPS, ajustant dynamiquement la tension pour prolonger la durée de vie de la batterie tout en minimisant les temps d\'attente.',
    specs: [
      'Puissance : 30 Watts PD / PPS',
      'Compatible charge rapide Apple, Samsung, Google Pixel et tablettes',
      'Format compact avec broches européennes robustes',
      'Protection avancée contre court-circuit et surchauffe'
    ],
    boxIncludes: ['Chargeur 30W USB-C', 'Manuel utilisateur'],
    condition: 'Neuf sous emballage',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-ch-65w-gan',
    name: 'Chargeur USB-C 65 W GaN Ultra-Rapide (PC Portables & Téléphones)',
    category: 'Chargeurs & Câbles',
    brand: 'GaNPower',
    price: 39,
    originalPrice: 49,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Technologie GaN (Nitrure de Gallium) : format 50% plus compact, charge simultanément un ordinateur portable (MacBook / Dell / HP) et un smartphone.',
    longDescription: 'La révolution GaN permet de miniaturiser les blocs d\'alimentation tout en dissipant moins de chaleur. Doté de 2 ports USB-C Power Delivery et d\'un port USB-A Quick Charge, ce chargeur remplace avantageusement le gros chargeur de votre PC portable en voyage ou au bureau.',
    specs: [
      'Technologie GaN III (Nitrure de Gallium) haute efficacité 65W',
      '3 sorties : 2x USB-C (PD 65W) + 1x USB-A (QC 22.5W)',
      'Capable d\'alimenter MacBook Pro/Air, PC portables USB-C, consoles Nintendo Switch',
      'Répartition automatique de puissance intelligente en multi-appareils',
      'Système de refroidissement passif anti-échauffement'
    ],
    boxIncludes: ['Chargeur GaN 65W multiport', 'Notice technique'],
    condition: 'Neuf sous boîte',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-cab-c-c',
    name: 'Câble USB-C vers USB-C Tressé Renforcé (1 m / 2 m) — 60W / 100W',
    category: 'Chargeurs & Câbles',
    brand: 'ToughWire',
    price: 12,
    originalPrice: 16,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Câble de recharge rapide tressé en nylon ultra-résistant supportant jusqu\'à 60W / 100W et transfert de données rapide 480 Mbps.',
    longDescription: 'Fini les câbles qui se dénudent et se cassent au niveau du connecteur. Ce câble haut de gamme dispose d\'embouts en alliage d\'aluminium renforcés contre les torsions et d\'une gaine en nylon tressé résistant à plus de 15 000 pliages. Idéal pour iPhone 15/16, Samsung, tablettes et PC portables.',
    specs: [
      'Gaine extérieure en nylon tressé haute densité anti-nœud',
      'Support de charge rapide Power Delivery jusqu\'à 60W / 100W',
      'Transfert de données USB 2.0 synchronisation 480 Mbps',
      'Embouts métalliques avec manchons anti-torsion renforcés',
      'Longueurs disponibles en magasin : 1 mètre ou 2 mètres'
    ],
    boxIncludes: ['Câble USB-C vers USB-C renforcé', 'Attache-câble scratch'],
    condition: 'Neuf sous sachet scellé',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-cab-c-light',
    name: 'Câble USB-C vers Lightning Certifié MFi (1 m / 2 m)',
    category: 'Chargeurs & Câbles',
    brand: 'ProConnect',
    price: 14,
    originalPrice: 19,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Câble certifié MFi pour appareils Apple avec connecteur Lightning (iPhone 6 à 14). Recharge rapide Power Delivery garantie sans message d\'erreur.',
    longDescription: 'Équipé de la puce d\'authentification officielle Apple C94, ce câble garantit une synchronisation parfaite avec iTunes/Finder et permet la recharge rapide de 0 à 50% en 30 minutes lorsqu\'il est branché à un chargeur USB-C 20W.',
    specs: [
      'Puce officielle certifiée Apple MFi (Made for iPhone/iPad)',
      'Compatible charge rapide Power Delivery 20W/18W',
      'Zéro message d\'erreur « accessoire non pris en charge »',
      'Connecteurs plaqués or anti-corrosion',
      'Longueur 1 m ou 2 m'
    ],
    boxIncludes: ['Câble USB-C vers Lightning MFi'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-cab-a-c',
    name: 'Câble USB-A vers USB-C Tressé Rapide (1 m / 2 m)',
    category: 'Chargeurs & Câbles',
    brand: 'ToughWire',
    price: 10,
    originalPrice: 14,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Câble pratique pour brancher vos appareils USB-C sur d\'anciens chargeurs USB-A muraux, prises de voiture ou ports PC classiques.',
    longDescription: 'Prend en charge la charge rapide Quick Charge 3.0 jusqu\'à 3A et le transfert de fichiers. Sa résistance interne de 56 kΩ garantit la protection de votre appareil contre les surintensités.',
    specs: [
      'Intensité maximale supportée : 3 Ampères (QC 3.0 / Fast Charge)',
      'Résistance de protection 56 kΩ intégrée',
      'Compatible prises USB de voiture, allume-cigare et box internet',
      'Nylon tressé résistant aux torsions'
    ],
    boxIncludes: ['Câble USB-A vers USB-C'],
    condition: 'Neuf sous emballage',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-pb-10k',
    name: 'Batterie Externe Power Bank 10 000 mAh — Double Sortie USB-C & USB-A',
    category: 'Chargeurs & Câbles',
    brand: 'PowerNova',
    price: 22,
    originalPrice: 29,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1609592426860-28211db4d0eb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592426860-28211db4d0eb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Batterie nomade fine et légère permettant de recharger 2 à 3 fois un smartphone. Affichage LED du pourcentage de batterie restante.',
    longDescription: 'Ne tombez plus jamais en panne de batterie en déplacement dans les transports parisiens ou en voyage. D\'un format compact similaire à un smartphone, elle glisse facilement dans un sac ou une veste. Équipée d\'un port USB-C bidirectionnel Power Delivery 20W et d\'un port USB-A Quick Charge.',
    specs: [
      'Capacité nominale : 10 000 mAh (37 Wh)',
      'Recharge rapide Power Delivery 20W & QC 3.0 18W',
      'Permet de recharger 2 appareils en même temps',
      'Écran digital LED affichant précisément le % d\'énergie',
      'Autorisée en cabine d\'avion (normes de transport IATA < 100 Wh)',
      'Poids plume : seulement 215 g'
    ],
    boxIncludes: ['Batterie externe 10 000 mAh', 'Câble de recharge USB-C', 'Manuel d\'utilisation'],
    condition: 'Neuf boîte d\'origine',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pb-20k',
    name: 'Batterie Externe Haute Capacité 20 000 mAh — 22.5 W Fast Charge',
    category: 'Chargeurs & Câbles',
    brand: 'PowerNova',
    price: 32,
    originalPrice: 42,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1609592426860-28211db4d0eb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592426860-28211db4d0eb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Grande réserve d\'énergie capable de recharger 5 à 6 fois un téléphone ou d\'alimenter une tablette plusieurs jours. Charge rapide 22.5W.',
    longDescription: 'La solution ultime pour les départs en vacances, week-ends en camping ou journées de travail prolongées. Dotée de 3 sorties de charge simultanées, elle dispose d\'un contrôleur de sécurité à 9 niveaux prévenant toute surcharge et court-circuit.',
    specs: [
      'Capacité massive de 20 000 mAh (74 Wh)',
      'Sortie USB-C Power Delivery 20W / 22.5W Super Charge',
      '3 ports de sortie : 2x USB-A + 1x USB-C',
      'Recharge rapide de la batterie elle-même en seulement ~5 heures',
      'Affichage du niveau de batterie par indicateur numérique LED',
      'Conforme aux règles de sécurité aérienne en bagage cabine'
    ],
    boxIncludes: ['Power Bank 20 000 mAh', 'Câble court USB-C vers USB-C', 'Guide de garantie'],
    condition: 'Neuf sous boîte',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-ch-qi',
    name: 'Chargeur Sans Fil Qi / Qi2 Induction 15 W — Socle Antidérapant',
    category: 'Chargeurs & Câbles',
    brand: 'AirCharge',
    price: 25,
    originalPrice: 35,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Posez simplement votre téléphone ou boîtier d\'AirPods pour le recharger sans fil. Puissance 15W avec détection d\'objets métalliques.',
    longDescription: 'Éliminez les câbles qui encombrent votre table de chevet ou bureau. Ce pad de charge à induction magnétique certifié Qi fonctionne à travers la majorité des coques de protection (jusqu\'à 5 mm d\'épaisseur). Anneau LED discret non éblouissant la nuit.',
    specs: [
      'Puissance de charge par induction : 15W / 10W / 7.5W / 5W auto-adaptative',
      'Compatible iPhone (MagSafe/Qi), Samsung Galaxy, Xiaomi et écouteurs sans fil',
      'Surface antidérapante en caoutchouc doux pour éviter les glissements',
      'Système FOD (Foreign Object Detection) coupant l\'induction en présence de clés ou pièces'
    ],
    boxIncludes: ['Socle de charge sans fil 15W', 'Câble USB-C d\'alimentation (1 m)', 'Notice'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },

  // ==========================================
  // 4. AUDIO ET ACCESSOIRES CONNECTÉS
  // ==========================================
  {
    id: 'prod-aud-c-wired',
    name: 'Écouteurs Filaires USB-C Stéréo avec Micro & Télécommande',
    category: 'Audio & Connecté',
    brand: 'SoundClean',
    price: 12,
    originalPrice: 16,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Écouteurs intra-auriculaires avec fiche USB-C numérique et DAC audio HD intégré. Idéal pour iPhone 15/16 et smartphones sans prise jack.',
    longDescription: 'Profitez d\'un son cristallin sans décalage pour vos appels téléphoniques, visios et écoutes musicales. Intègre une puce DAC haute fidélité assurant une compatibilité sans faille avec tous les smartphones récents ayant abandonné la prise jack 3,5 mm.',
    specs: [
      'Connecteur numérique USB-C avec convertisseur DAC HD intégré',
      'Télécommande intégrée : réglage du volume, pause/lecture, décrocher/raccrocher',
      'Microphone antibruit pour des conversations claires même dans la rue',
      'Design intra-auriculaire ergonomique confortable pour de longues écoutes'
    ],
    boxIncludes: ['Écouteurs USB-C filaires', '3 paires d\'embouts silicone de tailles différentes (S, M, L)'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-aud-jack-wired',
    name: 'Écouteurs Filaires Jack 3,5 mm Classiques avec Micro',
    category: 'Audio & Connecté',
    brand: 'SoundClean',
    price: 10,
    originalPrice: 14,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Écouteurs stéréo universels avec fiche mini-jack 3,5 mm plaquée or. Compatibles PC, ordinateurs portables, tablettes et téléphones classiques.',
    longDescription: 'La solution de dépannage audio universelle et économique. Branchez et profitez instantanément sans batterie ni configuration Bluetooth sur votre ordinateur, manette de jeu ou baladeur.',
    specs: [
      'Fiche audio universelle mini-jack 3,5 mm mâle plaquée or',
      'Câble souple anti-enchevêtrement de 1,2 m',
      'Microphone intégré sur le cordon pour appels téléphoniques',
      'Transducteurs dynamiques 10 mm délivrant des basses équilibrées'
    ],
    boxIncludes: ['Écouteurs stéréo jack 3,5 mm'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-aud-tws',
    name: 'Écouteurs Sans Fil Bluetooth TWS avec Boîtier de Charge (Autonomie 24h)',
    category: 'Audio & Connecté',
    brand: 'AirSound Pro',
    price: 29,
    originalPrice: 39,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Écouteurs True Wireless compacts avec Bluetooth 5.3, appairage automatique instantané, commandes tactiles et autonomie totale de 24 heures.',
    longDescription: 'Libérez-vous des fils avec ces écouteurs Bluetooth légers et discrets. Dès l\'ouverture du boîtier, ils se connectent automatiquement à votre smartphone iOS ou Android. Réduction passive du bruit ambiant pour savourer votre musique ou téléphoner en toute sérénité.',
    specs: [
      'Bluetooth 5.3 à faible latence et connexion stable jusqu\'à 10 mètres',
      'Autonomie : 5h par écouteur + 19h supplémentaires avec le boîtier (24h au total)',
      'Commandes tactiles intuitives : volume, pistes, prise d\'appel et assistant vocal',
      'Boîtier de recharge compact avec port USB-C rapide',
      'Résistance aux éclaboussures et à la transpiration (IPX4) idéal sport'
    ],
    boxIncludes: ['2 Écouteurs sans fil TWS', 'Boîtier de recharge USB-C', 'Câble de charge', 'Manuel en français'],
    condition: 'Neuf scellé',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-aud-casque',
    name: 'Casque Audio Bluetooth Pliable avec Micro & Câble Auxiliaire (30h Autonomie)',
    category: 'Audio & Connecté',
    brand: 'AcousticBeat',
    price: 39,
    originalPrice: 49,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Casque supra-auriculaire sans fil avec arceau pliable rembourré, coussinets à mémoire de forme, son basse profonde et autonomie jusqu\'à 30 heures.',
    longDescription: 'Confort exceptionnel même après des heures d\'écoute pour le télétravail, les transports ou les cours en ligne. Peut s\'utiliser en Bluetooth ou en mode filaire avec le câble jack fourni si la batterie vient à manquer.',
    specs: [
      'Haut-parleurs 40 mm avec technologie Deep Bass',
      'Autonomie impressionnante jusqu\'à 30 heures d\'écoute en continu',
      'Structure pliable et compacte pour un rangement facile dans un sac',
      'Arceau réglable et coussinets moelleux en simili-cuir respirant',
      'Double mode de fonctionnement : Bluetooth sans fil ou câble jack 3,5 mm inclus'
    ],
    boxIncludes: ['Casque Bluetooth pliable', 'Câble audio jack 3,5 mm', 'Câble de recharge USB-C', 'Guide de démarrage'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-aud-speaker',
    name: 'Enceinte Bluetooth Portable Étanche IPX5 (Son 360° / 10h)',
    category: 'Audio & Connecté',
    brand: 'BoomSound',
    price: 35,
    originalPrice: 45,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Enceinte nomade compacte étanche aux projections d\'eau, son puissant avec radiateur de basses passif, autonomie 10 heures et dragonne de transport.',
    longDescription: 'Diffusez votre musique partout : à la maison, en cuisine, au parc ou en pique-nique. Résiste aux éclaboussures (IPX5), intègre un microphone pour répondre à vos appels en haut-parleur et peut être jumelée en stéréo avec une seconde enceinte.',
    specs: [
      'Puissance audio : 10 Watts RMS avec basses renforcées',
      'Étanchéité IPX5 contre la pluie et les éclaboussures d\'eau',
      'Batterie lithium rechargeable offrant jusqu\'à 10 heures d\'autonomie',
      'Portée Bluetooth jusqu\'à 15 mètres',
      'Support lecture carte MicroSD et entrée auxiliaire jack'
    ],
    boxIncludes: ['Enceinte Bluetooth nomade', 'Dragonne intégrée', 'Câble de recharge USB', 'Mode d\'emploi'],
    condition: 'Neuf emballé',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-aud-montre',
    name: 'Montre / Bracelet Connecté Santé & Notifications (Écran Couleur)',
    category: 'Audio & Connecté',
    brand: 'FitPulse',
    price: 39,
    originalPrice: 49,
    stock: 7,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Accessoire connecté avec suivi du rythme cardiaque, oxygène sanguin (SpO2), podomètre, suivi du sommeil et notifications d\'appels et SMS.',
    longDescription: 'Surveillez votre activité quotidienne en toute simplicité. Compatible avec tous les téléphones Android et iPhone via application gratuite en français. Recevez vos messages, notifications WhatsApp et alertes d\'appels directement au poignet.',
    specs: [
      'Écran tactile couleur HD 1,4 pouce lumineux',
      'Capteurs de santé : fréquence cardiaque 24/7, oxygène SpO2, compteur de pas et calories',
      'Suivi de la qualité du sommeil et alertes de sédentarité',
      'Affichage des notifications d\'appels, SMS, WhatsApp et réseaux',
      'Autonomie longue durée de 7 à 10 jours par charge',
      'Étanchéité IP68 résistante à la transpiration et au lavage des mains'
    ],
    boxIncludes: ['Montre connectée', 'Bracelet en silicone hypoallergénique', 'Câble de chargeur magnétique', 'Manuel'],
    condition: 'Neuf sous boîte',
    featured: false,
    warranty: 'Garantie 2 ans'
  },

  // ==========================================
  // 5. INFORMATIQUE ET ACCESSOIRES PC
  // ==========================================
  {
    id: 'prod-pc-souris-fil',
    name: 'Souris Filaire USB Optique Bureautique (1200 DPI)',
    category: 'Informatique & PC',
    brand: 'LogiOffice',
    price: 10,
    originalPrice: 14,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Souris optique filaire simple et fiable pour ordinateur de bureau ou portable. Plug & Play sans installation requise.',
    longDescription: 'L\'outil indispensable pour dépanner votre poste de travail. Forme ergonomique ambidextre convenant aussi bien aux droitiers qu\'aux gauchers, molette crantée fluide et câble USB robuste de 1,5 mètre.',
    specs: [
      'Capteur optique précis 1200 DPI fluide sur toutes surfaces',
      'Connexion filaire USB-A Plug-and-Play instantanée',
      'Forme ergonomique symétrique ambidextre',
      'Molette de défilement verticale avec clic central',
      'Compatible Windows, Mac, Linux et ChromeOS'
    ],
    boxIncludes: ['Souris filaire USB'],
    condition: 'Neuf sous emballage',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-souris-sansfil',
    name: 'Souris Sans Fil 2,4 GHz Ergonomique avec Récepteur Nano-USB',
    category: 'Informatique & PC',
    brand: 'LogiOffice',
    price: 15,
    originalPrice: 20,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Souris sans fil bureautique avec nano-récepteur USB discret, résolution réglable jusqu\'à 1600 DPI et mode veille automatique économe.',
    longDescription: 'Travaillez sans fil sur votre ordinateur portable ou poste fixe. Le nano-récepteur se branche sur un port USB et se range à l\'intérieur de la souris pour le transport. Autonomie jusqu\'à 12 mois avec une seule pile.',
    specs: [
      'Connexion sans fil 2,4 GHz fiable jusqu\'à 10 mètres',
      'Nano-récepteur USB compact se rangeant sous la souris',
      'Bouton de réglage DPI à la volée (800 / 1200 / 1600 DPI)',
      'Clics silencieux pour travailler confortablement sans gêner les collègues',
      'Système d\'extinction automatique pour préserver la pile'
    ],
    boxIncludes: ['Souris sans fil 2,4 GHz', 'Nano-récepteur USB', '1 Pile AA incluse'],
    condition: 'Neuf boîte d\'origine',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-clavier-azerty',
    name: 'Clavier AZERTY USB Standard avec Pavé Numérique (Disposition Française)',
    category: 'Informatique & PC',
    brand: 'KeyPro',
    price: 19,
    originalPrice: 24,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Clavier filaire français AZERTY complet avec pavé numérique intégré, touches à profil bas silencieuses et pieds réglables en inclinaison.',
    longDescription: 'Indispensable pour vos tâches administratives, frappe de courriers et comptabilité. Conçu spécifiquement pour le marché français avec la disposition AZERTY officielle et accents complets. Structure résistante aux déversements accidentels de liquide.',
    specs: [
      'Disposition officielle française AZERTY (105 touches)',
      'Pavé numérique 10 touches intégré idéal saisie de chiffres',
      'Frappe silencieuse et confortable à membrane amortie',
      'Connexion filaire USB Plug-and-Play sans pilote',
      'Pieds inclinables robustes pour une position ergonomique'
    ],
    boxIncludes: ['Clavier AZERTY USB'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-pack-combo',
    name: 'Ensemble Clavier-Souris Sans Fil AZERTY (1 Seul Récepteur USB)',
    category: 'Informatique & PC',
    brand: 'KeyPro',
    price: 29,
    originalPrice: 38,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pack complet bureautique sans fil : clavier AZERTY ultra-fin et souris ergonomique connectés via un seul récepteur USB pour libérer vos ports.',
    longDescription: 'Équipez instantanément un bureau net et sans câbles apparents. Un unique nano-récepteur USB branche simultanément le clavier et la souris sur votre ordinateur portable ou fixe.',
    specs: [
      'Clavier complet AZERTY français et souris sans fil assortie',
      '1 seul nano-récepteur USB pilote les 2 périphériques',
      'Portée sans fil de 10 mètres sans interférence',
      'Touches plates style chiclet rapides et silencieuses',
      'Piles alcalines fournies dans le pack'
    ],
    boxIncludes: ['Clavier sans fil AZERTY', 'Souris optique sans fil', 'Nano-récepteur USB commun', 'Jeu de piles'],
    condition: 'Neuf en boîte scellée',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-hub-usbc',
    name: 'Hub USB-C Multiports 7-en-1 (HDMI 4K, 3x USB 3.0, PD 100W, Lecteur SD)',
    category: 'Informatique & PC',
    brand: 'TechHub',
    price: 35,
    originalPrice: 45,
    stock: 11,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Adaptateur multifonction en aluminium pour ordinateurs portables USB-C (MacBook, Dell, HP, Lenovo). Connectez écran externe, clés et cartes mémoire.',
    longDescription: 'Multipliez instantanément les connectiques de votre PC portable moderne. Branchez un deuxième écran en 4K Ultra HD, vos clés USB classiques et vos cartes photos tout en rechargeant votre ordinateur jusqu\'à 100W.',
    specs: [
      'Sortie vidéo HDMI 4K @ 30Hz / 1080p @ 60Hz pour écran ou téléviseur',
      'Port USB-C Power Delivery 100W pour charger votre PC portable en simultané',
      '3 ports USB 3.0 haute vitesse (5 Gbps) pour clés et disques durs',
      'Double lecteur de cartes mémoire SD et MicroSD (TF)',
      'Châssis en aluminium anodisé dissipant efficacement la chaleur'
    ],
    boxIncludes: ['Hub USB-C multiports 7-en-1 en aluminium', 'Pochette de voyage'],
    condition: 'Neuf boîte d\'origine',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-cle-usb',
    name: 'Clé USB 3.2 Métallique Haute Vitesse (32 Go / 64 Go / 128 Go)',
    category: 'Informatique & PC',
    brand: 'SanDisk / Kingston',
    price: 14,
    originalPrice: 19,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Support de stockage portable robuste en alliage de zinc avec anneau porte-clés. Vitesses de lecture ultra-rapides jusqu\'à 130 Mo/s.',
    longDescription: 'Transférez vos documents administratifs, photos et films en quelques secondes. Résiste aux chocs, à la poussière et aux éclaboussures grâce à son boîtier monobloc en métal.',
    specs: [
      'Interface USB 3.2 Gen 1 rétrocompatible USB 2.0',
      'Vitesse de lecture jusqu\'à 130 Mo/s',
      'Boîtier métallique en alliage d\'aluminium avec passe-clé',
      'Capacités disponibles au comptoir : 32 Go (10€), 64 Go (14€), 128 Go (22€)',
      'Préformatée compatible Windows, Mac et autoradios'
    ],
    boxIncludes: ['Clé USB métallique sous blister d\'origine'],
    condition: 'Neuf sous emballage scellé',
    featured: false,
    warranty: 'Garantie 5 ans'
  },
  {
    id: 'prod-pc-lecteur-sd',
    name: 'Lecteur de Cartes Mémoire SD / MicroSD USB 3.0 Double Slot',
    category: 'Informatique & PC',
    brand: 'FastRead',
    price: 12,
    originalPrice: 16,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Transférez rapidement vos photos d\'appareils photo reflex ou cartes mémoire de caméras/drones vers votre ordinateur.',
    longDescription: 'Double emplacement SD et TF lisible simultanément. Débit de transfert rapide jusqu\'à 5 Gbps sans avoir à installer le moindre logiciel.',
    specs: [
      'Prise en charge cartes SD, SDHC, SDXC, MicroSD, MicroSDHC',
      'Lecture simultanée des deux cartes possible',
      'Vitesse de transfert USB 3.0 jusqu\'à 5 Gbps',
      'Format clé USB de poche avec capuchon protecteur'
    ],
    boxIncludes: ['Lecteur de cartes USB 3.0 double fente'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-cable-hdmi',
    name: 'Câble HDMI 2.0 / 2.1 Haute Vitesse 4K 60Hz Blindé (1,8 m / 3 m)',
    category: 'Informatique & PC',
    brand: 'ProLink',
    price: 12,
    originalPrice: 16,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Câble haute définition pour connecter votre ordinateur, box TV, console (PS5/Xbox) ou lecteur à un moniteur ou téléviseur en 4K UHD.',
    longDescription: 'Connecteurs plaqués or 24 carats et triple blindage électromagnétique pour empêcher toute interruption de signal ou scintillement d\'image. Prise en charge HDR10, son Dolby Atmos et canal de retour audio eARC.',
    specs: [
      'Résolution supportée : 4K @ 60Hz, 2K @ 144Hz, Full HD 1080p',
      'Bande passante de transmission : 18 Gbps',
      'Connecteurs plaqués or résistants à l\'oxydation',
      'Gaine extérieure tressée souple et résistante',
      'Disponible en longueurs 1,8 mètre ou 3 mètres'
    ],
    boxIncludes: ['Câble HDMI 4K blindé avec capuchons de protection'],
    condition: 'Neuf sous sachet zippé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-cable-rj45',
    name: 'Câble Réseau Ethernet RJ45 Cat 6 Gigabit (2 m / 5 m / 10 m)',
    category: 'Informatique & PC',
    brand: 'NetPro',
    price: 8,
    originalPrice: 12,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Câble réseau Gigabit 1000 Mbps pour relier votre PC, imprimante ou console directement à votre box internet Fibre (Freebox, Livebox, SFR, Bouygues).',
    longDescription: 'Profitez de la pleine vitesse de votre connexion fibre optique avec une latence minimale et zéro coupure Wi-Fi. Blindage UTP avec languette de verrouillage protégée.',
    specs: [
      'Catégorie 6 certifiée supportant jusqu\'à 1000 Mbps (1 Gbps) et 250 MHz',
      'Conducteurs en cuivre pur pour une transmission sans perte de paquets',
      'Connecteurs RJ45 universels avec protection d\'ergot',
      'Tailles en stock à Romainville : 2 m (8€), 5 m (12€), 10 m (16€)'
    ],
    boxIncludes: ['Câble Ethernet Cat 6 emballé'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-pc-webcam',
    name: 'Webcam USB 1080p Full HD avec Microphone Antibruit Intégré',
    category: 'Informatique & PC',
    brand: 'VisionCam',
    price: 29,
    originalPrice: 39,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Caméra externe Full HD pour réunions Zoom, Teams, démarches administratives en ligne et cours à distance. Fixation universelle sur écran.',
    longDescription: 'Améliorez nettement la qualité d\'image de vos visioconférences par rapport aux caméras intégrées d\'ordinateurs portables. Ajustement automatique de la luminosité et microphone filtrant les bruits de fond.',
    specs: [
      'Résolution vidéo Full HD 1080p à 30 images par seconde',
      'Correction automatique d\'éclairage en basse luminosité',
      'Microphone omnidirectionnel avec réduction du bruit ambiant',
      'Pince universelle avec pas de vis pour trépied',
      'Installation automatique Plug & Play USB sans pilote'
    ],
    boxIncludes: ['Webcam USB Full HD', 'Cache de confidentialité pour la lentille', 'Manuel'],
    condition: 'Neuf sous boîte',
    featured: false,
    warranty: 'Garantie 2 ans'
  },

  // ==========================================
  // 6. RÉPARATION MOBILE ET PETITS CONSOMMABLES
  // ==========================================
  {
    id: 'prod-rep-tournevis',
    name: 'Kit Tournevis de Précision 24-en-1 Magnétique (Boîtier Aluminium)',
    category: 'Réparation & Outils',
    brand: 'FixPro Tools',
    price: 19,
    originalPrice: 26,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ensemble complet d\'embouts de précision magnétiques en acier S2 trempé pour le démontage de smartphones, PC, consoles et lunettes.',
    longDescription: 'Le kit d\'outillage professionnel indispensable pour ouvrir et réparer smartphones (vis Pentalobe iPhone, Tri-Point Apple Watch, Torx, Phillips, fente). Boîtier coulissant en alliage d\'aluminium avec logement magnétique pour chaque embout.',
    specs: [
      '24 embouts de précision en acier d\'outillage trempé S2 haute dureté (60 HRC)',
      'Manche ergonomique rotatif en aluminium avec pointe magnétique',
      'Embouts spécifiques inclus : Pentalobe P2/P5, Tri-Wing Y0.6, Torx T2-T8, Phillips PH000-PH2',
      'Boîtier métallique pop-up ultra-compact',
      'Conçu pour réparation smartphones, ordinateurs portables, manettes et lunettes'
    ],
    boxIncludes: ['Manche de tournevis aluminium magnétique', '24 embouts de précision S2', 'Boîtier coulissant en aluminium'],
    condition: 'Neuf sous boîte scellée',
    featured: true,
    warranty: 'Garantie à vie fabricant'
  },
  {
    id: 'prod-rep-kit-ouverture',
    name: 'Kit d\'Ouverture Smartphone & Spudgers Professionnels',
    category: 'Réparation & Outils',
    brand: 'FixPro Tools',
    price: 12,
    originalPrice: 16,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Outils fins, ventouse haute traction, spudgers antistatiques et médiators pour décoller et ouvrir les écrans sans abîmer les châssis.',
    longDescription: 'Comprend tous les outils plastiques et métalliques souples pour décoller les vitres arrière, séparer les écrans collés et déconnecter les nappes électroniques en toute sécurité.',
    specs: [
      'Ventouse à anneau haute adhérence pour décollement d\'écran',
      'Médiators d\'ouverture ultra-fins en plastique résistant',
      'Spatules et spudgers antistatiques ESD en nylon',
      'Lame métallique souple de décollage pour adhésifs tenaces',
      'Pince de précision courbée en acier inoxydable'
    ],
    boxIncludes: ['Jeu de 10 outils d\'ouverture et démontage'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-rep-tapis-anti',
    name: 'Tapis de Réparation Antistatique Résistant à la Chaleur (500°C)',
    category: 'Réparation & Outils',
    brand: 'MatTech',
    price: 18,
    originalPrice: 24,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Surface de travail en silicone antistatique avec compartiments numérotés et zones magnétiques pour organiser les vis pendant le démontage.',
    longDescription: 'Résiste aux pointes de fers à souder et aux décapeurs thermiques jusqu\'à 500°C. Organisez vos petites vis par étape grâce aux cases magnétisées pour ne jamais en perdre lors d\'un remplacement d\'écran ou de batterie.',
    specs: [
      'Silicone souple résistant à la chaleur jusqu\'à 500°C',
      'Propriétés antistatiques ESD protégeant les cartes mères fragiles',
      'Nombreux compartiments pour vis et fentes pour tournevis',
      'Facilement lavable à l\'eau ou à l\'alcool isopropylique',
      'Dimensions confortables : 30 x 20 cm'
    ],
    boxIncludes: ['Tapis en silicone antistatique'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-rep-adhesifs',
    name: 'Bandes Adhésives de Remplacement Écran & Batterie (Lot Découpé)',
    category: 'Réparation & Outils',
    brand: 'TapePro',
    price: 6,
    originalPrice: 9,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Joints d\'étanchéité prédécoupés et bandes adhésives élastiques à languettes de traction pour fixer solidement les batteries neuves.',
    longDescription: 'Restaurez l\'étanchéité d\'origine de l\'écran et installez les nouvelles batteries en toute conformité grâce à ces bandes adhésives pelables sans résidu.',
    specs: [
      'Adhésif acrylique double face haute adhérence',
      'Bandes de batterie à retrait extensible (stretch release)',
      'Joint d\'étanchéité d\'écran prédécoupé selon le modèle exact',
      'Résistant aux variations de température'
    ],
    boxIncludes: ['Lot de 2 joints d\'étanchéité d\'écran + 4 bandes adhésives batterie'],
    condition: 'Neuf sous pochette protectrice',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-rep-alcool',
    name: 'Alcool Isopropylique 99.9% Spécial Électronique (Flacon 250 ml)',
    category: 'Réparation & Outils',
    brand: 'PureChem',
    price: 12,
    originalPrice: 15,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Solvant pur à 99.9% pour nettoyer les circuits imprimés, dissoudre les résidus de colle d\'écran et désoxyder les composants après chute dans l\'eau.',
    longDescription: 'Le produit de nettoyage indispensable de tout atelier de réparation électronique. S\'évapore instantanément sans laisser aucun résidu ni trace, idéal pour nettoyer les lentilles de caméras, connecteurs de charge encrassés et processeurs.',
    specs: [
      'Pureté certifiée : 99.9% isopropanol (IPA)',
      'Évaporation ultra-rapide sans humidité résiduelle',
      'Non conducteur : idéal pour circuits imprimés et cartes mères',
      'Bouchon verseur sécurisé avec compte-gouttes précis',
      'Contenance : 250 ml'
    ],
    boxIncludes: ['Flacon de 250 ml d\'alcool isopropylique 99.9%'],
    condition: 'Neuf scellé',
    featured: false,
    warranty: 'Conforme fiches de données de sécurité'
  },
  {
    id: 'prod-rep-brosses',
    name: 'Brosses Antistatiques de Nettoyage (Lot de 3 Tailles)',
    category: 'Réparation & Outils',
    brand: 'FixPro Tools',
    price: 6,
    originalPrice: 9,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Petites brosses aux poils synthétiques antistatiques ESD pour dépoussiérer les ports USB-C, grilles de haut-parleurs et connecteurs.',
    longDescription: 'Résolvez vous-même les problèmes de faux contacts de charge souvent provoqués par des peluches de poche tassées au fond de la prise USB-C ou Lightning. Poils antistatiques ne générant aucune charge électrostatique.',
    specs: [
      'Fibres synthétiques conductrices ESD antistatiques',
      '3 formes complémentaires : plate large, fine d\'angle et brosse ronde',
      'Manches en plastique rigide ergonomique'
    ],
    boxIncludes: ['Set de 3 brosses antistatiques'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-rep-pieces-oem',
    name: 'Écrans et Batteries de Remplacement Qualité Origine (Sur Devis / Pose Atelier)',
    category: 'Réparation & Outils',
    brand: 'OEM Parts',
    price: 59,
    originalPrice: 79,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pièces détachées testées individuellement pour smartphones : blocs écrans complets OLED/LCD et batteries neuves haute capacité. Remplacement express en atelier.',
    longDescription: 'Besoin de remplacer votre écran fissuré ou votre batterie qui se décharge trop vite ? Nos pièces répondent aux normes constructeurs avec affichage des couleurs exact et autonomie retrouvée. Pose réalisable en 30 à 45 minutes dans notre atelier au 4-6 boulevard de la Boissière à Romainville.',
    specs: [
      'Écrans calibrés avec numériseur tactile ultra-réactif',
      'Batteries neuves 0 cycle avec protection contre surcharge',
      'Compatibilité avec tous modèles iPhone, Samsung, Xiaomi et Redmi',
      'Tests de fonctionnalité rigoureux avant et après intervention',
      'Garantie pièces et main-d\'œuvre en magasin'
    ],
    boxIncludes: ['Pièce détachée conforme ou forfait remplacement atelier', 'Facture et garantie'],
    condition: 'Neuf testé',
    featured: true,
    warranty: 'Garantie atelier 12 mois'
  },

  // ==========================================
  // 7. ARTICLES DU QUOTIDIEN ET DÉPANNAGE
  // ==========================================
  {
    id: 'prod-quot-piles-aa',
    name: 'Piles Alcalines AA (LR6) 1.5 V — Pack de 4 Piles Longue Durée',
    category: 'Articles du quotidien',
    brand: 'Duracell / Varta',
    price: 5,
    originalPrice: 7,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Piles alcalines standard format AA LR6 pour télécommandes, horloges, claviers sans fil, jouets et souris d\'ordinateur.',
    longDescription: 'Piles alcalines haute performance garantissant une tension constante de 1.5V et une conservation d\'énergie jusqu\'à 10 ans dans leur emballage. Technologie anti-fuite protégeant vos appareils électroniques.',
    specs: [
      'Format : AA / LR06 / Mignon 1.5V',
      'Chimie : Alcaline Dioxyde de Manganèse',
      'Technologie Duralock préservant l\'énergie jusqu\'à 10 ans de stockage',
      'Pack économique de 4 piles scellées'
    ],
    boxIncludes: ['Pack blister de 4 piles alcalines AA'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie conservation 10 ans'
  },
  {
    id: 'prod-quot-piles-aaa',
    name: 'Piles Alcalines AAA (LR03) 1.5 V — Pack de 4 Piles',
    category: 'Articles du quotidien',
    brand: 'Duracell / Varta',
    price: 5,
    originalPrice: 7,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Petites piles alcalines AAA LR03 pour télécommandes de télévision, thermomètres, balances et pointeurs laser.',
    longDescription: 'Délivrent une énergie stable et fiable. Indispensables pour le dépannage rapide des petits accessoires du quotidien dans votre quartier.',
    specs: [
      'Format : AAA / LR03 / Micro 1.5V',
      'Pack de 4 piles alcalines neuves',
      'Énergie longue durée avec protection anti-coulure'
    ],
    boxIncludes: ['Pack de 4 piles AAA'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie conservation'
  },
  {
    id: 'prod-quot-adapt-voyage',
    name: 'Adaptateur de Voyage Universel Tout-en-Un (US / UK / EU / AU + 2x USB)',
    category: 'Articles du quotidien',
    brand: 'TravelEase',
    price: 15,
    originalPrice: 20,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445268045-3f5f3e9b1192?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Adaptateur universel compact compatible avec plus de 150 pays (États-Unis, Royaume-Uni, Europe, Australie, Asie) avec 2 ports USB de charge rapide intégrés.',
    longDescription: 'Partez l\'esprit serein à l\'étranger : faites coulisser le curseur correspondant au pays de votre destination pour déployer la prise adéquate. Les deux ports USB intégrés vous permettent en plus de recharger directement vos téléphones sans adaptateur supplémentaire.',
    specs: [
      'Curseurs rétractables pour prises UK, USA, Europe et Australie (plus de 150 pays)',
      '2 ports USB 2.4A intégrés pour smartphones et tablettes',
      'Volet de sécurité enfants et fusible de protection remplaçable 6A',
      'Voyant LED indicateur de mise sous tension'
    ],
    boxIncludes: ['Adaptateur voyage universel', 'Fusible de secours de rechange', 'Guide'],
    condition: 'Neuf sous emballage',
    featured: true,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-quot-multiprise',
    name: 'Bloc Multiprise 4 Prises Françaises avec Interrupteur & Parasurtenseur',
    category: 'Articles du quotidien',
    brand: 'ElectraSafe',
    price: 14,
    originalPrice: 19,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rallonge multiprise sécurisée avec 4 prises de terre françaises, interrupteur général lumineux marche/arrêt et câble épais de 1,5 mètre.',
    longDescription: 'Protège vos ordinateurs, téléviseurs et box internet des surtensions électriques et coups de foudre. Interrupteur à voyant lumineux permettant d\'éteindre tous les appareils en veille pour faire des économies d\'énergie.',
    specs: [
      '4 prises 16A avec terre et sécurité enfants intégrée (clapets d\'obturation)',
      'Interrupteur marche/arrêt lumineux',
      'Protection parafoudre et filtre contre les pics de tension',
      'Puissance admissible max : 3500 Watts (230V / 16A)',
      'Cordon épais de 1,5 mètre'
    ],
    boxIncludes: ['Bloc multiprise parafoudre 4 prises'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-quot-ampoule-led',
    name: 'Ampoule LED E27 / E14 Économie d\'Énergie (Blanc Chaud / Neutre)',
    category: 'Articles du quotidien',
    brand: 'EcoBright',
    price: 6,
    originalPrice: 9,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ampoule LED basse consommation 9W (équivalent 60W classique), allumage instantané sans temps de chauffe et durée de vie de 15 000 heures.',
    longDescription: 'Réduisez votre facture électrique grâce à la technologie LED classe A+. Disponible au choix en culot à visser gros culot E27 ou petit culot E14, en lumière blanc chaud agréable pour le salon ou blanc neutre pour les pièces de travail.',
    specs: [
      'Puissance consommée : 9 Watts (équivalent 60W halogène traditionnel)',
      'Flux lumineux : 806 Lumens',
      'Température de couleur : 2700K (Blanc chaud relaxant) ou 4000K (Blanc naturel)',
      'Durée de vie moyenne estimée à 15 000 heures (~15 ans d\'usage domestique)',
      'Allumage à 100% instantané en moins de 0,5 seconde'
    ],
    boxIncludes: ['Ampoule LED sous cartonnette'],
    condition: 'Neuf en boîte',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-quot-lampe-torche',
    name: 'Lampe Torche LED Rechargeable USB en Aluminium (Zoom Réglable)',
    category: 'Articles du quotidien',
    brand: 'LumixPro',
    price: 16,
    originalPrice: 22,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lampe de poche tactique puissante en métal robuste étanche IPX4, rechargeable directement en USB sans avoir à changer de piles.',
    longDescription: 'Éclairage puissant jusqu\'à 200 mètres grâce à sa tête télescopique permettant de zoomer d\'un faisceau large pour éclairer une pièce à un spot concentré longue portée. 3 modes d\'éclairage : fort, économique et stroboscope d\'urgence.',
    specs: [
      'LED haute luminosité 800 Lumens',
      'Faisceau réglable par bague zoom télescopique',
      'Batterie lithium intégrée rechargeable par port USB standard',
      'Corps antichoc en alliage d\'aluminium aéronautique anodisé noir',
      'Clip de ceinture métallique solide et dragonne'
    ],
    boxIncludes: ['Lampe torche LED rechargeable', 'Câble de recharge USB', 'Dragonne'],
    condition: 'Neuf sous boîte',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-quot-parapluie',
    name: 'Parapluie Compact Automatique Anti-Vent (Ouverture & Fermeture 1-Clic)',
    category: 'Articles du quotidien',
    brand: 'StormShield',
    price: 12,
    originalPrice: 17,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Parapluie pliant de poche résistant aux rafales avec armature renforcée à 8 baleines et bouton d\'ouverture/fermeture automatique rapide d\'une seule main.',
    longDescription: 'Ne vous faites plus surprendre par les averses parisiennes à la sortie du métro ou du bus. Se déploie et se replie d\'une simple pression sur le bouton du manche. Toile déperlante haute densité à séchage rapide.',
    specs: [
      'Système automatique Open/Close par bouton sur le manche',
      'Armature anti-retournement avec 8 baleines renforcées en fibre de verre',
      'Toile pongée déperlante haute densité 210T à séchage éclair',
      'Taille plié : 28 cm compact facile à glisser dans une sacoche',
      'Poignée ergonomique avec revêtement doux et lanière'
    ],
    boxIncludes: ['Parapluie compact automatique', 'Housse de protection imperméable'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie 1 an'
  },
  {
    id: 'prod-quot-cadenas',
    name: 'Cadenas à Combinaison 4 Chiffres en Acier Trempé',
    category: 'Articles du quotidien',
    brand: 'SecurLock',
    price: 8,
    originalPrice: 12,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Cadenas résistant sans clé avec code personnalisable à 4 molettes (10 000 combinaisons). Idéal pour casiers de sport, valises et remises.',
    longDescription: 'Oubliez les clés perdues ! Choisissez votre propre code secret à 4 chiffres et modifiez-le à volonté grâce au mécanisme de réinitialisation simple. Anse en acier trempé résistant aux pinces et aux chocs.',
    specs: [
      'Combinaison personnalisable à 4 chiffres (10 000 codes possibles)',
      'Anse en acier trempé résistant au sciage et au crochetage',
      'Corps en alliage de zinc lourd et résistant aux intempéries',
      'Format adapté aux casiers scolaires, salles de sport et bagages'
    ],
    boxIncludes: ['Cadenas à code 4 chiffres', 'Notice de réinitialisation du code'],
    condition: 'Neuf sous blister',
    featured: false,
    warranty: 'Garantie 2 ans'
  },
  {
    id: 'prod-quot-papeterie',
    name: 'Kit Papeterie & Écriture du Quotidien (Stylos Bille, Bloc-Notes, Enveloppes)',
    category: 'Articles du quotidien',
    brand: 'BureauExpress',
    price: 4,
    originalPrice: 6,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lot indispensable d\'écriture pour vos démarches et prises de notes rapides : 4 stylos bille encre bleue/noire, bloc-notes et enveloppes.',
    longDescription: 'Pour remplir un formulaire administratif, signer un document en boutique ou noter un rendez-vous. Encres à bille fluides sans bavure.',
    specs: [
      'Pointe moyenne 1,0 mm pour une écriture fluide et régulière',
      'Assortiment de 4 stylos (2 bleus, 1 noir, 1 rouge)',
      'Bloc-notes de poche à feuilles détachables inclus'
    ],
    boxIncludes: ['Lot de 4 stylos bille de qualité + mini bloc-notes'],
    condition: 'Neuf sous pochette',
    featured: false,
    warranty: 'Garantie conformité'
  },

  // ==========================================
  // 8. IMPRESSION ET BUREAUTIQUE
  // ==========================================
  {
    id: 'prod-imp-papier-a4',
    name: 'Ramette de Papier A4 80 g/m² (500 Feuilles Blancheur Supérieure)',
    category: 'Impression & Bureautique',
    brand: 'Clairefontaine / Navigator',
    price: 6.5,
    originalPrice: 8.5,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Papier blanc universel haute blancheur certifié FSC (CIE 161) pour toutes imprimantes laser, copieurs et jet d\'encre. Zéro bourrage garanti.',
    longDescription: 'La ramette de papier standard par excellence pour imprimer vos CV, contrats, démarches administratives Caf/Pôle Emploi ou devoirs scolaires. Traitement de surface limitant la poussière de papier pour préserver les rouleaux d\'entraînement de votre imprimante.',
    specs: [
      'Format standard A4 (21 x 29,7 cm)',
      'Grammage : 80 grammes par mètre carré',
      'Contenance : 500 feuilles blanches',
      'Indice de blancheur élevé CIE 161 pour un contraste optimal des textes',
      'Certifié éco-responsable FSC et Ecolabel européen'
    ],
    boxIncludes: ['Ramette scellée de 500 feuilles A4'],
    condition: 'Neuf sous emballage d\'origine',
    featured: true,
    warranty: 'Garantie qualité papier'
  },
  {
    id: 'prod-imp-papier-photo',
    name: 'Papier Photo A4 Glacé Brillant 200 g/m² (Pochette de 20 Feuilles)',
    category: 'Impression & Bureautique',
    brand: 'PhotoPrint Pro',
    price: 9,
    originalPrice: 12,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Papier photo couché brillant pour tirages photo haute résolution. Séchage instantané, couleurs éclatantes et fidélité de rendu d\'image.',
    longDescription: 'Imprimez vos plus belles photos de famille, portraits ou créations graphiques avec un rendu digne d\'un laboratoire photo. Revêtement microporeux absorbant l\'encre sans bavure et résistant aux projections d\'eau.',
    specs: [
      'Grammage épais qualité photo : 200 g/m²',
      'Finition glacée ultra-brillante (Glossy)',
      'Compatible toutes imprimantes jet d\'encre (Canon, Epson, HP, Brother)',
      'Résolution d\'impression supportée jusqu\'à 5760 DPI',
      'Pochette refermable de 20 feuilles format A4'
    ],
    boxIncludes: ['Pochette de 20 feuilles photo glacées'],
    condition: 'Neuf sous pochette protectrice',
    featured: false,
    warranty: 'Garantie conformité'
  },
  {
    id: 'prod-imp-enveloppes',
    name: 'Enveloppes Autocollantes Format C6 / DL / C5 (Lot de 25 / 50)',
    category: 'Impression & Bureautique',
    brand: 'PostaSafe',
    price: 3.5,
    originalPrice: 5,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Enveloppes postales blanches avec bande adhésive protectrice détachable (fermeture sans mouiller). Intérieur teinté garantissant la confidentialité des courriers.',
    longDescription: 'Parfaites pour vos envois postaux, courriers recommandés, fiches de paie ou déclarations. Disponibles en formats courants : DL (110 x 220 mm pour feuille A4 pliée en 3) ou C5 (162 x 229 mm pour feuille pliée en 2).',
    specs: [
      'Fermeture rapide par patte autocollante avec bande protectrice pelable',
      'Intérieur bleu confidentiel empêchant de lire le contenu par transparence',
      'Papier vélin blanc 80 g de qualité postale La Poste',
      'Lot de 25 ou 50 enveloppes'
    ],
    boxIncludes: ['Lot d\'enveloppes scellées'],
    condition: 'Neuf sous film',
    featured: false,
    warranty: 'Garantie conformité'
  },
  {
    id: 'prod-imp-chemises',
    name: 'Chemises & Pochettes Plastiques Transparentes Perforées A4 (Lot de 25)',
    category: 'Impression & Bureautique',
    brand: 'ClassDoc',
    price: 4,
    originalPrice: 6,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pochettes transparentes perforées grainées indélébiles pour classeurs et dossiers administratifs. Protège vos feuilles de l\'usure et des taches.',
    longDescription: 'Organisez vos quittances de loyer, factures d\'énergie, relevés bancaires et contrats de travail. Polypropylène haute résistance antistatique n\'altérant pas les encres des documents.',
    specs: [
      'Format A4 standard avec bande de perforation renforcée 11 trous',
      'Finition grainée antireflet très lisible',
      'Matière polypropylène sans acide qui n\'arrache pas l\'encre toner',
      'Lot de 25 pochettes transparentes'
    ],
    boxIncludes: ['Paquet de 25 pochettes perforées A4'],
    condition: 'Neuf emballé',
    featured: false,
    warranty: 'Garantie conformité'
  },
  {
    id: 'prod-imp-cartouches',
    name: 'Cartouches d\'Encre Compatibles Haute Capacité (Canon, HP, Epson)',
    category: 'Impression & Bureautique',
    brand: 'InkJEt Pro',
    price: 19,
    originalPrice: 28,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Cartouches d\'encre testées avec puce de détection de niveau d\'encre. Économisez jusqu\'à 60% par rapport aux cartouches de marque sans compromis sur la netteté.',
    longDescription: 'Retrouvez vos références d\'imprimantes les plus courantes directement dans notre boutique à Romainville (séries Canon PG-545/CL-546, PGI-580, HP 301, 302, 304, 305 XL, Epson 29, 603, etc.). Remplissage haute capacité XL pour imprimer deux fois plus de pages.',
    specs: [
      'Puce électronique dernière génération reconnue immédiatement par l\'imprimante',
      'Volume d\'encre XL permettant d\'imprimer jusqu\'à 450 pages texte',
      'Encre pigmentée noire intense et encres couleur formulées pour zéro bouchage',
      'Vérification de compatibilité de votre modèle en direct au comptoir'
    ],
    boxIncludes: ['Cartouche d\'encre sous emballage hermétique scellé'],
    condition: 'Neuf sous boîte scellée',
    featured: true,
    warranty: 'Garantie 2 ans avec échange si problème'
  },
  {
    id: 'prod-imp-agrafeuse',
    name: 'Agrafeuse de Bureau en Métal Robuste + Boîte de 1000 Agrafes 26/6',
    category: 'Impression & Bureautique',
    brand: 'OfficeGrip',
    price: 8,
    originalPrice: 12,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Agrafeuse métallique de bureau pour relier jusqu\'à 25 feuilles A4 sans effort. Livrée complète avec une boîte de 1000 agrafes et dégrafeur intégré.',
    longDescription: 'L\'outil indispensable pour assembler vos dossiers de candidature, déclarations et fiches de paie. Mécanisme en acier résistant aux blocages avec enclume pivotante permettant au choix l\'agrafage permanent ou temporaire.',
    specs: [
      'Capacité d\'agrafage : jusqu\'à 25 feuilles 80g en une seule pression',
      'Corps en acier durable avec base antidérapante en caoutchouc',
      'Compatible agrafes standard 24/6 et 26/6',
      'Dégrafeur métallique intégré à l\'arrière pour retirer facilement les agrafes',
      'Livrée avec 1 000 agrafes de bureau prêtes à l\'emploi'
    ],
    boxIncludes: ['Agrafeuse de bureau métal', 'Boîte de 1 000 agrafes 26/6'],
    condition: 'Neuf en boîte',
    featured: false,
    warranty: 'Garantie 2 ans'
  }
];
