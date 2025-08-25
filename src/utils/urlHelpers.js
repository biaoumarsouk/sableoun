// Fichier: ~/ecommerce/frontend/src/utils/urlHelpers.js (Nouveau)

// On récupère l'URL de base de notre API depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Construit l'URL complète pour une image stockée sur le backend Laravel.
 * @param {string} imagePath - Le chemin relatif de l'image (ex: 'affiches/image.png').
 * @returns {string} L'URL complète de l'image.
 */
export function getImageUrl(imagePath) {
    if (!imagePath) {
        // Retourne une image de remplacement si le chemin est vide
        return 'https://via.placeholder.com/600x400';
    }
    // On construit l'URL en ajoutant '/storage/' au chemin
    return `${API_BASE_URL}/storage/${imagePath}`;
}