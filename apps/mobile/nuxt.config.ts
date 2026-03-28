export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false, // Capacitor requires SPA mode

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
    'pinia-plugin-persistedstate/nuxt',
  ],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL ?? 'ws://localhost:3001',
    },
  },

  imports: {
    dirs: ['composables/**', 'stores/**'],
  },

  app: {
    head: {
      title: 'BizManager',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },

  nitro: {
    output: {
      publicDir: './dist',
    },
  },
})
