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
      
      <div class="nav-icons">
        <button class="icon-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <router-link to="/cart" class="icon-btn cart-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <span v-if="cartTotalItems > 0" class="cart-badge">{{ cartTotalItems }}</span>
        </router-link>
        
        <button class="icon-btn" aria-label="User">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const router = useRouter()
const cartStore = useCartStore()

const cartTotalItems = computed(() => cartStore.totalItems)

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* ========== VARIÁVEIS DE COR ========== */
:root {
  --black-primary: #0B0B0F;
  --gold-primary: #D4AF37;
  --white-soft: #F5F0E6;
  --gray-dark: #3B3A40;
}

.navbar {
  background: rgba(11, 11, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20px;
  max-width: 1280px;
  margin: 0 auto;
}

/* Logo */
.logo h1 {
  color: var(--gold-primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.logo h1:hover {
  transform: scale(1.05);
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

/* Links de Navegação */
.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--white-soft);
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--gold-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: var(--gold-primary);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 80%;
}

.nav-link.router-link-active {
  color: var(--gold-primary);
}

/* Ícones */
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

/* Botão do Carrinho */
.cart-btn {
  position: relative;
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
  animation: bounce 0.5s ease;
}

/* Menu Mobile (Hamburger) */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--white-soft);
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  color: var(--gold-primary);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  z-index: 1001;
  transition: right 0.3s ease;
  padding: 80px 24px 24px;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
  border-left: 1px solid rgba(212, 175, 55, 0.2);
}

.mobile-menu.open {
  right: 0;
}

.mobile-menu .mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mobile-menu .mobile-nav-link {
  color: var(--white-soft);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 8px 0;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.mobile-menu .mobile-nav-link:hover,
.mobile-menu .mobile-nav-link.router-link-active {
  color: var(--gold-primary);
  padding-left: 12px;
}

.close-menu {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--white-soft);
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s ease;
}

.close-menu:hover {
  color: var(--gold-primary);
  transform: rotate(90deg);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;
}

.overlay.open {
  display: block;
}

/* Animações */
@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .nav-icons {
    gap: 0.5rem;
  }
  
  .icon-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.8rem 16px;
  }
  
  .logo h1 {
    font-size: 1.2rem;
  }
  
  .icon-btn {
    width: 32px;
    height: 32px;
  }
  
  .icon-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.65rem;
    top: -3px;
    right: -3px;
  }
}
</style>