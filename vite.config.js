import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Chunks "vendor" stables (framework + libs) pour alléger le bundle d'entrée
    // et améliorer le cache navigateur entre deux déploiements.
    rolldownOptions: {
      output: {
        // rolldown attend une fonction (l'objet "vendor" de Rollup n'est plus accepté).
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'react'
          }
          return 'ui'
        },
      },
    },
  },
})
