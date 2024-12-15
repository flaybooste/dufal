import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.sieg.com', // URL da API
        changeOrigin: true, // Permite redirecionar para outro domínio
        pathRewrite: { '^/api': '' }, // Remove o prefixo `/api`
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
