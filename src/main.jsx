/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/main.jsx (Corrigé)             */
/* =================================================================== */
// Fichier: src/main.jsx
import eruda from 'eruda';

// On n'active Eruda qu'en mode développement
if (process.env.NODE_ENV === 'development') {
  eruda.init();
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom'; // <-- On importe BrowserRouter ici

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. On met BrowserRouter TOUT en haut. C'est le contexte de routage. */}
    <BrowserRouter>
      {/* 2. On met AuthProvider à l'intérieur. Il a maintenant accès au routage. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);