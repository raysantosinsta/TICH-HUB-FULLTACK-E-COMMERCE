<template>
  <nav class="navbar">
    <div class="container nav-container">
      <div class="logo">
        <h1 @click="goHome">ShopHub</h1>
      </div>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <!-- <router-link to="/products" class="nav-link">Produtos</router-link> -->
        <!-- <a href="#" class="nav-link">Categorias</a> -->
        <!-- <a href="#" class="nav-link">Contato</a> -->
      </div>
      
      <!-- Search Bar -->
      <SearchBar />
      
      <div class="nav-icons">
        <router-link to="/cart" class="icon-btn cart-btn" aria-label="Cart">
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useSearchStore } from '../stores/search'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const cartStore = useCartStore()
const searchStore = useSearchStore()

const cartTotalItems = computed(() => cartStore.totalItems)

const goHome = () => {
  router.push('/')
}

// Carregar histórico de buscas
searchStore.loadRecentSearches()
</script>

<style scoped>
/* Seus estilos existentes do Navbar... */
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
}

.icon-btn:hover {
  color: var(--gold-primary);
  transform: translateY(-2px);
  background: rgba(212, 175, 55, 0.1);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--gold-primary);
  color: var(--black-primary);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
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