export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

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
    // Server-side only
    jwtSecret: process.env.JWT_SECRET,
    // Public (exposed to client)
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL ?? 'ws://localhost:3001',
    },
  },

  imports: {
    dirs: ['composables/**', 'stores/**', 'utils/**'],
  },

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '../../packages/ui/src', pathPrefix: false },
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'BizManager Pro',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
