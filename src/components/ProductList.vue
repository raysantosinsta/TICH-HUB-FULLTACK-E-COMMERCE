<template>
  <div class="product-list-premium">
    <!-- Filtros Premium -->
    <div class="filters-premium">
      <div class="filters-header">
        <div class="filters-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Categorias</span>
        </div>
        <div class="filters-buttons">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="filterByCategory(cat)"
            :class="{ active: selectedCategory === cat }"
            class="filter-btn-premium"
          >
            <span class="btn-glow"></span>
            <span class="btn-content">{{ formatCategoryName(cat) }}</span>
          </button>
          <button 
            @click="clearFilter"
            class="filter-btn-premium clear-btn"
            v-if="selectedCategory"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Limpar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Premium -->
    <div v-if="loading" class="loading-premium">
      <div class="spinner-premium">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">Carregando produtos exclusivos...</p>
    </div>

    <!-- Error Premium -->
    <div v-else-if="error" class="error-premium">
      <div class="error-icon">⚠️</div>
      <h3>Ops! Algo deu errado</h3>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn-premium">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C14.4 4 16.5 5.1 18 6.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M15 9H20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Tentar Novamente
      </button>
    </div>

    <!-- Listagem de Produtos Premium -->
    <div v-else class="products-grid-premium">
      <transition-group name="product-premium" tag="div" class="products-grid-inner">
        <ProductCard 
          v-for="product in products" 
          :key="product.id"
          :product="product"
          @view="goToProduct"
        />
      </transition-group>
    </div>

    <!-- Mensagem quando não há produtos -->
    <div v-if="!loading && products.length === 0" class="empty-premium">
      <div class="empty-icon">🔍</div>
      <h3>Nenhum produto encontrado</h3>
      <p>Não encontramos produtos nesta categoria. Tente outro filtro.</p>
      <button @click="clearFilter" class="empty-btn-premium">
        Ver todos os produtos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useToast } from '../plugins/toast'
import ProductCard from './ProductCard.vue'
import type { Product } from '../types'

const router = useRouter()
const store = useProductsStore()
const toast = useToast()

const products = computed(() => store.products)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const categories = computed(() => store.categories)
const selectedCategory = computed(() => store.selectedCategory)

const formatCategoryName = (category: string) => {
  const names: Record<string, string> = {
    "men's clothing": "Masculino",
    "women's clothing": "Feminino",
    "jewelery": "Jóias",
    "electronics": "Eletrônicos"
  }
  return names[category] || category
}

const filterByCategory = async (category: string) => {
  await store.fetchProductsByCategory(category)
  toast.info(
    'Filtro aplicado', 
    `Mostrando produtos de ${formatCategoryName(category)}`,
    2000
  )
}

const clearFilter = async () => {
  await store.fetchProducts()
  toast.info('Filtro removido', 'Mostrando todos os produtos', 2000)
}

const retry = () => {
  store.fetchProducts()
  toast.info('Recarregando', 'Tentando carregar os produtos novamente...', 2000)
}

const goToProduct = (product: Product) => {
  router.push(`/product/${product.id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  store.fetchProducts()
})
</script>

<style scoped>
/* ========== PRODUCT LIST PREMIUM ========== */
.product-list-premium {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 32px;
  min-height: 500px;
}

/* Filtros Premium */
.filters-premium {
  margin-bottom: 48px;
  background: rgba(11, 11, 15, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 60px;
  padding: 8px 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.filters-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--gold-primary);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 0;
}

.filters-title svg {
  animation: pulseTitle 2s ease-in-out infinite;
}

@keyframes pulseTitle {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.filters-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn-premium {
  position: relative;
  padding: 10px 28px;
  background: transparent;
  border: 1.5px solid rgba(212, 175, 55, 0.3);
  color: rgba(245, 240, 230, 0.8);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-weight: 500;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
  transition: left 0.5s ease;
}

.filter-btn-premium:hover .btn-glow {
  left: 100%;
}

.filter-btn-premium:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.filter-btn-premium.active {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.filter-btn-premium.active .btn-glow {
  display: none;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.clear-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

/* Loading Premium */
.loading-premium {
  text-align: center;
  padding: 80px 20px;
}

.spinner-premium {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spinRing 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: var(--gold-primary);
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  border-right-color: var(--gold-primary);
  animation-delay: 0.3s;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: var(--gold-primary);
  animation-delay: 0.6s;
}

@keyframes spinRing {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  animation: pulseText 1.5s ease-in-out infinite;
}

@keyframes pulseText {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Error Premium */
.error-premium {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 107, 107, 0.05);
  border-radius: 40px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  max-width: 500px;
  margin: 0 auto;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  animation: shakeError 0.5s ease;
}

@keyframes shakeError {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-premium h3 {
  color: var(--white-soft);
  margin-bottom: 12px;
  font-size: 1.3rem;
}

.error-premium p {
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 24px;
}

.retry-btn-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.retry-btn-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
}

/* Products Grid Premium */
.products-grid-premium {
  animation: fadeInGrid 0.6s ease;
}

@keyframes fadeInGrid {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.products-grid-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

/* Transições para produtos */
.product-premium-enter-active,
.product-premium-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-premium-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.product-premium-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.product-premium-move {
  transition: transform 0.4s ease;
}

/* Empty State Premium */
.empty-premium {
  text-align: center;
  padding: 80px 20px;
  background: rgba(11, 11, 15, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.6;
  animation: floatEmpty 3s ease-in-out infinite;
}

@keyframes floatEmpty {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-premium h3 {
  color: var(--white-soft);
  margin-bottom: 12px;
  font-size: 1.3rem;
}

.empty-premium p {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 24px;
}

.empty-btn-premium {
  padding: 12px 32px;
  background: transparent;
  border: 2px solid var(--gold-primary);
  color: var(--gold-primary);
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.empty-btn-premium:hover {
  background: var(--gold-primary);
  color: var(--black-primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

/* Responsividade Premium */
@media (max-width: 1200px) {
  .product-list-premium {
    padding: 32px 24px;
  }
  
  .products-grid-inner {
    gap: 24px;
  }
}

@media (max-width: 1024px) {
  .filters-premium {
    border-radius: 40px;
    padding: 8px 16px;
  }
  
  .filters-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filters-title {
    justify-content: center;
  }
  
  .filters-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .product-list-premium {
    padding: 24px 16px;
  }
  
  .filters-premium {
    border-radius: 32px;
    padding: 12px 16px;
  }
  
  .filters-buttons {
    gap: 8px;
  }
  
  .filter-btn-premium {
    padding: 8px 20px;
    font-size: 0.8rem;
  }
  
  .products-grid-inner {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }
  
  .loading-premium {
    padding: 60px 20px;
  }
  
  .spinner-premium {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .product-list-premium {
    padding: 20px 12px;
  }
  
  .filters-premium {
    border-radius: 24px;
    padding: 12px;
  }
  
  .filter-btn-premium {
    padding: 6px 16px;
    font-size: 0.75rem;
  }
  
  .clear-btn {
    padding: 6px 14px;
  }
  
  .products-grid-inner {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .error-premium,
  .empty-premium {
    padding: 60px 20px;
    margin: 0 16px;
  }
  
  .error-premium h3,
  .empty-premium h3 {
    font-size: 1.1rem;
  }
  
  .loading-text {
    font-size: 0.85rem;
  }
}

/* Scrollbar refinada para a lista */
.products-grid-inner {
  scrollbar-width: thin;
  scrollbar-color: var(--gold-primary) rgba(212, 175, 55, 0.2);
}

.products-grid-inner::-webkit-scrollbar {
  width: 8px;
}

.products-grid-inner::-webkit-scrollbar-track {
  background: rgba(212, 175, 55, 0.1);
  border-radius: 4px;
}

.products-grid-inner::-webkit-scrollbar-thumb {
  background: var(--gold-primary);
  border-radius: 4px;
}

.products-grid-inner::-webkit-scrollbar-thumb:hover {
  background: #e6bc3e;
}
</style>