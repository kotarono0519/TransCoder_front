import Vue3Toastify, { toast } from 'vue3-toastify'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    position: toast.POSITION.BOTTOM_LEFT,
    theme: 'dark',
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  })
})