// Fichier: ~/ecommerce/frontend/src/api/axiosConfig.js

import axios from 'axios';

// On crée une instance d'axios avec une configuration par défaut
const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, // Lit l'URL depuis .env.local
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default apiClient;