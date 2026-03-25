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
import AppLoading from './components/AppLoading.vue'

const router = useRouter()
const toastRef = ref()
const confirmDialogRef = ref()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()

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
    favoritesStore.syncWithUser()
    cartStore.loadCart()
  }
}

// Observar mudanças na autenticação
watch(() => authStore.isAuthenticated, (isAuthenticated, wasAuthenticated) => {
  if (isAuthenticated && !wasAuthenticated) {
    // Usuário acabou de fazer login
    console.log('Usuário logado, carregando dados...')
    favoritesStore.syncWithUser()
    cartStore.loadCart()
  } else if (!isAuthenticated && wasAuthenticated) {
    // Usuário acabou de fazer logout
    console.log('Usuário deslogado, limpando dados...')
    favoritesStore.syncWithUser()
    cartStore.clearCart()
  }
})

// Observar mudanças no usuário
watch(() => authStore.user?.id, (newUserId, oldUserId) => {
  if (newUserId && newUserId !== oldUserId) {
    // Mudança de usuário (ex: login com conta diferente)
    console.log(`Usuário mudou de ${oldUserId} para ${newUserId}, recarregando dados...`)
    favoritesStore.syncWithUser()
    cartStore.loadCart()
  }
})

// Event listener para logout global
const handleUserLogout = (event: CustomEvent) => {
  console.log('Evento de logout recebido:', event.detail)
  // Limpar dados do usuário que fez logout
  if (event.detail?.userId) {
    favoritesStore.clearUserFavorites(event.detail.userId)
  }
  favoritesStore.syncWithUser()
  cartStore.clearCart()
}

// Event listener para login
const handleUserLogin = () => {
  console.log('Evento de login recebido')
  favoritesStore.syncWithUser()
  cartStore.loadCart()
}

// Registrar event listeners
onMounted(() => {
  window.addEventListener('user-logout', handleUserLogout as EventListener)
  window.addEventListener('user-login', handleUserLogin as EventListener)
})

// Remover event listeners
onUnmounted(() => {
  window.removeEventListener('user-logout', handleUserLogout as EventListener)
  window.removeEventListener('user-login', handleUserLogin as EventListener)
})

// Tratamento de erros globais
window.addEventListener('error', (event) => {
  console.error('Erro global:', event.error)
  // Aqui você pode enviar erros para um serviço de monitoramento
})

// Tratamento de promessas rejeitadas não tratadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason)
  if (toastRef.value) {
    ToastPlugin.error(
      'Erro',
      'Ocorreu um erro inesperado. Por favor, tente novamente.',
      5000
    )
  }
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