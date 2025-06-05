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
  }
})
