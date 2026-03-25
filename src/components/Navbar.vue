<template>
  <nav class="navbar">
    <div class="container nav-container">
      <div class="logo">
        <h1 @click="goHome">ShopHub</h1>
      </div>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/products" class="nav-link">Produtos</router-link>
        <a href="#" class="nav-link">Categorias</a>
        <a href="#" class="nav-link">Contato</a>
      </div>
      
      <!-- Search Bar -->
      <SearchBar />
      
      <div class="nav-icons">
        <!-- Ícone de Favoritos -->
        <router-link to="/favorites" class="icon-btn favorites-btn" aria-label="Favoritos">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
          </svg>
          <span v-if="totalFavorites > 0" class="favorites-badge">{{ totalFavorites }}</span>
        </router-link>
        
        <!-- Ícone do Carrinho -->
        <router-link to="/cart" class="icon-btn cart-btn" aria-label="Carrinho">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <span v-if="cartTotalItems > 0" class="cart-badge">{{ cartTotalItems }}</span>
        </router-link>
        
        <button class="icon-btn" aria-label="User">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const cartTotalItems = computed(() => cartStore.totalItems)
const totalFavorites = computed(() => favoritesStore.totalFavorites)

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  favoritesStore.loadFavorites()
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

.favorites-btn .favorites-badge {
  background: #ff6b6b;
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
}
</style>