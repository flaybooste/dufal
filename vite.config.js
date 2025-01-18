import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    UnoCSS(),

  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.sieg.com', // URL da API
        rewrite: (path) => path.replace( "/api", '' ),

        changeOrigin: true, // Permite redirecionar para outro domínio
        ws: true,
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.sieg.com', // URL da API
        changeOrigin: true, // Permite redirecionar para outro domínio
        rewrite: (path) => path.replace( "/^\api", '' ),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      stream: "stream-browserify", // Substitui pelo equivalente para navegador
      timers: "timers-browserify", // 
    },
  },
})
