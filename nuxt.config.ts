import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  runtimeConfig: {
    public: {
      baseApi: process.env.NUXT_PUBLIC_BASE_API || 'http://localhost:8080'
    }
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})
