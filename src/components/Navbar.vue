<template>
  <nav class="navbar-premium">
    <div class="container nav-container-premium">
      <!-- Botão Voltar (Mobile) -->
      <button 
        v-if="isMobile && canGoBack" 
        class="back-btn-mobile" 
        @click="goBack"
        aria-label="Voltar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Voltar</span>
      </button>

      <div class="logo-premium-nav" @click="goHome">
        <div class="logo-ring-nav">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#D4AF37"/>
                <stop offset="50%" stop-color="#F5E6A0"/>
                <stop offset="100%" stop-color="#D4AF37"/>
              </linearGradient>
            </defs>
            <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="url(#navLogoGradient)"/>
          </svg>
        </div>
        <h1>Shop<span class="gold-text">Hub</span></h1>
      </div>
      
      <div class="nav-links-premium">
        <router-link to="/" class="nav-link-premium" active-class="active-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M9 21V12H15V21" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <span>Home</span>
        </router-link>
        <router-link to="/products" class="nav-link-premium" active-class="active-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 7L12 12L4 7M20 7V17L12 22M20 7L12 2L4 7M12 22V12" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <span>Produtos</span>
        </router-link>
        <!-- Link para Admin (só aparece se for admin) -->
        <router-link 
          v-if="isAuthenticated && isAdmin" 
          to="/admin" 
          class="nav-link-premium admin-link-nav"
          active-class="active-link"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
          </svg>
          <span>Admin</span>
        </router-link>
      </div>
      
      <!-- Search Bar -->
      <SearchBar />
      
      <div class="nav-icons-premium">
        <!-- Ícone de Favoritos (só aparece se logado) -->
        <router-link 
          v-if="isAuthenticated"
          to="/favorites" 
          class="icon-btn-premium favorites-btn" 
          aria-label="Favoritos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
          </svg>
          <span v-if="totalFavorites > 0" class="badge-premium favorites-badge">{{ totalFavorites }}</span>
        </router-link>
        
        <!-- Ícone do Carrinho (só aparece se logado) -->
        <router-link 
          v-if="isAuthenticated"
          to="/cart" 
          class="icon-btn-premium cart-btn" 
          aria-label="Carrinho"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <span v-if="cartTotalItems > 0" class="badge-premium cart-badge">{{ cartTotalItems }}</span>
        </router-link>
        
        <!-- Ícone do Usuário com Dropdown (sempre visível) -->
        <div class="user-menu-premium" v-click-outside="closeUserMenu">
          <button class="icon-btn-premium user-btn" @click="toggleUserMenu" aria-label="Usuário">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          
          <transition name="dropdown-premium">
            <div v-if="showUserMenu" class="user-dropdown-premium">
              <div v-if="isAuthenticated" class="user-info-premium">
                <div class="user-avatar-premium">
                  {{ userInitials }}
                </div>
                <div class="user-details-premium">
                  <p class="user-name-premium">{{ user?.name }}</p>
                  <p class="user-email-premium">{{ user?.email }}</p>
                  <p class="user-role-premium" v-if="isAdmin">Administrador</p>
                </div>
              </div>
              
              <div v-else class="user-info-premium guest">
                <div class="user-avatar-premium guest-avatar">
                  👤
                </div>
                <div class="user-details-premium">
                  <p class="user-name-premium">Visitante</p>
                  <p class="user-email-premium">Faça login para mais recursos</p>
                </div>
              </div>
              
              <div class="dropdown-divider-premium"></div>
              
              <!-- Admin Panel no dropdown (só para admin) -->
              <router-link 
                v-if="isAuthenticated && isAdmin" 
                to="/admin" 
                class="dropdown-item-premium admin-dropdown-item"
                @click="closeUserMenu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
                </svg>
                Painel Admin
                <span class="admin-badge-premium">ADMIN</span>
              </router-link>
              
              <router-link to="/profile" class="dropdown-item-premium" v-if="isAuthenticated" @click="closeUserMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Meu Perfil
              </router-link>
              
              <router-link to="/orders" class="dropdown-item-premium" v-if="isAuthenticated" @click="closeUserMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Meus Pedidos
              </router-link>
              
              <router-link to="/favorites" class="dropdown-item-premium" v-if="isAuthenticated" @click="closeUserMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                </svg>
                Favoritos
                <span v-if="totalFavorites > 0" class="item-badge-premium">{{ totalFavorites }}</span>
              </router-link>
              
              <router-link to="/cart" class="dropdown-item-premium" v-if="isAuthenticated" @click="closeUserMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                </svg>
                Carrinho
                <span v-if="cartTotalItems > 0" class="item-badge-premium">{{ cartTotalItems }}</span>
              </router-link>
              
              <div class="dropdown-divider-premium"></div>
              
              <button v-if="isAuthenticated" class="dropdown-item-premium logout-btn-premium" @click="handleLogout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Sair
              </button>
              
              <router-link v-else to="/login" class="dropdown-item-premium login-link-dropdown-premium" @click="closeUserMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Entrar
              </router-link>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const toast = useToast()

const showUserMenu = ref(false)
const isMobile = ref(false)
const canGoBack = ref(false)

// Verificar se é mobile e se pode voltar
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const checkCanGoBack = () => {
  // Verifica se há histórico para voltar
  canGoBack.value = window.history.length > 1
}

// Escutar mudanças na rota para atualizar o botão voltar
watch(() => route.path, () => {
  checkCanGoBack()
})

// Computed properties
const cartTotalItems = computed(() => cartStore.totalItems)
const totalFavorites = computed(() => favoritesStore.totalFavorites)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const loading = computed(() => authStore.isLoading)

// Verificar se é administrador
const isAdmin = computed(() => {
  return user.value?.role === 'admin'
})

// Computed: iniciais do usuário
const userInitials = computed(() => {
  if (!user.value) return ''
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Methods
const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (canGoBack.value) {
    router.go(-1)
  } else {
    // Se não tiver histórico, volta para home
    router.push('/')
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = () => {
  authStore.logout()
  toast.info('Logout realizado', 'Você saiu da sua conta.', 3000)
  closeUserMenu()
  router.push('/')
}

// Observar mudanças na autenticação para sincronizar favoritos
watch(() => authStore.isAuthenticated, (newValue, oldValue) => {
  if (newValue) {
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
  } else if (oldValue && !newValue) {
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
  }
})

// Observar mudanças no ID do usuário
watch(() => authStore.user?.id, () => {
  if (authStore.isAuthenticated) {
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
  }
})

// Diretiva para fechar menu ao clicar fora
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Lifecycle
onMounted(() => {
  authStore.loadUser()
  
  if (authStore.isAuthenticated) {
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
  }
  
  checkMobile()
  checkCanGoBack()
  
  window.addEventListener('resize', checkMobile)
  window.addEventListener('popstate', checkCanGoBack)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('popstate', checkCanGoBack)
})
</script>

<style scoped>
/* Navbar Premium */
.navbar-premium {
  background: rgba(11, 11, 15, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-premium:hover {
  background: rgba(11, 11, 15, 0.95);
  border-bottom-color: rgba(212, 175, 55, 0.4);
}

.nav-container-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 24px;
  max-width: 1280px;
  margin: 0 auto;
  gap: 24px;
  position: relative;
}

/* Botão Voltar Mobile Premium */
.back-btn-mobile {
  display: none;
  align-items: center;
  gap: 6px;
  background: rgba(59, 58, 64, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: var(--gold-primary);
  padding: 8px 14px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.back-btn-mobile::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.4s ease;
}

.back-btn-mobile:hover::before {
  left: 100%;
}

.back-btn-mobile:hover {
  background: rgba(212, 175, 55, 0.15);
  transform: translateX(-2px);
  border-color: rgba(212, 175, 55, 0.4);
}

.back-btn-mobile svg {
  transition: transform 0.3s ease;
}

.back-btn-mobile:hover svg {
  transform: translateX(-2px);
}

/* Logo Premium */
.logo-premium-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.logo-premium-nav:hover {
  transform: translateY(-2px);
}

.logo-ring-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulseRingNav 2s ease-in-out infinite;
}

@keyframes pulseRingNav {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.logo-premium-nav h1 {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
}

.logo-premium-nav .gold-text {
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
  color: var(--gold-primary);
}

/* Navigation Links Premium */
.nav-links-premium {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  text-decoration: none;
  color: rgba(245, 240, 230, 0.7);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border-radius: 40px;
  position: relative;
}

.nav-link-premium svg {
  transition: all 0.3s ease;
}

.nav-link-premium:hover {
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-1px);
}

.nav-link-premium.active-link {
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.15);
}

.nav-link-premium.active-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
  border-radius: 2px;
}

/* Admin link especial */
.admin-link-nav {
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.admin-link-nav:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.4);
}

/* Icons Premium */
.nav-icons-premium {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon-btn-premium {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 230, 0.7);
  position: relative;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  text-decoration: none;
}

.icon-btn-premium:hover {
  color: var(--gold-primary);
  transform: translateY(-2px);
  background: rgba(212, 175, 55, 0.1);
}

.icon-btn-premium:active {
  transform: translateY(0);
}

/* Badges Premium */
.badge-premium {
  position: absolute;
  top: 2px;
  right: 2px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  font-size: 0.65rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* User Menu Premium */
.user-menu-premium {
  position: relative;
}

.user-btn {
  cursor: pointer;
}

.user-dropdown-premium {
  position: absolute;
  top: 52px;
  right: 0;
  min-width: 300px;
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1);
  overflow: hidden;
  z-index: 1000;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-premium-enter-active,
.dropdown-premium-leave-active {
  transition: all 0.2s ease;
}

.dropdown-premium-enter-from,
.dropdown-premium-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* User Info */
.user-info-premium {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%);
}

.user-avatar-premium {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--black-primary);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.user-avatar-premium.guest-avatar {
  background: rgba(59, 58, 64, 0.6);
  color: var(--white-soft);
  font-size: 1.6rem;
  box-shadow: none;
}

.user-details-premium {
  flex: 1;
}

.user-name-premium {
  color: var(--white-soft);
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.user-email-premium {
  color: rgba(245, 240, 230, 0.5);
  font-size: 0.75rem;
}

.user-role-premium {
  color: var(--gold-primary);
  font-size: 0.7rem;
  margin-top: 2px;
  font-weight: 500;
}

.dropdown-divider-premium {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  margin: 8px 0;
}

/* Dropdown Items */
.dropdown-item-premium {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(245, 240, 230, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  cursor: pointer;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  position: relative;
}

.dropdown-item-premium:hover {
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold-primary);
  padding-left: 24px;
}

.dropdown-item-premium svg {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.dropdown-item-premium:hover svg {
  transform: scale(1.1);
}

.item-badge-premium {
  margin-left: auto;
  background: rgba(212, 175, 55, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  color: var(--gold-primary);
}

/* Admin dropdown item */
.admin-dropdown-item {
  border-left: 3px solid var(--gold-primary);
  background: rgba(212, 175, 55, 0.05);
  position: relative;
}

.admin-badge-premium {
  margin-left: auto;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: bold;
}

.logout-btn-premium {
  color: #ff6b6b;
}

.logout-btn-premium:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.login-link-dropdown-premium {
  color: var(--gold-primary);
}

/* Responsividade */
@media (max-width: 1024px) {
  .nav-container-premium {
    gap: 16px;
    padding: 0.75rem 20px;
  }
  
  .nav-links-premium {
    display: none;
  }
}

@media (max-width: 768px) {
  .nav-container-premium {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
  }
  
  .back-btn-mobile {
    display: inline-flex;
    order: 0;
  }
  
  .logo-premium-nav {
    order: 1;
  }
  
  .nav-icons-premium {
    order: 2;
  }
  
  .search-container {
    order: 3;
    width: 100%;
  }
  
  .user-dropdown-premium {
    position: fixed;
    top: 70px;
    right: 16px;
    left: 16px;
    min-width: auto;
    max-width: calc(100vw - 32px);
  }
  
  .icon-btn-premium {
    width: 40px;
    height: 40px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .nav-container-premium {
    padding: 0.75rem 12px;
  }
  
  .back-btn-mobile {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
  
  .back-btn-mobile span {
    display: inline;
  }
  
  .logo-premium-nav h1 {
    font-size: 1.2rem;
  }
  
  .logo-ring-nav svg {
    width: 24px;
    height: 24px;
  }
  
  .icon-btn-premium {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 380px) {
  .back-btn-mobile span {
    display: none;
  }
  
  .back-btn-mobile {
    padding: 8px 10px;
  }
}
</style>