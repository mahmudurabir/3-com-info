/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, ActiveTab, OrderConfirmation, DEFAULT_CATEGORIES } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
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
import { Footer } from './components/Footer';

const STORAGE_KEY = '3communes_products_inventory_v3';
const CATEGORIES_STORAGE_KEY = '3communes_categories_v3';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [isBackendOpen, setIsBackendOpen] = useState(false);

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

  const handleOrderSuccess = (confirmation: OrderConfirmation) => {
    setBuyingProduct(null);
    setOrderConfirmation(confirmation);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-[#3f704d] selection:text-white">
      
      {/* Navigation Bar with Logo beside Home button, Home emoji only, slightly green buttons */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenBackend={() => setIsBackendOpen(true)}
        productsCount={products.length}
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
              />
            )}

            {activeTab === 'money' && (
              <MoneyTransferView />
            )}

            {activeTab === 'accessories' && (
              <AccessoriesCatalog
                products={products}
                categories={categories}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onBuyProduct={handleBuyProduct}
                onOpenBackend={() => setIsBackendOpen(true)}
              />
            )}

            {activeTab === 'print' && (
              <PrintAndDocumentHub />
            )}

            {activeTab === 'repairs' && (
              <RepairsAndUnlockingView />
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
      />

    </div>
  );
}
