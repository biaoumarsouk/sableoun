// Fichier: ~/ecommerce/frontend/vite.config.js (Corrigé)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy' // <-- 1. Importer le nouveau plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({ // <-- 2. Ajouter le plugin à la liste
      targets: ['defaults', 'not IE 11']
    })
  ],
})