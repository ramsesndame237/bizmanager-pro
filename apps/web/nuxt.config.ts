export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icon'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL ?? 'ws://localhost:3001',
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '../../../packages/ui/src/components', pathPrefix: false },
  ],

  imports: {
    dirs: ['stores', 'composables'],
  },

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },
})
