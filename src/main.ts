import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import ToastPlugin from './plugins/toast'
import ConfirmPlugin from './plugins/confirm'
import { setupPrimeVue } from './plugins/primevue'


import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Configurar PrimeVue
setupPrimeVue(app)

app.use(pinia)
app.use(router)
app.use(ToastPlugin)
app.use(ConfirmPlugin)

app.mount('#app')