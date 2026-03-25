import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

// Componentes que você vai usar
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Skeleton from 'primevue/skeleton'
import ProgressSpinner from 'primevue/progressspinner'
import Rating from 'primevue/rating'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Chip from 'primevue/chip'

// Importar estilos
import 'primeicons/primeicons.css'

export function setupPrimeVue(app: App): void {
  // Configurar PrimeVue com tema Aura
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark-mode', // Se você quiser suporte a dark mode
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities'
        }
      }
    }
  })
  
  // Serviço de Toast (para notificações)
  app.use(ToastService)
  
  // Registrar componentes globais
  app.component('Button', Button)
  app.component('Card', Card)
  app.component('InputText', InputText)
  app.component('Password', Password)
  app.component('Toast', Toast)
  app.component('Dialog', Dialog)
  app.component('Dropdown', Dropdown)
  app.component('DataTable', DataTable)
  app.component('Column', Column)
  app.component('Badge', Badge)
  app.component('Avatar', Avatar)
  app.component('Skeleton', Skeleton)
  app.component('ProgressSpinner', ProgressSpinner)
  app.component('Rating', Rating)
  app.component('Tag', Tag)
  app.component('Divider', Divider)
  app.component('Chip', Chip)
}