/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/components/PublicLayout.jsx (Final) */
/* =================================================================== */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster, ToastBar } from 'react-hot-toast';

export default function PublicLayout() {
  return (
    // Ce conteneur flexible organise la page verticalement
    // et assure qu'elle prend au moins toute la hauteur de l'écran.
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      
      {/* Votre système de notifications (toasts) personnalisé */}
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
                
                {t.visible ? (
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: t.type === 'success' ? '#28a745' : t.type === 'error' ? '#dc3545' : 'transparent',
                      animation: `toast-progress ${t.duration}ms linear forwards`
                    }} 
                  />
                ) : null}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      
      {/* Le Header (Navbar) est le premier élément */}
      <Header />
      
      {/* La balise <main> est flexible et grandit pour remplir l'espace */}
      <main className="flex-grow-1">
        <Outlet /> 
      </main>
      
      {/* Le Footer est le dernier élément, poussé en bas */}
      <Footer />
    </div>
  );
}