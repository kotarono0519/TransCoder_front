// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],
  css: ['vue3-toastify/dist/index.css'],
  app: {
    head: {
      title: 'TransCoder - Code Translation Tool',
      htmlAttrs: {
        class: 'dark'
      }
    }
  },
  runtimeConfig: {
    public: {
      palmApiKey: process.env.PALM_API_KEY
    }
  },
  vite: {
    optimizeDeps: {
      exclude: ['codemirror', '@codemirror/view', '@codemirror/state', '@codemirror/theme-one-dark', '@codemirror/lang-javascript', '@codemirror/lang-python', '@codemirror/lang-java', '@codemirror/lang-php', '@codemirror/lang-cpp']
    }
  }
})
