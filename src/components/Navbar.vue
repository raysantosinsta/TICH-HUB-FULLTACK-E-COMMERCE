<template>
  <nav class="navbar">
    <div class="container nav-container">
      <div class="logo">
        <h1 @click="goHome">ShopHub</h1>
      </div>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/products" class="nav-link">Produtos</router-link>
      </div>
      
      <!-- Search Bar -->
      <SearchBar />
      
      <div class="nav-icons">
        <!-- Ícone de Favoritos (só aparece se logado) -->
        <router-link 
          v-if="isAuthenticated"
          to="/favorites" 
          class="icon-btn favorites-btn" 
          aria-label="Favoritos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
          </svg>
          <span v-if="totalFavorites > 0" class="favorites-badge">{{ totalFavorites }}</span>
        </router-link>
        
        <!-- Ícone do Carrinho (só aparece se logado) -->
        <router-link 
          v-if="isAuthenticated"
          to="/cart" 
          class="icon-btn cart-btn" 
          aria-label="Carrinho"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <span v-if="cartTotalItems > 0" class="cart-badge">{{ cartTotalItems }}</span>
        </router-link>
        
        <!-- Ícone do Usuário com Dropdown (sempre visível) -->
        <div class="user-menu" v-click-outside="closeUserMenu">
          <button class="icon-btn user-btn" @click="toggleUserMenu" aria-label="Usuário">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          
          <transition name="dropdown">
            <div v-if="showUserMenu" class="user-dropdown">
              <div v-if="isAuthenticated" class="user-info">
                <div class="user-avatar">
                  {{ userInitials }}
                </div>
                <div class="user-details">
                  <p class="user-name">{{ user?.name }}</p>
                  <p class="user-email">{{ user?.email }}</p>
                  <p class="user-role" v-if="user?.role === 'admin'">Administrador</p>
                </div>
              </div>
              
              <div v-else class="user-info guest">
                <div class="user-avatar guest-avatar">
                  👤
                </div>
                <div class="user-details">
                  <p class="user-name">Visitante</p>
                  <p class="user-email">Faça login para mais recursos</p>
                </div>
              </div>
              
              <div class="dropdown-divider"></div>
              
              <router-link to="/profile" class="dropdown-item" v-if="isAuthenticated">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Meu Perfil
              </router-link>
              
              <router-link to="/orders" class="dropdown-item" v-if="isAuthenticated">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Meus Pedidos
              </router-link>
              
              <router-link to="/favorites" class="dropdown-item" v-if="isAuthenticated">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                </svg>
                Favoritos
                <span v-if="totalFavorites > 0" class="item-badge">{{ totalFavorites }}</span>
              </router-link>
              
              <router-link to="/cart" class="dropdown-item" v-if="isAuthenticated">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                </svg>
                Carrinho
                <span v-if="cartTotalItems > 0" class="item-badge">{{ cartTotalItems }}</span>
              </router-link>
              
              <div class="dropdown-divider"></div>
              
              <button v-if="isAuthenticated" class="dropdown-item logout-btn" @click="handleLogout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Sair
              </button>
              
              <router-link v-else to="/login" class="dropdown-item login-link-dropdown" @click="closeUserMenu">
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
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const toast = useToast()

const showUserMenu = ref(false)

// Computed properties
const cartTotalItems = computed(() => cartStore.totalItems)
const totalFavorites = computed(() => favoritesStore.totalFavorites)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const loading = computed(() => authStore.isLoading)

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
    // Usuário acabou de fazer login - carregar dados do usuário
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
  } else if (oldValue && !newValue) {
    // Usuário acabou de fazer logout - limpar dados locais
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
  // Carregar dados iniciais
  authStore.loadUser()
  
  // Se já estiver autenticado, carregar dados
  if (authStore.isAuthenticated) {
    favoritesStore.syncWithUser()
    cartStore.syncWithUser()
  }
})
</script>

<style scoped>
.navbar {
  background: rgba(11, 11, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20px;
  max-width: 1280px;
  margin: 0 auto;
  gap: 20px;
}

.logo h1 {
  color: var(--gold-primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo h1:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--white-soft);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--gold-primary);
}

.nav-icons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white-soft);
  position: relative;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-decoration: none;
}

.icon-btn:hover {
  color: var(--gold-primary);
  transform: translateY(-2px);
  background: rgba(212, 175, 55, 0.1);
}

.favorites-badge,
.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-btn {
  cursor: pointer;
}

.user-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  min-width: 280px;
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(212, 175, 55, 0.05);
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--black-primary);
}

.user-avatar.guest-avatar {
  background: rgba(59, 58, 64, 0.5);
  color: var(--white-soft);
  font-size: 1.5rem;
}

.user-details {
  flex: 1;
}

.user-name {
  color: var(--white-soft);
  font-weight: 600;
  margin-bottom: 4px;
}

.user-email {
  color: rgba(245, 240, 230, 0.5);
  font-size: 0.75rem;
}

.user-role {
  color: var(--gold-primary);
  font-size: 0.7rem;
  margin-top: 2px;
  font-weight: 500;
}

.dropdown-divider {
  height: 1px;
  background: rgba(212, 175, 55, 0.1);
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--white-soft);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  cursor: pointer;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold-primary);
}

.dropdown-item svg {
  flex-shrink: 0;
}

.item-badge {
  margin-left: auto;
  background: rgba(212, 175, 55, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  color: var(--gold-primary);
}

.logout-btn {
  color: #ff6b6b;
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.login-link-dropdown {
  color: var(--gold-primary);
}

@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
  }
  
  .nav-links {
    display: none;
  }
  
  .nav-icons {
    order: 2;
  }
  
  .search-container {
    order: 3;
    width: 100%;
  }
  
  .user-dropdown {
    position: fixed;
    top: 70px;
    right: 16px;
    left: 16px;
    min-width: auto;
  }
}
</style>