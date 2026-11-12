/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { 
  Product, 
  ActiveTab, 
  OrderConfirmation, 
  DEFAULT_CATEGORIES,
  RepairServiceTariff,
  PrintPricingSettings,
  MoneyTransferPartner,
  StoreSettings,
  ServiceSlideItem,
  CustomerRequest,
  AdminAccount
} from './types';
import { authService } from './services/authService';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { 
  INITIAL_REPAIR_TARIFFS,
  INITIAL_PRINT_PRICING,
  INITIAL_MONEY_PARTNERS,
  INITIAL_STORE_SETTINGS,
  INITIAL_SLIDER_ITEMS 
} from './data/initialSystemSettings';
import { INITIAL_CUSTOMER_REQUESTS } from './data/initialCustomerRequests';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { MoneyTransferView } from './components/MoneyTransferView';
import { AccessoriesCatalog } from './components/AccessoriesCatalog';
import { PrintAndDocumentHub } from './components/PrintAndDocumentHub';
import { RepairsAndUnlockingView } from './components/RepairsAndUnlockingView';
import { ServicesOverview } from './components/ServicesOverview';
import { BuyModal } from './components/BuyModal';
import { ProductBackendModal } from './components/ProductBackendModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { RequestProductModal } from './components/RequestProductModal';
import { Footer } from './components/Footer';

const STORAGE_KEY = '3communes_products_inventory_v3';
const CATEGORIES_STORAGE_KEY = '3communes_categories_v3';
const REPAIRS_STORAGE_KEY = '3communes_repair_tariffs_v1';
const PRINT_STORAGE_KEY = '3communes_print_pricing_v1';
const MONEY_STORAGE_KEY = '3communes_money_partners_v1';
const SLIDER_STORAGE_KEY = '3communes_slider_items_v2';
const STORE_STORAGE_KEY = '3communes_store_settings_v1';
const REQUESTS_STORAGE_KEY = '3communes_customer_requests_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminAccount | null>(null);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState<boolean>(false);
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  // Listen for Google Maps Platform quota / auth failures globally
  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Restore session automatically across page refresh & navigation via HttpOnly cookie
  useEffect(() => {
    authService.verifySession().then((res) => {
      if (res.valid && res.admin) {
        setCurrentAdminUser(res.admin);
      }
    });
  }, []);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge multi-picture arrays and broad descriptions into existing cached products
          return parsed.map((p: Product) => {
            const initialMatch = INITIAL_PRODUCTS.find((init) => init.id === p.id);
            if (initialMatch) {
              return {
                ...initialMatch,
                ...p,
                images: p.images && p.images.length ? p.images : initialMatch.images,
                longDescription: p.longDescription || initialMatch.longDescription,
                condition: p.condition || initialMatch.condition
              };
            }
            return p;
          });
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CATEGORIES;
  });

  // Repair Tariffs State (Persisted in localStorage)
  const [repairTariffs, setRepairTariffs] = useState<RepairServiceTariff[]>(() => {
    try {
      const saved = localStorage.getItem(REPAIRS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_REPAIR_TARIFFS;
  });

  // Print Pricing Settings State (Persisted in localStorage)
  const [printPricing, setPrintPricing] = useState<PrintPricingSettings>(() => {
    try {
      const saved = localStorage.getItem(PRINT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...INITIAL_PRINT_PRICING, ...parsed };
      }
    } catch {}
    return INITIAL_PRINT_PRICING;
  });

  // Money Transfer Partners State (Persisted in localStorage)
  const [moneyPartners, setMoneyPartners] = useState<MoneyTransferPartner[]>(() => {
    try {
      const saved = localStorage.getItem(MONEY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MONEY_PARTNERS;
  });

  // Slider Posters & Carousel State (Persisted in localStorage)
  const [sliderItems, setSliderItems] = useState<ServiceSlideItem[]>(() => {
    try {
      const saved = localStorage.getItem(SLIDER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: ServiceSlideItem) => {
            let img = item.image || '';
            if (img.startsWith('/src/assets/images/')) {
              img = img.replace('/src/assets/images/', '/assets/images/');
            }
            return { ...item, image: img || '/assets/images/phones_accessories.jpg' };
          });
        }
      }
    } catch {}
    return INITIAL_SLIDER_ITEMS;
  });

  // Store Settings & Coordinates State (Persisted in localStorage)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...INITIAL_STORE_SETTINGS, ...parsed };
      }
    } catch {}
    return INITIAL_STORE_SETTINGS;
  });

  // Customer Inquiries & Orders Inbox State (Persisted in localStorage)
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>(() => {
    try {
      const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CUSTOMER_REQUESTS;
  });

  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [isBackendOpen, setIsBackendOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestModalQuery, setRequestModalQuery] = useState('');
  const [requestModalCategory, setRequestModalCategory] = useState('');

  const handleOpenRequestProduct = (query?: string, category?: string) => {
    setRequestModalQuery(query || '');
    setRequestModalCategory(category || '');
    setIsRequestModalOpen(true);
  };

  // Sync customer requests to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(customerRequests));
    } catch (e) {
      console.error('Failed to save customer requests', e);
    }
  }, [customerRequests]);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  // Sync products to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [products]);

  // Sync repairs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REPAIRS_STORAGE_KEY, JSON.stringify(repairTariffs));
    } catch (e) {
      console.error('Failed to save repair tariffs', e);
    }
  }, [repairTariffs]);

  // Sync print pricing to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRINT_STORAGE_KEY, JSON.stringify(printPricing));
    } catch (e) {
      console.error('Failed to save print pricing', e);
    }
  }, [printPricing]);

  // Sync money partners to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MONEY_STORAGE_KEY, JSON.stringify(moneyPartners));
    } catch (e) {
      console.error('Failed to save money partners', e);
    }
  }, [moneyPartners]);

  // Sync slider items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SLIDER_STORAGE_KEY, JSON.stringify(sliderItems));
    } catch (e) {
      console.error('Failed to save slider items', e);
    }
  }, [sliderItems]);

  // Sync store settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(storeSettings));
    } catch (e) {
      console.error('Failed to save store settings', e);
    }
  }, [storeSettings]);

  // Reset actions for system settings
  const handleResetRepairTariffs = () => {
    setRepairTariffs(INITIAL_REPAIR_TARIFFS);
    try { localStorage.setItem(REPAIRS_STORAGE_KEY, JSON.stringify(INITIAL_REPAIR_TARIFFS)); } catch {}
  };

  const handleResetPrintPricing = () => {
    setPrintPricing(INITIAL_PRINT_PRICING);
    try { localStorage.setItem(PRINT_STORAGE_KEY, JSON.stringify(INITIAL_PRINT_PRICING)); } catch {}
  };

  const handleResetMoneyPartners = () => {
    setMoneyPartners(INITIAL_MONEY_PARTNERS);
    try { localStorage.setItem(MONEY_STORAGE_KEY, JSON.stringify(INITIAL_MONEY_PARTNERS)); } catch {}
  };

  const handleResetSliderItems = () => {
    setSliderItems(INITIAL_SLIDER_ITEMS);
    try { localStorage.setItem(SLIDER_STORAGE_KEY, JSON.stringify(INITIAL_SLIDER_ITEMS)); } catch {}
  };

  const handleResetStoreSettings = () => {
    setStoreSettings(INITIAL_STORE_SETTINGS);
    try { localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(INITIAL_STORE_SETTINGS)); } catch {}
  };

  // Backend product actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    } catch {
      // Ignore
    }
  };

  const handleAddCategory = (newCat: string): boolean => {
    const trimmed = newCat.trim();
    if (!trimmed) return false;
    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;
    setCategories((prev) => [...prev, trimmed]);
    return true;
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setCategories((prev) => prev.filter((c) => c !== catToDelete));
  };

  const handleBuyProduct = (product: Product) => {
    setBuyingProduct(product);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedProduct(null);
  };

  const handleAddCustomerRequest = (newReq: CustomerRequest) => {
    setCustomerRequests((prev) => [newReq, ...prev]);
  };

  const handleUpdateCustomerRequestStatus = (id: string, status: CustomerRequest['status']) => {
    setCustomerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleDeleteCustomerRequest = (id: string) => {
    setCustomerRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOrderSuccess = (confirmation: OrderConfirmation) => {
    setBuyingProduct(null);
    setOrderConfirmation(confirmation);

    // Automatically record customer order into Admin Inbox
    const newReq: CustomerRequest = {
      id: confirmation.orderId,
      type: 'order',
      customerName: confirmation.customerName,
      customerPhone: confirmation.customerPhone,
      customerEmail: confirmation.customerEmail,
      title: `${confirmation.productName} (x${confirmation.quantity})`,
      details: confirmation.notes 
        ? `${confirmation.notes} • Mode : ${confirmation.deliveryMethod === 'pickup' ? 'Retrait boutique' : 'Livraison express'}`
        : `Commande en ligne • Mode : ${confirmation.deliveryMethod === 'pickup' ? 'Retrait boutique' : 'Livraison express'} • Paiement : ${confirmation.paymentMethod === 'counter' ? 'Au comptoir' : 'En ligne'}`,
      quantity: confirmation.quantity,
      totalPrice: confirmation.totalPrice,
      deliveryMethod: confirmation.deliveryMethod,
      paymentMethod: confirmation.paymentMethod,
      date: confirmation.orderDate + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'new',
      channel: 'web'
    };
    handleAddCustomerRequest(newReq);
  };

  const appContent = (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-[#3f704d] selection:text-white">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      
      {/* Navigation Bar with Logo beside Home button, Home emoji only, slightly green buttons */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenBackend={() => setIsBackendOpen(true)}
        productsCount={products.length}
        storeSettings={storeSettings}
        currentUser={currentAdminUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => setSelectedProduct(null)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onBuyProduct={handleBuyProduct}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeHero 
                setActiveTab={handleTabChange} 
                onOpenBackend={() => setIsBackendOpen(true)}
                onRequestProduct={handleOpenRequestProduct}
                slides={sliderItems}
                storeSettings={storeSettings}
              />
            )}

            {activeTab === 'money' && (
              <MoneyTransferView partners={moneyPartners} />
            )}

            {activeTab === 'accessories' && (
              <AccessoriesCatalog
                products={products}
                categories={categories}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onBuyProduct={handleBuyProduct}
                onOpenBackend={() => setIsBackendOpen(true)}
                onRequestProduct={handleOpenRequestProduct}
              />
            )}

            {activeTab === 'print' && (
              <PrintAndDocumentHub pricing={printPricing} />
            )}

            {activeTab === 'repairs' && (
              <RepairsAndUnlockingView 
                tariffs={repairTariffs}
                phoneNumber={storeSettings.phone}
                onSaveBooking={handleAddCustomerRequest}
              />
            )}

            {activeTab === 'services' && (
              <ServicesOverview setActiveTab={handleTabChange} />
            )}
          </>
        )}
      </main>

      {/* Footer with Romainville details, transit, partners, contact */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenBackend={() => setIsBackendOpen(true)}
        storeSettings={storeSettings}
      />

      {/* Buy Modal (Replaces reserve for pickup, with Euro checkout) */}
      <BuyModal
        product={buyingProduct}
        onClose={() => setBuyingProduct(null)}
        onSuccess={handleOrderSuccess}
      />

      {/* Order Receipt Modal */}
      <OrderReceiptModal
        order={orderConfirmation}
        onClose={() => setOrderConfirmation(null)}
      />

      {/* Request New Product / Custom Order Modal */}
      <RequestProductModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        initialQuery={requestModalQuery}
        initialCategory={requestModalCategory}
        onSaveRequest={handleAddCustomerRequest}
      />

      {/* Client Product Management Backend Modal (Protected by Admin Login, with Category Management) */}
      <ProductBackendModal
        isOpen={isBackendOpen}
        onClose={() => setIsBackendOpen(false)}
        products={products}
        categories={categories}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        repairTariffs={repairTariffs}
        onUpdateRepairTariffs={setRepairTariffs}
        onResetRepairTariffs={handleResetRepairTariffs}
        printPricing={printPricing}
        onUpdatePrintPricing={setPrintPricing}
        onResetPrintPricing={handleResetPrintPricing}
        moneyPartners={moneyPartners}
        onUpdateMoneyPartners={setMoneyPartners}
        onResetMoneyPartners={handleResetMoneyPartners}
        sliderItems={sliderItems}
        onUpdateSliderItems={setSliderItems}
        onResetSliderItems={handleResetSliderItems}
        storeSettings={storeSettings}
        onUpdateStoreSettings={setStoreSettings}
        onResetStoreSettings={handleResetStoreSettings}
        customerRequests={customerRequests}
        onUpdateCustomerRequestStatus={handleUpdateCustomerRequestStatus}
        onDeleteCustomerRequest={handleDeleteCustomerRequest}
        currentUser={currentAdminUser}
        onCurrentUserChange={setCurrentAdminUser}
      />

    </div>
  );

  if (mapsApiKey) {
    return (
      <APIProvider
        apiKey={mapsApiKey}
        libraries={['marker']}
        language="fr"
        region="FR"
      >
        {appContent}
      </APIProvider>
    );
  }

  return appContent;
}
