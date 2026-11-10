import { 
  RepairServiceTariff, 
  PrintPricingSettings, 
  MoneyTransferPartner, 
  StoreSettings, 
  ServiceSlideItem 
} from '../types';

export const INITIAL_REPAIR_TARIFFS: RepairServiceTariff[] = [
  {
    id: 'rep-1',
    name: "Remplacement d'écran / vitre OLED",
    price: 'À partir de 49 €',
    numericPrice: 49,
    time: '30 à 45 min',
    warranty: 'Garantie 6 mois',
    deviceType: 'iPhone & Android',
    description: 'Pose d\'écran haute définition OLED/LCD certifié avec transfert TrueTone et calibration tactile.',
    active: true
  },
  {
    id: 'rep-2',
    name: 'Remplacement de batterie',
    price: 'À partir de 35 €',
    numericPrice: 35,
    time: '20 à 30 min',
    warranty: 'Garantie 6 mois',
    deviceType: 'Tous modèles',
    description: 'Batterie neuve haute capacité grade AAA avec cycle zéro et santé 100%.',
    active: true
  },
  {
    id: 'rep-3',
    name: 'Connecteur de charge / Port USB-C',
    price: 'À partir de 39 €',
    numericPrice: 39,
    time: '30 min',
    warranty: 'Garantie 6 mois',
    deviceType: 'Tous modèles',
    description: 'Remplacement de la nappe de charge ou désobstruction approfondie en cas de faux contact.',
    active: true
  },
  {
    id: 'rep-4',
    name: 'Désimlockage réseau / Déblocage tout opérateur',
    price: 'À partir de 20 €',
    numericPrice: 20,
    time: '15 à 30 min',
    warranty: 'Déblocage permanent',
    deviceType: 'Tous opérateurs',
    description: 'Désimlockage définitif officiel tout opérateur (Orange, SFR, Bouygues, Free, international).',
    active: true
  },
  {
    id: 'rep-5',
    name: 'Réinitialisation compte & code de verrouillage',
    price: 'À partir de 25 €',
    numericPrice: 25,
    time: '30 à 60 min',
    warranty: 'Service garanti',
    deviceType: 'Android & iOS',
    description: 'Remise à zéro d\'usine sur présentation de justificatif d\'achat, suppression des blocages logiciels.',
    active: true
  },
  {
    id: 'rep-6',
    name: 'Désoxydation bain à ultrasons (téléphone tombé dans l\'eau)',
    price: '35 € forfait diagnostic',
    numericPrice: 35,
    time: '2 à 3 heures',
    warranty: 'Bain ultrasons',
    deviceType: 'Tous appareils',
    description: 'Démontage complet, passage en cuve à ultrasons avec solvant désoxydant spécialisé et séchage thermique.',
    active: true
  },
  {
    id: 'rep-7',
    name: 'Réparation caméra avant / arrière',
    price: 'À partir de 40 €',
    numericPrice: 40,
    time: '40 min',
    warranty: 'Garantie 6 mois',
    deviceType: 'iPhone & Android',
    description: 'Changement de capteur photo flou, lentille cassée ou stabilisateur optique défaillant.',
    active: true
  },
  {
    id: 'rep-8',
    name: 'Haut-parleur & écouteur d\'appel',
    price: 'À partir de 30 €',
    numericPrice: 30,
    time: '30 min',
    warranty: 'Garantie 6 mois',
    deviceType: 'Tous modèles',
    description: 'Restauration du son grésillant, micro muet ou écouteur interne inaudible lors des conversations.',
    active: true
  }
];

export const INITIAL_PRINT_PRICING: PrintPricingSettings = {
  bwA4: 0.15,
  bwA3: 0.30,
  colorA4: 0.40,
  colorA3: 0.80,
  laminationA4: 2.00,
  scanPerPage: 0.30,
  faxPerPage: 1.50,
  internetHourlyRate: 2.50,
  bindingPerPage: 3.50
};

export const INITIAL_MONEY_PARTNERS: MoneyTransferPartner[] = [
  {
    id: 'partner-wu',
    name: 'Western Union',
    feeFrom: 'À partir de 1,90 €',
    speed: 'Immédiat (quelques minutes)',
    description: 'Réseau mondial de plus de 500 000 agences. Retrait en espèces ou virement direct sur compte bancaire.',
    active: true
  },
  {
    id: 'partner-ria',
    name: 'Ria Money Transfer',
    feeFrom: 'À partir de 1,50 €',
    speed: 'Immédiat au guichet',
    description: 'Taux de change compétitifs vers l\'Afrique, l\'Asie, l\'Amérique Latine et l\'Europe.',
    active: true
  },
  {
    id: 'partner-mg',
    name: 'MoneyGram',
    feeFrom: 'À partir de 1,90 €',
    speed: 'Instantané',
    description: 'Envoi sécurisé vers comptes bancaires et portefeuilles mobiles dans plus de 200 pays.',
    active: true
  },
  {
    id: 'partner-om',
    name: 'Orange Money',
    feeFrom: 'Sans frais cachés',
    speed: 'Instantané sur mobile',
    description: 'Recharges et transferts directs vers les portefeuilles Orange Money en Afrique de l\'Ouest et Centrale.',
    active: true
  },
  {
    id: 'partner-ding',
    name: 'Ding',
    feeFrom: 'Dès 1 € de recharge',
    speed: 'Instantané',
    description: 'Recharges de crédit de communication et données internet vers plus de 150 pays.',
    active: true
  },
  {
    id: 'partner-joxko',
    name: 'Joxko',
    feeFrom: 'Taux direct',
    speed: 'Directement au numéro',
    description: 'Envoi d\'unités de recharges téléphoniques internationales immédiates.',
    active: true
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: '3 Communes Informatique',
  streetAddress: '4-6 boulevard de la Boissière',
  cityZip: '93230 Romainville, France',
  phone: '01.43.93.16.79',
  whatsapp: '+33 7 58 46 47 62',
  email: '3communesinfo@gmail.com',
  openingHours: 'Ouvert 7 jours sur 7 (09:00 - 20:00)',
  announcementBanner: 'Ouvert 7j/7 sans interruption • Transferts d\'argent & réparations express en 30 min',
  announcementActive: false,
  warrantyInfo: 'Jusqu\'à 24 mois de garantie magasin sur produits & réparations',
  transitInfo: 'Lignes de bus 129, 318, 105 • Dépose-minute gratuit devant la boutique'
};

export const INITIAL_SLIDER_ITEMS: ServiceSlideItem[] = [
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
    actionTab: 'money'
  },
  {
    id: 'phones',
    number: '02',
    title: "Téléphones, informatique et accessoires",
    tagline: "Smartphones neufs et reconditionnés certifiés",
    tag: "Smartphones • Coques • Verres 9H • Chargeurs GaN",
    description: "Smartphones neufs et reconditionnés certifiés, coques antichocs, verres trempés 9H avec pose offerte et chargeurs rapides.",
    highlights: [
      "Garantie magasin jusqu'à 24 mois",
      "Pose offerte des protections écran 9H",
      "Accessoires certifiés et câbles tressés"
    ],
    image: "/assets/aistudio/slide-2-telephones-informatique_6bbdcef5.png",
    actionText: "Voir le catalogue produits",
    actionTab: 'accessories'
  },
  {
    id: 'repairs',
    number: '03',
    title: "Votre téléphone réparé, sans attendre",
    tagline: "Réparation express en 30 minutes sans rendez-vous",
    tag: "Atelier Express • Romainville 93230",
    description: "Remplacement d'écrans cassés, batteries, connecteurs de charge, désoxydation et désimlockage définitif tout opérateur.",
    highlights: [
      "Intervention en 30 minutes sans rendez-vous",
      "Pièces certifiées d'origine ou grade A",
      "Devis gratuit et transparent avant travaux"
    ],
    image: "/assets/aistudio/slide-3-reparation-express_b234977c.png",
    actionText: "Estimer une réparation",
    actionTab: 'repairs'
  },
  {
    id: 'print',
    number: '04',
    title: "Copiez, imprimez, numérisez",
    tagline: "Noir et blanc ou couleur haute fidélité",
    tag: "A4 • A3 • Clé USB • Smartphone • E-mail",
    description: "Impression et photocopie noir et blanc ou couleur haute fidélité depuis clé USB, e-mail ou smartphone. Numérisation PDF instantanée.",
    highlights: [
      "Noir & blanc dès 0,15 € / Couleur HD dès 0,40 €",
      "Impression depuis smartphone, clé USB ou e-mail",
      "Numérisation haute résolution vers e-mail ou clé"
    ],
    image: "/assets/aistudio/slide-4-photocopie-impression_b1477245.png",
    actionText: "Écrivez-nous sur WhatsApp",
    actionTab: 'print'
  },
  {
    id: 'lamination',
    number: '05',
    title: "Plastification et fax",
    tagline: "Plastification thermique A4, A3 et cartes",
    tag: "Pochettes thermiques • Télécopie France & Monde",
    description: "Plastification thermique rigide A4, A3 et cartes. Envoi et réception de fax en France et à l'international avec récépissé de transmission.",
    highlights: [
      "Plastification thermique étanche et anti-déchirure",
      "Formats A4, A3, cartes et badges",
      "Envoi et réception de fax avec accusé officiel"
    ],
    image: "/assets/aistudio/slide-5-plastification-fax_7ff9a156.png",
    actionText: "Écrivez-nous sur WhatsApp",
    actionTab: 'print'
  },
  {
    id: 'cyber',
    number: '06',
    title: "Internet et démarches en ligne",
    tagline: "Ordinateurs en fibre, démarches administratives",
    tag: "Fibre Très Haut Débit • Espace informatique",
    description: "Ordinateurs connectés à la fibre optique pour toutes vos démarches administratives (CAF, Ameli, ANTS, Pôle Emploi), billets de train/avion et CV.",
    highlights: [
      "Fibre très haut débit avec postes individuels calmes",
      "Assistance bienveillante pour démarches en ligne",
      "Confidentialité garantie : aucune trace conservée"
    ],
    image: "/assets/aistudio/slide-6-internet-demarches_be1360e2.png",
    actionText: "Écrivez-nous sur WhatsApp",
    actionTab: 'services'
  }
];
