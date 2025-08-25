/* =================================================================== */
/* Fichier : ~/ecommerce/frontend/src/context/AuthContext.jsx        */
/* =================================================================== */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig'; // On importe notre instance d'axios

// 1. Création du Contexte
const AuthContext = createContext(null);

// 2. Création du "Fournisseur" (Provider)
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  
  // États pour l'utilisateur, le token et le chargement
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // État de chargement initial

  // Ce useEffect s'exécute UNE SEULE FOIS au démarrage de l'application
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        // Si des données existent, on les met dans l'état
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        // Et on configure immédiatement l'en-tête global d'axios
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation du contexte d'authentification:", error);
      // En cas d'erreur, on nettoie pour éviter les problèmes
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      // Une fois la vérification terminée, on indique que le chargement initial est fini
      setIsLoading(false);
    }
  }, []); // Le tableau de dépendances vide [] garantit que cet effet ne s'exécute qu'une seule fois.

  // Fonction de connexion
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    // On configure axios pour toutes les futures requêtes de cette session
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // On supprime l'en-tête axios pour que les futures requêtes ne soient plus authentifiées
    delete apiClient.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // Fonction pour mettre à jour l'utilisateur (après modification du profil)
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // On rassemble les valeurs à partager avec le reste de l'application
  const value = {
    user,
    token,
    isLoading, // On expose l'état de chargement
    login,
    logout,
    setUser: updateUser, // On expose la fonction de mise à jour sous le nom 'setUser'
  };

  // On n'affiche le reste de l'application que lorsque le chargement initial est terminé.
  // Cela empêche les composants enfants de faire des appels API avant que le token soit prêt.
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// 3. Hook personnalisé pour utiliser facilement le contexte
export function useAuth() {
  return useContext(AuthContext);
}