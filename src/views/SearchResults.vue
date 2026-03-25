<template>
  <div class="search-results-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">
          Resultados para: 
          <span class="search-term">"{{ searchQuery }}"</span>
        </h1>
        <p class="results-count">{{ totalResults }} produto(s) encontrado(s)</p>
      </div>

      <!-- Filtros -->
      <div class="filters-bar">
        <div class="category-filters">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="filterByCategory(cat)"
            :class="{ active: selectedCategory === cat }"
            class="filter-chip"
          >
            {{ formatCategoryName(cat) }}
          </button>
          <button 
            v-if="selectedCategory"
            @click="clearCategoryFilter"
            class="filter-chip clear"
          >
            Limpar filtro
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

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Buscando produtos...</p>
      </div>

      <!-- Resultados -->
      <div v-else-if="results.length > 0" class="results-grid">
        <ProductCard 
          v-for="product in results" 
          :key="product.id"
          :product="product"
          @view="goToProduct"
        />
      </div>

      <!-- Sem resultados -->
      <div v-else class="no-results">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h2>Nenhum produto encontrado</h2>
        <p>Tente usar palavras diferentes ou verifique a ortografia</p>
        <router-link to="/" class="back-home">Ver todos os produtos</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useSearchStore } from '../stores/search'
import ProductCard from '../components/ProductCard.vue'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const searchStore = useSearchStore()

const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance')

const categories = computed(() => productsStore.categories)

const results = computed(() => {
  let results = searchStore.getFilteredResults(productsStore.products)
  
  // Aplicar ordenação
  const sorted = [...results]
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

const totalResults = computed(() => results.value.length)

const formatCategoryName = (category: string) => {
  const names: Record<string, string> = {
    "men's clothing": "Masculino",
    "women's clothing": "Feminino",
    "jewelery": "Jóias",
    "electronics": "Eletrônicos"
  }
  return names[category] || category
}

const filterByCategory = (category: string) => {
  selectedCategory.value = category
  searchStore.selectedCategory = category
  updateSearchInUrl()
}

const clearCategoryFilter = () => {
  selectedCategory.value = ''
  searchStore.selectedCategory = ''
  updateSearchInUrl()
}

const updateSearchInUrl = () => {
  const params: any = { q: searchQuery.value }
  if (selectedCategory.value) {
    params.category = selectedCategory.value
  }
  router.replace({ query: params })
}

const goToProduct = (product: Product) => {
  router.push(`/product/${product.id}`)
}

// Watch para ordenação
watch(sortBy, (newVal) => {
  searchStore.sortBy = newVal
})

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  
  searchQuery.value = route.query.q as string || ''
  selectedCategory.value = route.query.category as string || ''
  
  searchStore.searchQuery = searchQuery.value
  searchStore.selectedCategory = selectedCategory.value
  
  if (searchQuery.value) {
    searchStore.addToRecentSearches(searchQuery.value)
  }
  
  loading.value = false
})
</script>

<style scoped>
.search-results-page {
  position: relative;
  min-height: 100vh;
  padding: 40px 0 80px;
}

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

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  color: var(--white-soft);
  margin-bottom: 12px;
}

.search-term {
  color: var(--gold-primary);
}

.results-count {
  color: rgba(245, 240, 230, 0.6);
  font-size: 1rem;
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
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
}

.filter-chip.active {
  background: var(--gold-primary);
  color: var(--black-primary);
  border-color: var(--gold-primary);
}

.filter-chip.clear {
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--gold-primary);
  color: var(--gold-primary);
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

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.loading {
  text-align: center;
  padding: 60px;
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

.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results svg {
  color: rgba(245, 240, 230, 0.3);
  margin-bottom: 24px;
}

.no-results h2 {
  color: var(--white-soft);
  margin-bottom: 12px;
}

.no-results p {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 24px;
}

.back-home {
  display: inline-block;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

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
  
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}
</style>