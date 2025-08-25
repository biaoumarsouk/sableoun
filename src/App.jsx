/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/App.jsx (Final et Corrigé)     */
/* =================================================================== */

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// --- Pages Publiques ---
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import DecouvrirPage from './pages/DecouvrirPage';
import AProposPage from './pages/AProposPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SellerProfilePage from './pages/SellerProfilePage'; // <-- Importer
import AfficheDetailPage from './pages/AfficheDetailPage'; // <-- Importer
import SellerListPage from './pages/SellerListPage'; // <-- Importer
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// --- Pages et Layout de l'Espace Vendeur ---
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProductListPage from './pages/dashboard/ProductListPage';
import ProductCreatePage from './pages/dashboard/ProductCreatePage';
import ProductEditPage from './pages/dashboard/ProductEditPage';
import AfficheListPage from './pages/dashboard/AfficheListPage';
import AfficheCreatePage from './pages/dashboard/AfficheCreatePage';
import MessageListPage from './pages/dashboard/MessageListPage';
import MessageDetailPage from './pages/dashboard/MessageDetailPage';
import AfficheEditPage from './pages/dashboard/AfficheEditPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SubscriptionPage from './pages/dashboard/SubscriptionPage';

// --- Composants & Outils ---
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster, ToastBar } from 'react-hot-toast';

// On définit le contenu principal de l'application
function MainContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="d-flex flex-column h-100">

      {/* --- Vos Options de Toast --- */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              background: '#ffffff',
              color: '#1a1a1a',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.visible && (
                  <div 
                    style={{
                      position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px',
                      background: t.type === 'success' ? '#28a745' : t.type === 'error' ? '#dc3545' : 'transparent',
                      animation: `toast-progress ${t.duration}ms linear forwards`,
                    }} 
                  />
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>

      {/* Affiche le Header seulement si on n'est PAS sur le dashboard */}
      {!isDashboardRoute && <Header />}
      
      <main className="flex-grow-1 bg-light">
        <Routes>
          {/* --- Routes Publiques --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/decouvrir" element={<DecouvrirPage />} />
          <Route path="/a-propos" element={<AProposPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/vendeurs" element={<SellerListPage />} />
          <Route path="/vendeur/:slug" element={<SellerProfilePage />} />
          <Route path="/affiches/:id" element={<AfficheDetailPage />} /> {/* <-- NOUVELLE ROUTE */}
          <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* --- Routes Protégées de l'Espace Vendeur --- */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="produits" element={<ProductListPage />} />
            <Route path="produits/nouveau" element={<ProductCreatePage />} />
            <Route path="affiches" element={<AfficheListPage />} />
            <Route path="affiches/nouvelle" element={<AfficheCreatePage />} />
            <Route path="produits/modifier/:productId" element={<ProductEditPage />} />
            <Route path="messages" element={<MessageListPage />} />
            <Route path="messages/:messageId" element={<MessageDetailPage />} />
            <Route path="affiches/modifier/:afficheId" element={<AfficheEditPage />} />
            <Route path="profil" element={<ProfilePage />} />
            <Route path="abonnement" element={<SubscriptionPage />} />
            <Route path="commandes" element={<div><h1>Mes Commandes</h1></div>} />
            <Route path="statistiques" element={<div><h1>Mes Statistiques</h1></div>} />
            <Route path="profil" element={<div><h1>Mon Profil</h1></div>} />
            <Route path="abonnement" element={<div><h1>Mon Abonnement</h1></div>} />
          </Route>

          {/* --- Route pour les pages non trouvées --- */}
          <Route path="*" element={<div className="text-center p-5"><h1>404 - Page Non Trouvée</h1></div>} />
        </Routes>
      </main>

      {/* Affiche le Footer seulement si on n'est PAS sur le dashboard */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

// Le composant App englobe maintenant le tout, car BrowserRouter est dans main.jsx
function App() {
  return <MainContent />;
}

export default App;