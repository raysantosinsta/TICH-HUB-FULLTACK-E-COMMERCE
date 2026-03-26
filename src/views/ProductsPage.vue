<template>
  <div class="products-page-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="product-particles">
        <div v-for="i in 50" :key="i" class="product-particle" :style="getParticleStyle(i)">
          ✨
        </div>
      </div>
    </div>

    <div class="container-premium">
      <!-- Header da Página Premium -->
      <div class="page-header-premium">
        <div class="header-content-premium">
          <div class="title-wrapper-premium">
            <div class="title-icon-premium">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <div class="icon-glow"></div>
            </div>
            <h1 class="page-title-premium">{{ pageTitle }}</h1>
          </div>
          <div class="products-count-premium">
            <span class="count-badge">{{ filteredProducts.length }}</span>
            <span class="count-text">{{ filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados' }}</span>
          </div>
        </div>
        
        <!-- Filtros e Ordenação Premium -->
        <div class="filters-bar-premium">
          <div class="category-filters-premium">
            <button 
              @click="clearCategoryFilter"
              class="filter-chip-premium"
              :class="{ active: !selectedCategory }"
            >
              <span class="chip-glow"></span>
              <span class="chip-content">Todos</span>
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="setCategoryFilter(cat)"
              class="filter-chip-premium"
              :class="{ active: selectedCategory === cat }"
            >
              <span class="chip-glow"></span>
              <span class="chip-content">{{ formatCategoryName(cat) }}</span>
            </button>
          </div>
          
          <div class="sort-filters-premium">
            <div class="sort-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <select v-model="sortBy" class="sort-select-premium">
                <option value="relevance">Mais relevantes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State Premium -->
      <div v-if="loading" class="loading-state-premium">
        <div class="loading-grid">
          <div class="loading-card" v-for="i in 6" :key="i">
            <div class="loading-image shimmer"></div>
            <div class="loading-content">
              <div class="loading-line shimmer"></div>
              <div class="loading-line short shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid Premium -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid-premium">
        <transition-group name="product-grid" tag="div" class="products-grid-inner">
          <ProductCard 
            v-for="product in paginatedProducts" 
            :key="product.id"
            :product="product"
            @view="goToProduct"
          />
        </transition-group>
      </div>

      <!-- Empty State Premium -->
      <div v-else class="empty-state-premium">
        <div class="empty-card-premium">
          <div class="empty-animation">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <div class="floating-icons">
              <span>🔍</span>
              <span>📦</span>
              <span>✨</span>
            </div>
          </div>
          <h2 class="empty-title">Nenhum produto encontrado</h2>
          <p class="empty-description">Não encontramos produtos com os filtros selecionados. Tente ajustar sua busca ou explorar outras categorias.</p>
          <button @click="clearAllFilters" class="clear-filters-premium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Limpar todos os filtros
          </button>
        </div>
      </div>

      <!-- Paginação Premium -->
      <div v-if="filteredProducts.length > 0 && totalPages > 1" class="pagination-premium">
        <button 
          class="page-btn-premium"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="page-numbers-premium">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="page-number-premium"
            :class="{ active: currentPage === page, dots: page === '...' }"
            @click="page !== '...' && (currentPage = page)"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="page-btn-premium"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

// Estado
const loading = ref(true)
const sortBy = ref<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance')
const currentPage = ref(1)
const itemsPerPage = 12

// Partículas
const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${10 + Math.random() * 15}s`,
    opacity: 0.1 + Math.random() * 0.3
  }
}

// Obter categoria da URL
const selectedCategory = computed(() => {
  return route.query.category as string || ''
})

// Categorias disponíveis
const categories = computed(() => store.categories)

// Produtos filtrados
const filteredProducts = computed(() => {
  let products = store.products

  // Filtrar por categoria
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  // Ordenar
  const sorted = [...products]
  switch (sortBy.value) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate)
    default:
      return sorted
  }
})

// Paginação
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Páginas visíveis para paginação inteligente
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})

// Título da página
const pageTitle = computed(() => {
  if (!selectedCategory.value) return 'Todos os Produtos'
  const categoryName = formatCategoryName(selectedCategory.value)
  return categoryName
})

// Formatar nome da categoria
const formatCategoryName = (category: string) => {
  const names: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    "jewelery": "Jóias Exclusivas",
    "electronics": "Tecnologia Premium"
  }
  return names[category] || category
}

// Ações
const setCategoryFilter = (category: string) => {
  router.push({ query: { category } })
  currentPage.value = 1
}

const clearCategoryFilter = () => {
  router.push({ query: {} })
  currentPage.value = 1
}

const clearAllFilters = () => {
  router.push({ query: {} })
  sortBy.value = 'relevance'
  currentPage.value = 1
}

const goToProduct = (product: Product) => {
  router.push(`/product/${product.id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch para mudanças na URL
watch(() => route.query.category, () => {
  currentPage.value = 1
})

// Watch para ordenação
watch(sortBy, () => {
  currentPage.value = 1
})

// Carregar produtos
onMounted(async () => {
  if (store.products.length === 0) {
    await store.fetchProducts()
  }
  loading.value = false
})
</script>

<style scoped>
/* ========== PRODUCTS PAGE PREMIUM ========== */
.products-page-premium {
  position: relative;
  min-height: 100vh;
  padding: 60px 0 100px;
  overflow-x: hidden;
}

/* Background Premium */
.bg-premium-advanced {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
  overflow: hidden;
}

.bg-gradient-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0B0B0F 0%, #13131A 100%);
  animation: gradientPulseProducts 8s ease-in-out infinite;
}

@keyframes gradientPulseProducts {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.light-sweep-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.12) 40%,
    rgba(212, 175, 55, 0.18) 45%,
    rgba(212, 175, 55, 0.22) 50%,
    rgba(212, 175, 55, 0.18) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweepProducts 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepProducts {
  0% { background-position: -100% 0%; opacity: 0; }
  20% { opacity: 0.5; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  100% { background-position: 200% 0%; opacity: 0; }
}

.glass-overlay-advanced {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.55);
  backdrop-filter: blur(2px);
}

.product-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.product-particle {
  position: absolute;
  font-size: 12px;
  animation: floatParticleProducts linear infinite;
  opacity: 0;
}

@keyframes floatParticleProducts {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Container Premium */
.container-premium {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}

/* Page Header Premium */
.page-header-premium {
  margin-bottom: 48px;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content-premium {
  text-align: center;
  margin-bottom: 32px;
}

.title-wrapper-premium {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.title-icon-premium {
  position: relative;
  color: var(--gold-primary);
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
  animation: iconPulseProducts 1.5s ease-in-out infinite;
}

@keyframes iconPulseProducts {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: iconGlowProducts 2s ease-in-out infinite;
}

@keyframes iconGlowProducts {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.page-title-premium {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.products-count-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.count-badge {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 2px 10px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: bold;
}

.count-text {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.9rem;
}

/* Filters Bar Premium */
.filters-bar-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 0;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.category-filters-premium {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-chip-premium {
  position: relative;
  padding: 8px 24px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: rgba(245, 240, 230, 0.8);
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-weight: 500;
  overflow: hidden;
}

.chip-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.filter-chip-premium:hover .chip-glow {
  left: 100%;
}

.filter-chip-premium:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.filter-chip-premium.active {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.filter-chip-premium.active .chip-glow {
  display: none;
}

/* Sort Filters */
.sort-filters-premium {
  position: relative;
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 40px;
  padding: 6px 16px;
  transition: all 0.3s ease;
}

.sort-wrapper:focus-within {
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
}

.sort-wrapper svg {
  color: var(--gold-primary);
}

.sort-select-premium {
  background: transparent;
  border: none;
  color: var(--white-soft);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 6px 0;
  outline: none;
}

.sort-select-premium option {
  background: var(--black-primary);
  color: var(--white-soft);
}

/* Loading State Premium */
.loading-state-premium {
  padding: 40px 0;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.loading-card {
  background: rgba(59, 58, 64, 0.2);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.loading-image {
  height: 220px;
  background: rgba(59, 58, 64, 0.3);
}

.loading-content {
  padding: 20px;
}

.loading-line {
  height: 20px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 8px;
  margin-bottom: 12px;
}

.loading-line.short {
  width: 60%;
}

.shimmer {
  background: linear-gradient(90deg, rgba(59, 58, 64, 0.3) 25%, rgba(212, 175, 55, 0.1) 50%, rgba(59, 58, 64, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Products Grid Premium */
.products-grid-premium {
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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

/* Product Grid Transition */
.product-grid-move,
.product-grid-enter-active,
.product-grid-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-grid-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.product-grid-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.product-grid-leave-active {
  position: absolute;
}

/* Empty State Premium */
.empty-state-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.empty-card-premium {
  max-width: 500px;
  width: 100%;
  padding: 48px 40px;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  text-align: center;
  animation: fadeInUp 0.6s ease;
  transition: all 0.3s ease;
}

.empty-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.empty-animation {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}

.empty-animation svg {
  color: rgba(245, 240, 230, 0.2);
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

.floating-icons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-icons span {
  position: absolute;
  font-size: 20px;
  animation: floatIcon 2s ease-in-out infinite;
}

.floating-icons span:nth-child(1) {
  top: -20px;
  left: 0;
  animation-delay: 0s;
}

.floating-icons span:nth-child(2) {
  top: -30px;
  right: 0;
  animation-delay: 0.3s;
}

.floating-icons span:nth-child(3) {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.6s;
}

@keyframes floatIcon {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
}

.empty-title {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.empty-description {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 32px;
  line-height: 1.6;
}

.clear-filters-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.clear-filters-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Pagination Premium */
.pagination-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}

.page-btn-premium {
  width: 44px;
  height: 44px;
  background: rgba(59, 58, 64, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white-soft);
}

.page-btn-premium:hover:not(:disabled) {
  background: var(--gold-primary);
  color: var(--black-primary);
  border-color: var(--gold-primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.page-btn-premium:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.page-numbers-premium {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-number-premium {
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(245, 240, 230, 0.7);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number-premium:hover:not(.dots):not(:disabled) {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.page-number-premium.active {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.page-number-premium.dots {
  cursor: default;
  border-color: transparent;
  background: transparent;
}

.page-number-premium.dots:hover {
  transform: none;
  color: rgba(245, 240, 230, 0.5);
}

/* Responsividade Premium */
@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }
  
  .page-title-premium {
    font-size: 2rem;
  }
  
  .products-grid-inner {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .products-page-premium {
    padding: 40px 0 60px;
  }
  
  .container-premium {
    padding: 0 16px;
  }
  
  .page-title-premium {
    font-size: 1.6rem;
  }
  
  .title-wrapper-premium {
    gap: 12px;
  }
  
  .title-icon-premium svg {
    width: 32px;
    height: 32px;
  }
  
  .filters-bar-premium {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-filters-premium {
    justify-content: center;
  }
  
  .sort-filters-premium {
    width: 100%;
  }
  
  .sort-wrapper {
    width: 100%;
    justify-content: center;
  }
  
  .sort-select-premium {
    width: auto;
  }
  
  .products-grid-inner {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }
  
  .pagination-premium {
    gap: 12px;
  }
  
  .page-btn-premium,
  .page-number-premium {
    width: 38px;
    height: 38px;
  }
  
  .empty-card-premium {
    padding: 40px 24px;
  }
  
  .empty-title {
    font-size: 1.3rem;
  }
  
  .empty-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title-premium {
    font-size: 1.3rem;
  }
  
  .products-count-premium {
    font-size: 0.8rem;
    padding: 6px 16px;
  }
  
  .filter-chip-premium {
    padding: 6px 18px;
    font-size: 0.75rem;
  }
  
  .products-grid-inner {
    grid-template-columns: 1fr;
  }
  
  .pagination-premium {
    gap: 8px;
  }
  
  .page-btn-premium,
  .page-number-premium {
    width: 34px;
    height: 34px;
    font-size: 0.85rem;
  }
  
  .empty-card-premium {
    padding: 32px 20px;
  }
  
  .empty-title {
    font-size: 1.1rem;
  }
}
</style>