<template>
  <div class="products-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <!-- Header da Página -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="products-count">{{ filteredProducts.length }} produto(s) encontrado(s)</p>
        </div>
        
        <!-- Filtros e Ordenação -->
        <div class="filters-bar">
          <div class="category-filters">
            <button 
              @click="clearCategoryFilter"
              class="filter-chip"
              :class="{ active: !selectedCategory }"
            >
              Todos
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="setCategoryFilter(cat)"
              class="filter-chip"
              :class="{ active: selectedCategory === cat }"
            >
              {{ formatCategoryName(cat) }}
            </button>
          </div>
          
          <div class="sort-filters">
            <select v-model="sortBy" class="sort-select">
              <option value="relevance">Mais relevantes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="rating">Melhor avaliação</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando produtos...</p>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <ProductCard 
          v-for="product in paginatedProducts" 
          :key="product.id"
          :product="product"
          @view="goToProduct"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h2>Nenhum produto encontrado</h2>
        <p>Tente usar outros filtros ou verifique a categoria selecionada.</p>
        <button @click="clearAllFilters" class="clear-filters-btn">
          Limpar todos os filtros
        </button>
      </div>

      <!-- Paginação -->
      <div v-if="filteredProducts.length > 0" class="pagination">
        <button 
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
    "jewelery": "Jóias",
    "electronics": "Eletrônicos"
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
.products-page {
  position: relative;
  min-height: 100vh;
  padding: 40px 0 80px;
}

/* Background Premium */
.bg-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
}

.light-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.1) 40%,
    rgba(212, 175, 55, 0.15) 45%,
    rgba(212, 175, 55, 0.2) 50%,
    rgba(212, 175, 55, 0.15) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweep 15s ease-in-out infinite;
}

@keyframes lightSweep {
  0% { background-position: -100% 0%; opacity: 0; }
  20% { opacity: 0.5; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  100% { background-position: 200% 0%; opacity: 0; }
}

.glass-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(2px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* Page Header */
.page-header {
  margin-bottom: 40px;
}

.header-content {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 2rem;
  color: var(--white-soft);
  margin-bottom: 8px;
}

.products-count {
  color: rgba(245, 240, 230, 0.6);
  font-size: 1rem;
}

/* Filters Bar */
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.category-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--white-soft);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.filter-chip:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.filter-chip.active {
  background: var(--gold-primary);
  color: var(--black-primary);
  border-color: var(--gold-primary);
}

.sort-select {
  padding: 8px 16px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 30px;
  color: var(--white-soft);
  cursor: pointer;
  font-size: 0.85rem;
}

.sort-select:focus {
  outline: none;
  border-color: var(--gold-primary);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: var(--gold-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--white-soft);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state svg {
  color: rgba(245, 240, 230, 0.3);
  margin-bottom: 24px;
}

.empty-state h2 {
  color: var(--white-soft);
  margin-bottom: 12px;
}

.empty-state p {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 24px;
}

.clear-filters-btn {
  padding: 10px 24px;
  background: var(--gold-primary);
  color: var(--black-primary);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white-soft);
}

.page-btn:hover:not(:disabled) {
  background: var(--gold-primary);
  color: var(--black-primary);
  border-color: var(--gold-primary);
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--white-soft);
}

.page-number:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.page-number.active {
  background: var(--gold-primary);
  color: var(--black-primary);
  border-color: var(--gold-primary);
}

/* Responsividade */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-filters {
    justify-content: center;
  }
  
  .sort-select {
    width: 100%;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .pagination {
    gap: 8px;
  }
  
  .page-btn, .page-number {
    width: 35px;
    height: 35px;
  }
}
</style>