/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/components/ProtectedRoute.jsx  */
/* =================================================================== */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, on affiche le composant enfant demandé
  return children;
}