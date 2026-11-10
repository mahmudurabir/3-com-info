import React, { useState, useEffect } from 'react';
import { 
  Product, 
  ProductCategory, 
  AdminAccount, 
  AdminRole, 
  AuditLogEntry, 
  AuditActionType,
  INITIAL_ADMIN_ACCOUNTS,
  RepairServiceTariff,
  PrintPricingSettings,
  MoneyTransferPartner,
  StoreSettings,
  ServiceSlideItem,
  CustomerRequest
} from '../types';
import { INITIAL_AUDIT_LOGS } from '../data/initialAuditLogs';
import { authService } from '../services/authService';
import { AuditTrailView } from './AuditTrailView';
import { AdminAccountsView } from './AdminAccountsView';
import { AdminRepairsView } from './admin/AdminRepairsView';
import { AdminPrintPricingView } from './admin/AdminPrintPricingView';
import { AdminMoneyTransferView } from './admin/AdminMoneyTransferView';
import { AdminSliderView } from './admin/AdminSliderView';
import { AdminStoreSettingsView } from './admin/AdminStoreSettingsView';
import { AdminRequestsView } from './admin/AdminRequestsView';
import { AdminSecurityView } from './admin/AdminSecurityView';
import { 
  ShieldAlert,
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Lock, 
  LogIn, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  LogOut, 
  KeyRound, 
  Tag, 
  FolderPlus, 
  AlertCircle,
  Package,
  History,
  Users,
  Shield,
  ArrowRight,
  Wrench,
  Printer,
  Send,
  SlidersHorizontal,
  Settings,
  Inbox,
  UserPlus
} from 'lucide-react';

interface ProductBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: string[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  onAddCategory: (newCategory: string) => boolean;
  onDeleteCategory?: (category: string) => void;

  // Full dynamic administration props
  repairTariffs: RepairServiceTariff[];
  onUpdateRepairTariffs: (tariffs: RepairServiceTariff[]) => void;
  onResetRepairTariffs?: () => void;

  printPricing: PrintPricingSettings;
  onUpdatePrintPricing: (pricing: PrintPricingSettings) => void;
  onResetPrintPricing?: () => void;

  moneyPartners: MoneyTransferPartner[];
  onUpdateMoneyPartners: (partners: MoneyTransferPartner[]) => void;
  onResetMoneyPartners?: () => void;

  sliderItems: ServiceSlideItem[];
  onUpdateSliderItems: (items: ServiceSlideItem[]) => void;
  onResetSliderItems?: () => void;

  storeSettings: StoreSettings;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  onResetStoreSettings?: () => void;

  // Customer Requests & Orders Inbox
  customerRequests?: CustomerRequest[];
  onUpdateCustomerRequestStatus?: (id: string, status: CustomerRequest['status']) => void;
  onDeleteCustomerRequest?: (id: string) => void;
  currentUser?: AdminAccount | null;
  onCurrentUserChange?: (admin: AdminAccount | null) => void;
}

const ADMINS_STORAGE_KEYS = [
  '3communes_admin_accounts_v2',
  '3communes_admin_accounts_v1',
  '3communes_admin_accounts',
  '3communes_admins'
];

export const loadAllStoredAdmins = (): AdminAccount[] => {
  const merged: AdminAccount[] = [];
  const seenUsernames = new Set<string>();

  // Always seed INITIAL_ADMIN_ACCOUNTS first (Safayet Sharif and default admins)
  for (const acc of INITIAL_ADMIN_ACCOUNTS) {
    merged.push({ ...acc });
    seenUsernames.add(acc.username.trim().toLowerCase());
    if (acc.email) seenUsernames.add(acc.email.trim().toLowerCase());
  }

  // Load from each storage key to recover any accounts created in any version
  for (const key of ADMINS_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.username) {
              const uLower = item.username.trim().toLowerCase();
              const eLower = (item.email || '').trim().toLowerCase();
              const existingIndex = merged.findIndex(
                (a) => a.username.trim().toLowerCase() === uLower || (eLower && (a.email || '').trim().toLowerCase() === eLower)
              );
              if (existingIndex >= 0) {
                if (item.password) {
                  merged[existingIndex].password = item.password;
                }
                if (item.name) {
                  merged[existingIndex].name = item.name;
                }
                if (item.role) {
                  merged[existingIndex].role = item.role;
                }
              } else {
                merged.push(item);
                seenUsernames.add(uLower);
                if (eLower) seenUsernames.add(eLower);
              }
            }
          }
        }
      }
    } catch {}
  }

  // Ensure permanent root Super Admin (3communesinfo@gmail.com) is always active Super Admin
  const rootIdx = merged.findIndex(
    (a) => a.username.toLowerCase() === 'admin' || (a.email && a.email.toLowerCase() === '3communesinfo@gmail.com')
  );
  if (rootIdx >= 0) {
    merged[rootIdx].role = 'Super Admin';
    merged[rootIdx].status = 'active';
  }

  return merged;
};

export const saveStoredAdmins = (adminsList: AdminAccount[]) => {
  try {
    const serialized = JSON.stringify(adminsList);
    ADMINS_STORAGE_KEYS.forEach((k) => {
      try {
        localStorage.setItem(k, serialized);
      } catch {}
    });
  } catch (e) {
    console.error('Failed to save admins', e);
  }
};

const AUDIT_LOGS_STORAGE_KEY = '3communes_audit_logs_v1';
const CURRENT_ADMIN_STORAGE_KEY = '3communes_active_admin_v2';

export const ProductBackendModal: React.FC<ProductBackendModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  onAddCategory,
  onDeleteCategory,
  repairTariffs,
  onUpdateRepairTariffs,
  onResetRepairTariffs,
  printPricing,
  onUpdatePrintPricing,
  onResetPrintPricing,
  moneyPartners,
  onUpdateMoneyPartners,
  onResetMoneyPartners,
  sliderItems,
  onUpdateSliderItems,
  onResetSliderItems,
  storeSettings,
  onUpdateStoreSettings,
  onResetStoreSettings,
  customerRequests = [],
  onUpdateCustomerRequestStatus = () => {},
  onDeleteCustomerRequest = () => {},
  currentUser = null,
  onCurrentUserChange = () => {}
}) => {
  // Registered Admin Accounts
  const [admins, setAdmins] = useState<AdminAccount[]>(() => {
    return loadAllStoredAdmins();
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Active Admin
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(currentUser);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!currentUser);

  // Sub-navigation inside Authenticated Backend
  type BackendTab = 
    | 'requests'
    | 'products' 
    | 'repairs' 
    | 'print' 
    | 'money' 
    | 'slider' 
    | 'settings' 
    | 'categories' 
    | 'audit' 
    | 'admins'
    | 'security';
  const [activeBackendTab, setActiveBackendTab] = useState<BackendTab>('requests');

  // Login Form States
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 2FA / MFA States
  const [requireMfa, setRequireMfa] = useState(false);
  const [mfaChallengeToken, setMfaChallengeToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [debugMfaCode, setDebugMfaCode] = useState<string | null>(null);

  // Password Reset Flow States
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetStatusMsg, setResetStatusMsg] = useState<string | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState<string | null>(null);
  const [isResetTokenStep, setIsResetTokenStep] = useState(false);

  // Auth Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);
  const [registerErrorMsg, setRegisterErrorMsg] = useState<string | null>(null);

  // Sync external currentUser if provided
  useEffect(() => {
    if (currentUser) {
      setCurrentAdmin(currentUser);
      setIsAuthenticated(true);
    }
  }, [currentUser]);

  // Synchronize central database session whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setLoginUser('');
      setLoginPassword('');
      setLoginError(null);
      setRequireMfa(false);
      setIsResettingPassword(false);
      setAuthMode('login');
      setRegisterErrorMsg(null);
      setRegisterSuccessMsg(null);
      setRegName('');
      setRegIdentifier('');
      setRegPassword('');
      setRegConfirmPassword('');

      // Auto-synchronize any legacy local accounts from browser storage to the central backend database
      const localAdmins = loadAllStoredAdmins();
      if (localAdmins && localAdmins.length > 0) {
        authService.syncLocalAccounts(localAdmins).then(() => {
          authService.fetchAdmins().then((centralAdmins) => {
            if (centralAdmins && centralAdmins.length > 0) {
              setAdmins(centralAdmins);
            }
          });
        });
      }

      // Verify central session token across devices & reloads
      authService.verifySession().then((session) => {
        if (session.valid && session.admin) {
          setCurrentAdmin(session.admin);
          setIsAuthenticated(true);
          onCurrentUserChange(session.admin);
        }
      });

      // Synchronize central admins list across all devices
      authService.fetchAdmins().then((centralAdmins) => {
        if (centralAdmins && centralAdmins.length > 0) {
          setAdmins(centralAdmins);
        }
      });

      // Synchronize central audit logs
      authService.fetchAuditLogs().then((logs) => {
        if (logs && logs.length > 0) {
          setAuditLogs(logs);
        }
      });
    }
  }, [isOpen]);

  // Category Management States
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Search & Filters for Products
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for Add / Edit Product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>(categories[0] || 'Téléphones mobiles');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState<number>(99);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(5);
  const [formImage, setFormImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formCondition, setFormCondition] = useState('Neuf sous blister');
  const [formSpecs, setFormSpecs] = useState('');
  const [formWarranty, setFormWarranty] = useState('Garantie 12 mois');
  const [formFeatured, setFormFeatured] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Inline Quick Category Add inside product form
  const [isQuickAddingCat, setIsQuickAddingCat] = useState(false);
  const [quickCatInput, setQuickCatInput] = useState('');

  // Persist Admins whenever modified
  useEffect(() => {
    saveStoredAdmins(admins);
  }, [admins]);

  // Persist Audit Logs whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to save audit logs', e);
    }
  }, [auditLogs]);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Helper to record an audit action
  const logAudit = (
    action: AuditActionType,
    summary: string,
    details?: string,
    targetItemName?: string,
    actingAdminOverride?: AdminAccount
  ) => {
    const admin = actingAdminOverride || currentAdmin;
    if (!admin) return;

    const now = new Date();
    const formatted = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newEntry: AuditLogEntry = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: now.toISOString(),
      formattedTime: formatted,
      adminId: admin.id,
      adminUsername: admin.username,
      adminName: admin.name,
      adminRole: admin.role,
      action,
      summary,
      details,
      targetItemName
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
    authService.recordAuditLog(newEntry);
  };

  // Handle Admin Login across all registered accounts via central backend
  const executeLogin = async (userToLogin: string, passToLogin: string, isQuickLogin = false) => {
    setLoginError(null);
    const sanitizedUser = (userToLogin || '').trim();
    const sanitizedPass = (passToLogin || '').trim();

    try {
      const res = await authService.login(sanitizedUser, sanitizedPass, isQuickLogin);

      if (res.requireMfa && res.mfaChallengeToken) {
        setRequireMfa(true);
        setMfaChallengeToken(res.mfaChallengeToken);
        setDebugMfaCode(res.debugCode || null);
        setLoginError(null);
        return;
      }

      if (res.success && res.admin) {
        setCurrentAdmin(res.admin);
        setIsAuthenticated(true);
        onCurrentUserChange(res.admin);
        setLoginError(null);
        setLoginPassword('');

        // Refresh central admins list
        const centralAdmins = await authService.fetchAdmins();
        if (centralAdmins && centralAdmins.length > 0) {
          setAdmins(centralAdmins);
        }

        showFeedback(`Bienvenue, ${res.admin.name} ! (${res.admin.role})`);
        return;
      } else {
        setLoginError(res.error || 'Identifiant ou mot de passe incorrect.');
      }
    } catch {
      setLoginError('Erreur de communication avec le serveur central.');
    }
  };

  // Handle MFA 2FA Submission
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaChallengeToken || !mfaCode.trim()) {
      setLoginError('Veuillez saisir le code MFA à 6 chiffres.');
      return;
    }
    setLoginError(null);

    try {
      const res = await authService.verifyMfa(mfaChallengeToken, mfaCode.trim());
      if (res.success && res.admin) {
        setCurrentAdmin(res.admin);
        setIsAuthenticated(true);
        onCurrentUserChange(res.admin);
        setRequireMfa(false);
        setMfaChallengeToken(null);
        setMfaCode('');
        setDebugMfaCode(null);
        setLoginPassword('');

        const centralAdmins = await authService.fetchAdmins();
        if (centralAdmins && centralAdmins.length > 0) {
          setAdmins(centralAdmins);
        }

        showFeedback(`Authentification 2FA réussie ! Bienvenue, ${res.admin.name}`);
      } else {
        setLoginError(res.error || 'Code de vérification MFA incorrect.');
      }
    } catch {
      setLoginError('Erreur réseau lors de la validation du code.');
    }
  };

  // Password reset request
  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatusMsg(null);
    setResetErrorMsg(null);
    if (!resetIdentifier.trim()) {
      setResetErrorMsg('Veuillez saisir votre adresse e-mail ou identifiant.');
      return;
    }

    const res = await authService.forgotPassword(resetIdentifier.trim());
    if (res.success) {
      setResetStatusMsg(res.message);
      if (res.resetToken) {
        setResetTokenInput(res.resetToken);
      }
      setIsResetTokenStep(true);
    } else {
      setResetErrorMsg(res.message || 'Erreur lors de la demande.');
    }
  };

  // Password reset confirmation
  const handlePasswordResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatusMsg(null);
    setResetErrorMsg(null);

    if (!resetTokenInput.trim() || !resetNewPassword.trim()) {
      setResetErrorMsg('Veuillez saisir le jeton et votre nouveau mot de passe.');
      return;
    }

    if (resetNewPassword.trim().length < 8) {
      setResetErrorMsg('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    const res = await authService.resetPassword(resetTokenInput.trim(), resetNewPassword.trim());
    if (res.success) {
      setResetStatusMsg('Mot de passe mis à jour ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        setIsResettingPassword(false);
        setIsResetTokenStep(false);
        setResetIdentifier('');
        setResetTokenInput('');
        setResetNewPassword('');
        setResetStatusMsg(null);
      }, 2500);
    } else {
      setResetErrorMsg(res.error || 'Échec de la réinitialisation.');
    }
  };

  // Handle Admin Login form submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(loginUser, loginPassword);
  };

  // Handle Register Form Submit directly to central database
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrorMsg(null);
    setRegisterSuccessMsg(null);

    const cleanUser = regIdentifier.trim().toLowerCase();
    const cleanPass = regPassword.trim();
    const cleanName = regName.trim();

    if (!cleanUser || !cleanPass) {
      setRegisterErrorMsg('Veuillez renseigner un identifiant et un mot de passe.');
      return;
    }

    if (cleanPass.length < 8) {
      setRegisterErrorMsg('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (cleanPass !== regConfirmPassword.trim()) {
      setRegisterErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await authService.register(cleanUser, cleanPass, cleanName);
      if (res.success && res.admin) {
        setRegisterSuccessMsg('Compte créé et synchronisé sur la base de données centrale ! Connexion en cours...');
        setTimeout(async () => {
          setCurrentAdmin(res.admin!);
          setIsAuthenticated(true);
          onCurrentUserChange(res.admin!);
          const centralAdmins = await authService.fetchAdmins();
          if (centralAdmins && centralAdmins.length > 0) {
            setAdmins(centralAdmins);
          }
          showFeedback(`Bienvenue, ${res.admin!.name} ! Votre compte est synchronisé sur PC et Mobile.`);
          setIsRegistering(false);
        }, 800);
      } else {
        setRegisterErrorMsg(res.error || 'Erreur lors de la création du compte.');
        setIsRegistering(false);
      }
    } catch {
      setRegisterErrorMsg('Erreur de communication avec le serveur central.');
      setIsRegistering(false);
    }
  };

  // Handle Logout & End Session
  const handleLogout = () => {
    if (currentAdmin) {
      logAudit(
        'LOGOUT',
        `Déconnexion du portail d'administration`,
        `Utilisateur : ${currentAdmin.name} (@${currentAdmin.username})`
      );
    }
    authService.clearSession();
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    onCurrentUserChange(null);
    setLoginPassword('');
    setEditingProduct(null);
    setIsAddingNew(false);
    setIsManagingCategories(false);
    setActiveBackendTab('products');
  };

  // Handle Modal Close (resets active state)
  const handleModalClose = () => {
    onClose();
  };

  // Handle Add New Admin Account to central database
  const handleAddAdminAccount = async (newAdmin: AdminAccount): Promise<boolean> => {
    try {
      const res = await authService.createAdmin(newAdmin);
      if (res.success && res.admin) {
        setAdmins((prev) => [...prev, res.admin!]);
        logAudit(
          'CREATE_ADMIN',
          `Création centralisée du compte "@${res.admin.username}" (${res.admin.name})`,
          `Rôle : ${res.admin.role} • E-mail : ${res.admin.email}`
        );
        showFeedback(`Compte administrateur @${res.admin.username} synchronisé avec succès !`);
        return true;
      } else {
        alert(res.error || 'Erreur lors de la création du compte.');
        return false;
      }
    } catch {
      return false;
    }
  };

  // Handle Delete Admin Account in central database
  const handleDeleteAdminAccount = async (adminId: string): Promise<boolean> => {
    const target = admins.find((a) => a.id === adminId);
    if (!target) return false;
    if (target.username === 'admin' || target.email.toLowerCase() === '3communesinfo@gmail.com') {
      alert('Impossible de supprimer le Super Admin permanent (3communesinfo@gmail.com).');
      return false;
    }
    if (target.id === currentAdmin?.id) {
      alert('Impossible de supprimer votre compte actuellement connecté.');
      return false;
    }

    try {
      const res = await authService.deleteAdmin(adminId);
      if (res.success) {
        setAdmins((prev) => prev.filter((a) => a.id !== adminId));
        logAudit(
          'DELETE_ADMIN',
          `Suppression centralisée du compte "@${target.username}" (${target.name})`,
          `Rôle : ${target.role} • E-mail : ${target.email}`
        );
        showFeedback(`Compte administrateur @${target.username} supprimé.`);
        return true;
      } else {
        alert(res.error || 'Erreur lors de la suppression.');
        return false;
      }
    } catch {
      return false;
    }
  };

  // Handle Add New Category
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError(null);
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError('Category name cannot be empty.');
      return;
    }

    const success = onAddCategory(trimmed);
    if (success) {
      logAudit(
        'ADD_CATEGORY',
        `Created new store category "${trimmed}"`,
        `Added by ${currentAdmin?.name || 'Admin'}`
      );
      showFeedback(`Category "${trimmed}" created successfully!`);
      setNewCategoryName('');
      setCategoryError(null);
    } else {
      setCategoryError(`Category "${trimmed}" already exists.`);
    }
  };

  // Handle Delete Category
  const handleDeleteCategoryWithLog = (catToDelete: string) => {
    if (onDeleteCategory) {
      onDeleteCategory(catToDelete);
      logAudit(
        'DELETE_CATEGORY',
        `Deleted store category "${catToDelete}"`,
        `Removed by ${currentAdmin?.name || 'Admin'}`
      );
      showFeedback(`Category "${catToDelete}" deleted.`);
    }
  };

  // Quick inline category add inside the product form
  const handleQuickAddCategory = () => {
    const trimmed = quickCatInput.trim();
    if (!trimmed) return;
    const success = onAddCategory(trimmed);
    if (success) {
      setFormCategory(trimmed);
      setQuickCatInput('');
      setIsQuickAddingCat(false);
      logAudit(
        'ADD_CATEGORY',
        `Created new store category "${trimmed}"`,
        `Quick-added inside product form`
      );
      showFeedback(`Category "${trimmed}" created & selected!`);
    } else {
      showFeedback(`Category "${trimmed}" already exists!`);
    }
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setIsAddingNew(false);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormBrand(p.brand);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice || 0);
    setFormStock(p.stock);
    setFormImage(p.image);
    setFormGalleryImages(p.images && p.images.length > 0 ? p.images.join('\n') : p.image);
    setFormDescription(p.description);
    setFormLongDescription(p.longDescription || p.description);
    setFormCondition(p.condition || 'Brand New Sealed Box');
    setFormSpecs(p.specs.join(', '));
    setFormWarranty(p.warranty || '12-Month Warranty');
    setFormFeatured(Boolean(p.featured));
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0] || 'Téléphones mobiles');
    setFormBrand('Marque');
    setFormPrice(49);
    setFormOriginalPrice(0);
    setFormStock(5);
    setFormImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
    setFormGalleryImages('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
    setFormDescription('Produit certifié et testé en magasin.');
    setFormLongDescription('Article neuf ou reconditionné certifié, soigneusement inspecté par l\'équipe 3 Communes Informatique. Retrait express au comptoir à Romainville.');
    setFormCondition('Neuf sous blister');
    setFormSpecs('Garantie magasin, Produit conforme, Compatibilité universelle');
    setFormWarranty('Garantie 12 mois');
    setFormFeatured(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const specsArray = formSpecs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedImages = formGalleryImages
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http'));
    const finalImages = parsedImages.length > 0 ? parsedImages : (formImage.trim() ? [formImage.trim()] : []);
    const mainImg = finalImages[0] || formImage.trim() || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

    if (isAddingNew) {
      const newProduct: Product = {
        id: 'prod-' + Date.now(),
        name: formName.trim(),
        category: formCategory,
        brand: formBrand.trim() || '3CI',
        price: Number(formPrice),
        originalPrice: formOriginalPrice > 0 ? Number(formOriginalPrice) : undefined,
        stock: Number(formStock),
        image: mainImg,
        images: finalImages,
        description: formDescription.trim(),
        longDescription: formLongDescription.trim() || formDescription.trim(),
        condition: formCondition,
        specs: specsArray.length ? specsArray : ['Brand new item in box'],
        warranty: formWarranty.trim(),
        featured: formFeatured
      };
      onAddProduct(newProduct);
      logAudit(
        'ADD_PRODUCT',
        `Added new product "${newProduct.name}" in category "${newProduct.category}"`,
        `Price: €${newProduct.price.toFixed(2)} • Stock: ${newProduct.stock} units • Brand: ${newProduct.brand}`,
        newProduct.name
      );
      showFeedback('Product added to inventory successfully!');
      setIsAddingNew(false);
    } else if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        brand: formBrand.trim(),
        price: Number(formPrice),
        originalPrice: formOriginalPrice > 0 ? Number(formOriginalPrice) : undefined,
        stock: Number(formStock),
        image: mainImg,
        images: finalImages,
        description: formDescription.trim(),
        longDescription: formLongDescription.trim() || formDescription.trim(),
        condition: formCondition,
        specs: specsArray.length ? specsArray : editingProduct.specs,
        warranty: formWarranty.trim(),
        featured: formFeatured
      };
      onUpdateProduct(updatedProduct);

      // Detailed change tracking
      const changesList: string[] = [];
      if (editingProduct.price !== updatedProduct.price) {
        changesList.push(`Price: €${updatedProduct.price} (was €${editingProduct.price})`);
      }
      if (editingProduct.stock !== updatedProduct.stock) {
        changesList.push(`Stock: ${updatedProduct.stock} (was ${editingProduct.stock})`);
      }
      if (editingProduct.category !== updatedProduct.category) {
        changesList.push(`Category: ${updatedProduct.category} (was ${editingProduct.category})`);
      }
      if (editingProduct.warranty !== updatedProduct.warranty) {
        changesList.push(`Warranty: ${updatedProduct.warranty}`);
      }

      logAudit(
        'UPDATE_PRODUCT',
        `Updated product "${updatedProduct.name}"`,
        changesList.length > 0 ? changesList.join(' • ') : 'General details updated',
        updatedProduct.name
      );
      showFeedback(`Product "${updatedProduct.name}" updated!`);
      setEditingProduct(null);
    }
  };

  const handleDeleteProductWithLog = (p: Product) => {
    if (window.confirm(`Delete product "${p.name}"?`)) {
      onDeleteProduct(p.id);
      logAudit(
        'DELETE_PRODUCT',
        `Deleted product "${p.name}"`,
        `Category: ${p.category} • Price was €${p.price} • Stock was ${p.stock}`,
        p.name
      );
      showFeedback(`Product "${p.name}" deleted.`);
    }
  };

  const handleResetCatalogWithLog = () => {
    if (window.confirm('Reset catalog back to initial defaults?')) {
      onResetProducts();
      logAudit(
        'RESET_PRODUCTS',
        `Reset product catalog to factory defaults`,
        `Restored initial inventory catalog`
      );
      showFeedback('Catalog reset to defaults.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Current admin initials
  const currentInitials = currentAdmin?.name
    ? currentAdmin.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className={`bg-white rounded-3xl w-full shadow-2xl border border-emerald-200 overflow-hidden my-auto flex flex-col max-h-[92vh] ${
        !isAuthenticated ? 'max-w-xl' : 'max-w-6xl'
      }`}>
        
        {/* ============================================================ */}
        {/* VIEW 1: LOCKED STATE / MULTI-ADMIN LOGIN FORM */}
        {/* ============================================================ */}
        {!isAuthenticated ? (
          <div className="p-5 sm:p-8 flex flex-col items-center space-y-5 max-w-xl mx-auto w-full text-center overflow-y-auto max-h-[92vh] overscroll-contain">
            
            {/* Header Badge */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#3f704d] flex items-center justify-center shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-100/80 text-emerald-900 px-3 py-1 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Espace Protégé Multi-Administrateurs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Connexion Administration Boutique
              </h2>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Connectez-vous avec votre compte administrateur. Chaque connexion et modification d'inventaire est enregistrée dans le journal d'audit.
              </p>
            </div>

            {/* Error Message for Login */}
            {loginError && (
              <div className="w-full bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-2xl text-xs flex items-center space-x-2 text-left animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-semibold leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Error / Success Messages for Registration */}
            {registerErrorMsg && (
              <div className="w-full bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-2xl text-xs flex items-center space-x-2 text-left animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-semibold leading-relaxed">{registerErrorMsg}</span>
              </div>
            )}
            {registerSuccessMsg && (
              <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-2xl text-xs flex items-center space-x-2 text-left animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-semibold leading-relaxed">{registerSuccessMsg}</span>
              </div>
            )}

            {/* Mode Switcher: Se connecter vs Créer un compte */}
            {!requireMfa && !isResettingPassword && (
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-2xl w-full max-w-sm mx-auto shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginError(null);
                    setRegisterErrorMsg(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#3f704d] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Se connecter</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setLoginError(null);
                    setRegisterErrorMsg(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-[#3f704d] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Créer un compte</span>
                </button>
              </div>
            )}

            {/* 1. MFA CHALLENGE SCREEN */}
            {requireMfa ? (
              <form onSubmit={handleMfaSubmit} className="w-full space-y-4 text-left animate-in fade-in">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs space-y-1">
                  <span className="font-bold flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Double Authentification Requise (2FA)</span>
                  </span>
                  <p className="text-gray-600 leading-relaxed">
                    Un code de sécurité à 6 chiffres a été généré pour valider l'accès administrateur.
                  </p>
                  {debugMfaCode && (
                    <p className="text-emerald-800 font-mono font-bold pt-1">
                      Code de vérification : {debugMfaCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Code de sécurité à 6 chiffres *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3.5 py-3 text-center tracking-widest font-mono text-xl font-bold bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white py-3.5 px-6 rounded-xl text-sm font-extrabold tracking-wide transition flex items-center justify-center space-x-2.5 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider le code de sécurité</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRequireMfa(false);
                      setMfaChallengeToken(null);
                      setMfaCode('');
                      setDebugMfaCode(null);
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs font-medium transition cursor-pointer"
                  >
                    Annuler et retourner
                  </button>
                </div>
              </form>
            ) : isResettingPassword ? (
              /* 2. PASSWORD RESET FLOW */
              <div className="w-full space-y-4 text-left animate-in fade-in">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <span className="font-bold">Réinitialisation Sécurisée</span>
                  <p className="text-gray-600 mt-0.5">
                    Générez un jeton de réinitialisation unique valide 1 heure pour changer votre mot de passe.
                  </p>
                </div>

                {resetStatusMsg && (
                  <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 p-3 rounded-xl text-xs">
                    {resetStatusMsg}
                  </div>
                )}
                {resetErrorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs">
                    {resetErrorMsg}
                  </div>
                )}

                {!isResetTokenStep ? (
                  <form onSubmit={handleForgotPasswordRequest} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Identifiant ou E-mail administrateur
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="3communesinfo@gmail.com ou identifiant"
                        value={resetIdentifier}
                        onChange={(e) => setResetIdentifier(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Générer un jeton de réinitialisation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsResetTokenStep(true)}
                      className="w-full text-center text-xs text-[#3f704d] hover:underline pt-1 cursor-pointer"
                    >
                      J'ai déjà un jeton de réinitialisation
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordResetConfirm} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Jeton de réinitialisation *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Collez votre jeton unique"
                        value={resetTokenInput}
                        onChange={(e) => setResetTokenInput(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs font-mono bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nouveau mot de passe (min. 8 caractères) *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Nouveau mot de passe fort"
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3f704d]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#3f704d] hover:bg-[#335c3f] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Mettre à jour mon mot de passe</span>
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsResettingPassword(false);
                    setIsResetTokenStep(false);
                    setResetStatusMsg(null);
                    setResetErrorMsg(null);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : authMode === 'register' ? (
              /* 3. CENTRAL USER REGISTRATION FORM (Synchronized PC & Mobile) */
              <form onSubmit={handleRegisterSubmit} className="w-full space-y-3.5 text-left animate-in fade-in">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <span className="font-bold flex items-center space-x-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Création de compte centralisée</span>
                  </span>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">
                    Votre compte sera enregistré dans la base de données centrale et fonctionnera instantanément sur PC et Mobile.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nom complet ou Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Safayet Sharif ou Prénom Nom"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Identifiant ou Adresse E-mail *
                  </label>
                  <input
                    type="text"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    placeholder="Ex: safayetsharif5@gmail.com ou nom d'utilisateur"
                    value={regIdentifier}
                    onChange={(e) => setRegIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Utilisable indifféremment avec ou sans @ et insensible à la casse.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mot de passe (min. 8 caractères) *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="Minimum 8 caractères"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                      title={showRegPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirmez le mot de passe *
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Retapez le mot de passe"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full bg-[#3f704d] hover:bg-[#335c3f] active:bg-[#2d4f36] disabled:opacity-60 text-white py-3.5 px-6 rounded-xl text-sm font-extrabold tracking-wide transition flex items-center justify-center space-x-2.5 shadow-md hover:shadow-lg cursor-pointer active:scale-98 border border-emerald-600/30"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-200" />
                    <span>{isRegistering ? 'Création en cours...' : 'Créer mon compte (Synchronisé PC & Mobile)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setRegisterErrorMsg(null);
                    }}
                    className="w-full text-center text-xs text-[#3f704d] hover:underline py-1.5 cursor-pointer font-medium"
                  >
                    Vous avez déjà un compte ? Se connecter
                  </button>
                </div>
              </form>
            ) : (
              /* 4. STANDARD LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="w-full space-y-4 text-left animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Identifiant ou E-mail administrateur
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    placeholder="3communesinfo@gmail.com ou identifiant"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Mot de passe administrateur
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsResettingPassword(true)}
                      className="text-[11px] text-[#3f704d] hover:underline cursor-pointer"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Saisissez votre mot de passe"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                      title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-[#3f704d] hover:bg-[#335c3f] active:bg-[#2d4f36] text-white py-3.5 px-6 rounded-xl text-sm font-extrabold tracking-wide transition flex items-center justify-center space-x-2.5 shadow-md hover:shadow-lg cursor-pointer active:scale-98 border border-emerald-600/30"
                  >
                    <LogIn className="w-4 h-4 text-emerald-200" />
                    <span>Se connecter / Log in</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setLoginError(null);
                      setRegisterErrorMsg(null);
                    }}
                    className="w-full text-center text-xs text-[#3f704d] hover:underline py-1.5 cursor-pointer font-medium"
                  >
                    Pas encore de compte ? Créer un nouveau compte administrateur
                  </button>

                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-xs font-medium transition cursor-pointer"
                  >
                    Retour au site public
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: AUTHENTICATED MULTI-ADMIN WORKSPACE & AUDIT TRAIL */
          /* ============================================================ */
          <>
            {/* Top Bar with Active Admin Info & Navigation */}
            <div className="bg-emerald-950 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              {/* Brand and Active Admin details */}
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0"
                  style={{ backgroundColor: currentAdmin?.avatarColor || '#3f704d' }}
                >
                  {currentInitials}
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      {currentAdmin?.name || 'Administrator'}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono">
                      @{currentAdmin?.username}
                    </span>
                    <span className="bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {currentAdmin?.role || 'Admin'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">
                    Portail de gestion • 3 Communes Informatique
                  </p>
                </div>
              </div>

              {/* Top Controls: Switch Admin / Logout & Close */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLogout}
                  title="Changer d'utilisateur ou se déconnecter"
                  className="bg-red-900/80 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-xl text-xs font-medium border border-red-700 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Changer d'admin / Se déconnecter</span>
                </button>

                <button
                  onClick={handleModalClose}
                  className="text-emerald-300 hover:text-white p-1 rounded-lg transition cursor-pointer"
                  title="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="bg-emerald-900/90 border-b border-emerald-800 px-3 sm:px-6 flex items-center space-x-1 sm:space-x-2 overflow-x-auto text-xs shrink-0 scrollbar-thin">
              <button
                onClick={() => setActiveBackendTab('requests')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'requests'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Commandes & Demandes</span>
                {customerRequests.filter(r => r.status === 'new').length > 0 ? (
                  <span className="bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                    {customerRequests.filter(r => r.status === 'new').length}
                  </span>
                ) : (
                  <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                    {customerRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveBackendTab('products')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'products'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Produits & Stock</span>
                <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveBackendTab('repairs')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'repairs'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Réparations SAV</span>
                <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {repairTariffs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveBackendTab('print')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'print'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Tarifs Imprimerie</span>
              </button>

              <button
                onClick={() => setActiveBackendTab('money')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'money'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Transfert d'argent</span>
                <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {moneyPartners.length}
                </span>
              </button>

              <button
                onClick={() => setActiveBackendTab('slider')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'slider'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Slider Posters</span>
                <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {sliderItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveBackendTab('settings')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'settings'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Boutique & Infos</span>
              </button>

              <button
                onClick={() => setActiveBackendTab('categories')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'categories'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Catégories</span>
                <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {categories.length}
                </span>
              </button>

              <button
                onClick={() => setActiveBackendTab('audit')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'audit'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Journal d'audit</span>
                <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {auditLogs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveBackendTab('admins')}
                className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeBackendTab === 'admins'
                    ? 'border-emerald-400 text-white'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Comptes</span>
                <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px]">
                  {admins.length}
                </span>
              </button>

              {currentAdmin?.role === 'Super Admin' && (
                <button
                  onClick={() => setActiveBackendTab('security')}
                  className={`py-3 px-2.5 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activeBackendTab === 'security'
                      ? 'border-emerald-400 text-white'
                      : 'border-transparent text-emerald-200/70 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-emerald-300" />
                  <span>Sécurité & Sauvegardes</span>
                </button>
              )}
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center space-x-2 shrink-0 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Main Content Area based on Active Tab */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

              {/* ============================================================ */}
              {/* TAB: CUSTOMER ORDERS & REQUESTS INBOX */}
              {/* ============================================================ */}
              {activeBackendTab === 'requests' && (
                <AdminRequestsView
                  requests={customerRequests}
                  onUpdateRequestStatus={onUpdateCustomerRequestStatus}
                  onDeleteRequest={onDeleteCustomerRequest}
                />
              )}

              {/* ============================================================ */}
              {/* TAB: REPAIRS & SAV ATELIER */}
              {/* ============================================================ */}
              {activeBackendTab === 'repairs' && (
                <AdminRepairsView
                  repairTariffs={repairTariffs}
                  onUpdateTariffs={onUpdateRepairTariffs}
                  onResetTariffs={onResetRepairTariffs || (() => {})}
                  adminRole={currentAdmin?.role || 'Super Admin'}
                  showFeedback={showFeedback}
                  logAuditAction={(action, summary, details) => logAudit(action as AuditActionType, summary, details)}
                />
              )}

              {/* ============================================================ */}
              {/* TAB: PRINT, PHOTOCOPY & DOCUMENT TARIFFS */}
              {/* ============================================================ */}
              {activeBackendTab === 'print' && (
                <AdminPrintPricingView
                  pricing={printPricing}
                  onUpdatePricing={onUpdatePrintPricing}
                  onResetPricing={onResetPrintPricing || (() => {})}
                  adminRole={currentAdmin?.role || 'Super Admin'}
                  showFeedback={showFeedback}
                  logAuditAction={(action, summary, details) => logAudit(action as AuditActionType, summary, details)}
                />
              )}

              {/* ============================================================ */}
              {/* TAB: MONEY TRANSFER & MOBILE RECHARGES */}
              {/* ============================================================ */}
              {activeBackendTab === 'money' && (
                <AdminMoneyTransferView
                  partners={moneyPartners}
                  onUpdatePartners={onUpdateMoneyPartners}
                  onResetPartners={onResetMoneyPartners || (() => {})}
                  adminRole={currentAdmin?.role || 'Super Admin'}
                  showFeedback={showFeedback}
                  logAuditAction={(action, summary, details) => logAudit(action as AuditActionType, summary, details)}
                />
              )}

              {/* ============================================================ */}
              {/* TAB: SLIDER POSTERS & HERO CAROUSEL */}
              {/* ============================================================ */}
              {activeBackendTab === 'slider' && (
                <AdminSliderView
                  slides={sliderItems}
                  onUpdateSlides={onUpdateSliderItems}
                  onResetSlides={onResetSliderItems || (() => {})}
                  adminRole={currentAdmin?.role || 'Super Admin'}
                  showFeedback={showFeedback}
                  logAuditAction={(action, summary, details) => logAudit(action as AuditActionType, summary, details)}
                />
              )}

              {/* ============================================================ */}
              {/* TAB: STORE SETTINGS & GENERAL COORDINATES */}
              {/* ============================================================ */}
              {activeBackendTab === 'settings' && (
                <AdminStoreSettingsView
                  settings={storeSettings}
                  onUpdateSettings={onUpdateStoreSettings}
                  onResetSettings={onResetStoreSettings || (() => {})}
                  adminRole={currentAdmin?.role || 'Super Admin'}
                  showFeedback={showFeedback}
                  logAuditAction={(action, summary, details) => logAudit(action as AuditActionType, summary, details)}
                />
              )}

              {/* ============================================================ */}
              {/* TAB: AUDIT TRAIL & ACTIVITY LOG */}
              {/* ============================================================ */}
              {activeBackendTab === 'audit' && (
                <AuditTrailView
                  logs={auditLogs}
                  admins={admins}
                  onClearLogs={() => {
                    setAuditLogs([]);
                    try {
                      localStorage.removeItem(AUDIT_LOGS_STORAGE_KEY);
                    } catch {}
                    showFeedback('Audit trail cleared.');
                  }}
                />
              )}

              {/* ============================================================ */}
              {/* TAB 3: ADMIN ACCOUNTS & PERMISSIONS */}
              {/* ============================================================ */}
              {activeBackendTab === 'admins' && (
                <AdminAccountsView
                  admins={admins}
                  currentAdmin={currentAdmin}
                  auditLogs={auditLogs}
                  onAddAdmin={handleAddAdminAccount}
                  onDeleteAdmin={handleDeleteAdminAccount}
                />
              )}

              {/* ============================================================ */}
              {/* TAB 4: CATEGORY CONFIGURATION */}
              {/* ============================================================ */}
              {activeBackendTab === 'categories' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-base text-emerald-950 flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-emerald-800" />
                          <span>Rayons & Catégories ({categories.length})</span>
                        </h3>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          Créez et gérez les rayons de classement de votre inventaire.
                        </p>
                      </div>
                    </div>

                    {categoryError && (
                      <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs">
                        {categoryError}
                      </div>
                    )}

                    <form onSubmit={handleAddCategorySubmit} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="ex. Montres connectées, Accessoires gaming, Périphériques..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                      />
                      <button
                        type="submit"
                        className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                      >
                        <FolderPlus className="w-4 h-4" />
                        <span>Ajouter un rayon</span>
                      </button>
                    </form>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {categories.map((cat) => {
                        const count = products.filter((p) => p.category === cat).length;
                        return (
                          <div
                            key={cat}
                            className="bg-white border border-emerald-200 p-3 rounded-xl flex items-center justify-between shadow-2xs"
                          >
                            <div>
                              <p className="font-bold text-gray-900 text-xs">{cat}</p>
                              <p className="text-[10px] text-gray-500">{count} produit{count > 1 ? 's' : ''}</p>
                            </div>
                            {onDeleteCategory && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Supprimer la catégorie "${cat}" ? Les articles resteront dans l'inventaire.`)) {
                                    handleDeleteCategoryWithLog(cat);
                                  }
                                }}
                                title={`Supprimer ${cat}`}
                                className="text-gray-400 hover:text-red-600 p-1 rounded-md transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 5: SECURITY MONITORING, ALERTS & BACKUPS */}
              {/* ============================================================ */}
              {activeBackendTab === 'security' && (
                <AdminSecurityView
                  adminRole={currentAdmin?.role || 'Super Admin'}
                  showFeedback={showFeedback}
                  logAuditAction={(action, summary, details) => logAudit(action as AuditActionType, summary, details)}
                />
              )}

              {/* ============================================================ */}
              {/* TAB 1: PRODUCTS & INVENTORY MANAGEMENT */}
              {/* ============================================================ */}
              {activeBackendTab === 'products' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleStartAdd}
                        className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Ajouter un produit</span>
                      </button>

                      <button
                        onClick={handleResetCatalogWithLog}
                        title="Réinitialiser le catalogue avec les articles par défaut"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Réinitialiser</span>
                      </button>
                    </div>

                    {/* Filter and Search */}
                    <div className="flex items-center space-x-2 flex-wrap">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher un article..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3f704d]"
                        />
                      </div>

                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f704d] text-gray-700 font-medium cursor-pointer"
                      >
                        <option value="All">Tous les rayons ({products.length})</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Add / Edit Form Drawer */}
                  {(isAddingNew || editingProduct) && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                        <h4 className="text-sm font-bold text-emerald-950 flex items-center space-x-2">
                          <Edit3 className="w-4 h-4 text-emerald-800" />
                          <span>{isAddingNew ? 'Ajouter un nouvel article au catalogue' : `Modifier : ${editingProduct?.name}`}</span>
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingProduct(null);
                          }}
                          className="text-gray-500 hover:text-gray-800 text-xs font-medium cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-gray-700 mb-1">Nom / Référence du produit *</label>
                            <input
                              type="text"
                              required
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="ex. Apple iPhone 15 / 128 Go"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block font-semibold text-gray-700">Rayon / Catégorie *</label>
                              <button
                                type="button"
                                onClick={() => setIsQuickAddingCat(!isQuickAddingCat)}
                                className="text-[10px] text-[#3f704d] hover:underline font-bold"
                              >
                                {isQuickAddingCat ? 'Choisir' : '+ Nouveau rayon'}
                              </button>
                            </div>

                            {isQuickAddingCat ? (
                              <div className="flex space-x-1">
                                <input
                                  type="text"
                                  placeholder="Nouveau rayon..."
                                  value={quickCatInput}
                                  onChange={(e) => setQuickCatInput(e.target.value)}
                                  className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={handleQuickAddCategory}
                                  className="bg-[#3f704d] text-white px-2 py-1 rounded-lg text-[10px] font-bold"
                                >
                                  OK
                                </button>
                              </div>
                            ) : (
                              <select
                                value={formCategory}
                                onChange={(e) => setFormCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] cursor-pointer"
                              >
                                {categories.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Marque *</label>
                            <input
                              type="text"
                              required
                              value={formBrand}
                              onChange={(e) => setFormBrand(e.target.value)}
                              placeholder="Apple, Samsung, JBL..."
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Prix de vente (€ TTC) *</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              min="0"
                              value={formPrice}
                              onChange={(e) => setFormPrice(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Prix d'origine (€ barré, facultatif)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formOriginalPrice}
                              onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Quantité en stock *</label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={formStock}
                              onChange={(e) => setFormStock(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Garantie</label>
                            <input
                              type="text"
                              value={formWarranty}
                              onChange={(e) => setFormWarranty(e.target.value)}
                              placeholder="Garantie magasin 12 mois"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">URL de l'image principale</label>
                            <input
                              type="url"
                              value={formImage}
                              onChange={(e) => setFormImage(e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">État du produit</label>
                            <input
                              type="text"
                              value={formCondition}
                              onChange={(e) => setFormCondition(e.target.value)}
                              placeholder="ex. Neuf sous blister ou Reconditionné certifié (Grade A+)"
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">
                            Galerie multi-photos (Une URL par ligne ou séparée par une virgule)
                          </label>
                          <textarea
                            rows={2}
                            value={formGalleryImages}
                            onChange={(e) => setFormGalleryImages(e.target.value)}
                            placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d] font-mono text-[11px]"
                          />
                          <span className="text-[10px] text-gray-400">
                            Ajoutez plusieurs vues de face, dos, écran, connectique. La première photo sert de visuel principal.
                          </span>
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Résumé court</label>
                          <input
                            type="text"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Courte présentation de 1 à 2 phrases affichée sur la carte du catalogue..."
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Description complète & détaillée</label>
                          <textarea
                            rows={3}
                            value={formLongDescription}
                            onChange={(e) => setFormLongDescription(e.target.value)}
                            placeholder="Présentation exhaustive du modèle, des fonctionnalités, des performances, de l'état technique et des modalités de retrait..."
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Caractéristiques techniques (séparées par une virgule)</label>
                          <input
                            type="text"
                            value={formSpecs}
                            onChange={(e) => setFormSpecs(e.target.value)}
                            placeholder="ex. Écran OLED, Charge rapide 20W, Stockage 128 Go, Connectivité 5G"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3f704d]"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featuredCheck"
                            checked={formFeatured}
                            onChange={(e) => setFormFeatured(e.target.checked)}
                            className="rounded text-[#3f704d] focus:ring-[#3f704d] accent-[#3f704d]"
                          />
                          <label htmlFor="featuredCheck" className="text-gray-700 font-medium cursor-pointer">
                            Mettre ce produit en avant dans la vitrine
                          </label>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNew(false);
                              setEditingProduct(null);
                            }}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            className="bg-[#3f704d] hover:bg-[#335c3f] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isAddingNew ? 'Enregistrer le produit' : 'Enregistrer les modifications'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Products Table */}
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="p-3">Produit</th>
                            <th className="p-3">Rayon</th>
                            <th className="p-3">Marque</th>
                            <th className="p-3">Prix (€)</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Garantie</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-emerald-50/40 transition">
                              <td className="p-3 flex items-center space-x-2.5">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                                <div>
                                  <p className="font-bold text-gray-900 leading-tight">{p.name}</p>
                                  {p.featured && (
                                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                                      En vedette
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-gray-600">{p.category}</td>
                              <td className="p-3 font-medium text-gray-800">{p.brand}</td>
                              <td className="p-3 font-bold text-emerald-950">{p.price.toFixed(2).replace('.', ',')} €</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    p.stock > 0
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}
                                </span>
                              </td>
                              <td className="p-3 text-gray-500 text-[11px]">{p.warranty}</td>
                              <td className="p-3 text-right">
                                <div className="inline-flex items-center space-x-1">
                                  <button
                                    onClick={() => handleStartEdit(p)}
                                    title="Modifier le produit"
                                    className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProductWithLog(p)}
                                    title="Supprimer le produit"
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
