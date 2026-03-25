<template>
  <div id="app">
    <AppLoading />
    <router-view />
    <Toast ref="toastRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import ToastPlugin from './plugins/toast'
import ConfirmPlugin from './plugins/confirm'
import { useAuthStore } from './stores/auth'
import { useFavoritesStore } from './stores/favorites'
import { useCartStore } from './stores/cart'
import { useOrdersStore } from './stores/orders'
import AppLoading from './components/AppLoading.vue'

const router = useRouter()
const toastRef = ref()
const confirmDialogRef = ref()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

// Configurar plugins
onMounted(() => {
  if (toastRef.value) {
    ToastPlugin.setInstance(toastRef.value)
  }
  
  if (confirmDialogRef.value) {
    ConfirmPlugin.setInstance(confirmDialogRef.value)
  }
  
  // Carregar dados iniciais
  initializeApp()
})

// Inicializar aplicação
const initializeApp = () => {
  // Carregar usuário do localStorage
  authStore.loadUser()
  
  // Se usuário estiver autenticado, carregar dados
  if (authStore.isAuthenticated) {
    console.log('App inicializado com usuário logado:', authStore.user?.id)
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
    ordersStore.syncWithUser()
  } else {
    console.log('App inicializado sem usuário logado')
  }
}

// Observar mudanças na autenticação
watch(() => authStore.isAuthenticated, (isAuthenticated, wasAuthenticated) => {
  if (isAuthenticated && !wasAuthenticated) {
    // Usuário acabou de fazer login
    console.log('Usuário logado (watch), carregando dados...')
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
    ordersStore.syncWithUser()
  } else if (!isAuthenticated && wasAuthenticated) {
    // Usuário acabou de fazer logout
    console.log('Usuário deslogado (watch), limpando dados...')
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
    ordersStore.syncWithUser()
  }
})

// Observar mudanças no ID do usuário
watch(() => authStore.user?.id, (newUserId, oldUserId) => {
  if (newUserId && newUserId !== oldUserId) {
    // Mudança de usuário (ex: login com conta diferente)
    console.log(`Usuário mudou de ${oldUserId} para ${newUserId}, recarregando dados...`)
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
    ordersStore.syncWithUser()
  }
})

// Event listener para logout global
const handleUserLogout = (event: CustomEvent) => {
  console.log('Evento de logout recebido:', event.detail)
  // Limpar dados do usuário que fez logout
  if (event.detail?.userId) {
    favoritesStore.clearUserFavorites(event.detail.userId)
    cartStore.clearUserCart()
    ordersStore.clearOrders()
  }
  favoritesStore.syncWithUser()
  cartStore.syncWithUser()
  ordersStore.syncWithUser()
}

// Event listener para login
const handleUserLogin = (event: CustomEvent) => {
  console.log('Evento de login recebido:', event.detail)
  favoritesStore.syncWithUser()
  cartStore.syncWithUser()
  ordersStore.syncWithUser()
}

// Event listener para atualização de usuário
const handleUserUpdated = (event: CustomEvent) => {
  console.log('Evento de atualização de usuário recebido:', event.detail)
  // Dados do usuário já foram atualizados no authStore
  // Os outros stores não precisam fazer nada, apenas continuar usando o user.id
}

// Event listener para limpeza de dados
const handleUserDataClear = (event: CustomEvent) => {
  console.log('Evento de limpeza de dados recebido:', event.detail)
  if (event.detail?.userId) {
    favoritesStore.clearUserFavorites(event.detail.userId)
    cartStore.clearUserCart()
    ordersStore.clearOrders()
  }
  favoritesStore.syncWithUser()
  cartStore.syncWithUser()
  ordersStore.syncWithUser()
}

// Registrar event listeners
onMounted(() => {
  window.addEventListener('user-logout', handleUserLogout as EventListener)
  window.addEventListener('user-login', handleUserLogin as EventListener)
  window.addEventListener('user-updated', handleUserUpdated as EventListener)
  window.addEventListener('user-data-clear', handleUserDataClear as EventListener)
})

// Remover event listeners
onUnmounted(() => {
  window.removeEventListener('user-logout', handleUserLogout as EventListener)
  window.removeEventListener('user-login', handleUserLogin as EventListener)
  window.removeEventListener('user-updated', handleUserUpdated as EventListener)
  window.removeEventListener('user-data-clear', handleUserDataClear as EventListener)
})

// Tratamento de erros globais
const handleGlobalError = (event: ErrorEvent) => {
  console.error('Erro global:', event.error)
  // Aqui você pode enviar erros para um serviço de monitoramento
  if (toastRef.value) {
    ToastPlugin.error(
      'Erro',
      'Ocorreu um erro inesperado. Por favor, tente novamente.',
      5000
    )
  }
}

// Tratamento de promessas rejeitadas não tratadas
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error('Promise rejeitada não tratada:', event.reason)
  if (toastRef.value) {
    ToastPlugin.error(
      'Erro',
      'Ocorreu um erro inesperado. Por favor, tente novamente.',
      5000
    )
  }
}

// Registrar listeners de erro
onMounted(() => {
  window.addEventListener('error', handleGlobalError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
})

// Remover listeners de erro
onUnmounted(() => {
  window.removeEventListener('error', handleGlobalError)
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
})
</script>

<style>
@import './style.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Estilos globais adicionais para melhorar a experiência */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Animações suaves para transições de página */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos para scroll suave */
html {
  scroll-behavior: smooth;
}

/* Prevenir flash de conteúdo não estilizado */
[v-cloak] {
  display: none;
}

/* Melhorar acessibilidade */
:focus-visible {
  outline: 2px solid var(--gold-primary);
  outline-offset: 2px;
}

/* Estilos para quando o app está carregando */
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--black-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.app-loading .spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: var(--gold-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Media queries para responsividade */
@media (max-width: 768px) {
  #app {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  #app {
    font-size: 13px;
  }
}

/* Modo escuro automático (se o sistema preferir) */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

/* Estilos para impressão */
@media print {
  .navbar,
  .footer,
  .btn,
  .icon-btn {
    display: none !important;
  }
  
  body {
    background: white;
    color: black;
  }
  
  .card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>