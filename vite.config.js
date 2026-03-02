import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType:'autoUpdate',
      includeAssets:['favicon.svg'],
      manifest:{
        name:'RegaClass',
        description:'Gerenciamento de turmas para escolas e professores.',
        theme_color:'#f5f6fa',
        background_color:'#f5f6fa',
        display:'standalone',
        start_url:'/',
        icons:[
          {
            src: '/pwa192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
