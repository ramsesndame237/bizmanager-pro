export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icon'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1',
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '../../../packages/ui/src/components', pathPrefix: false },
  ],

  imports: {
    dirs: ['stores', 'composables'],
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
      ],
    },
  },
})
