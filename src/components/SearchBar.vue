<template>
  <div class="search-container" v-click-outside="closeDropdown">
    <div class="search-input-wrapper">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path 
          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round"
        />
      </svg>
      
      <input
        ref="searchInput"
        v-model="localSearchQuery"
        type="text"
        class="search-input"
        placeholder="Buscar produtos..."
        @input="handleInput"
        @focus="openDropdown"
        @keydown.enter="handleEnter"
        @keydown.escape="closeDropdown"
      />
      
      <button 
        v-if="localSearchQuery.trim()" 
        class="clear-btn"
        @click="clearSearch"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Dropdown de Resultados -->
    <div v-show="showDropdown" class="search-dropdown">
      <!-- Resultados da Busca -->
      <div v-if="localSearchQuery.trim()" class="search-results">
        <div class="dropdown-header">
          <span>Resultados ({{ filteredResults.length }})</span>
        </div>
        
        <div v-if="filteredResults.length > 0" class="results-list">
          <div 
            v-for="product in filteredResults.slice(0, 6)" 
            :key="product.id"
            class="result-item"
            @click="selectProduct(product)"
          >
            <div class="result-image">
              <img 
                :src="product.images?.[0] || 'https://placehold.co/600x400'" 
                :alt="product.title"
              >
            </div>
            <div class="result-info">
              <div class="result-title" v-html="highlightText(product.title)"></div>
              <div class="result-category">{{ getCategoryName(product.category) }}</div>
              <div class="result-price">
                R$ {{ product.price.toFixed(2).replace('.', ',') }}
              </div>
            </div>
          </div>
          
          <div class="view-all">
            <button @click="viewAllResults">
              Ver todos os {{ filteredResults.length }} resultados
            </button>
          </div>
        </div>
        
        <div v-else class="no-results">
          <p>Nenhum produto encontrado para "<strong>{{ localSearchQuery }}</strong>"</p>
        </div>
      </div>

      <!-- Buscas Recentes -->
      <div v-else-if="recentSearches.length > 0" class="recent-searches">
        <div class="dropdown-header">
          <span>Buscas recentes</span>
          <button class="clear-history" @click="clearHistory">Limpar</button>
        </div>
        <div class="recent-list">
          <div 
            v-for="search in recentSearches" 
            :key="search"
            class="recent-item"
            @click="useRecentSearch(search)"
          >
            {{ search }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useSearchStore } from '../stores/search'
import type { Product } from '../types'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const searchStore = useSearchStore()

const localSearchQuery = ref('')
const showDropdown = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

// Sincroniza com a URL ao montar
onMounted(async () => {
  const q = String(route.query.q || '')
  localSearchQuery.value = q
  searchStore.searchQuery = q
  searchStore.loadRecentSearches()

  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})

// Observa mudanças na URL
watch(() => route.query.q, (newQ) => {
  const val = String(newQ || '')
  if (val !== localSearchQuery.value) {
    localSearchQuery.value = val
    searchStore.searchQuery = val
  }
})

// Computed
const filteredResults = computed(() => {
  if (!localSearchQuery.value.trim()) return []
  return searchStore.getFilteredResults(productsStore.products)
})

const recentSearches = computed(() => searchStore.recentSearches)

// Helper seguro para categoria
const getCategoryName = (category: any): string => {
  if (!category) return 'Sem categoria'
  if (typeof category === 'string') return category
  return category.name || category.slug || 'Categoria'
}

// Métodos
const handleInput = () => {
  searchStore.searchQuery = localSearchQuery.value
  if (localSearchQuery.value.trim()) {
    showDropdown.value = true
  }
}

const handleEnter = () => {
  if (localSearchQuery.value.trim()) {
    viewAllResults()
  }
}

const viewAllResults = async () => {
  if (!localSearchQuery.value.trim()) return

  searchStore.addToRecentSearches(localSearchQuery.value)

  await router.push({
    path: '/search',
    query: { q: localSearchQuery.value }
  })

  closeDropdown()
}

const selectProduct = (product: Product) => {
  if (localSearchQuery.value.trim()) {
    searchStore.addToRecentSearches(localSearchQuery.value)
  }
  closeDropdown()
  router.push(`/product/${product.id}`)
}

const useRecentSearch = (search: string) => {
  localSearchQuery.value = search
  searchStore.searchQuery = search
  viewAllResults()
}

const clearSearch = () => {
  localSearchQuery.value = ''
  searchStore.searchQuery = ''
  if (route.query.q) {
    router.replace({ query: {} })
  }
  searchInput.value?.focus()
}

const openDropdown = () => {
  showDropdown.value = true
}

const closeDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const clearHistory = () => {
  searchStore.clearRecentSearches()
}

const highlightText = (text: string) => {
  if (!localSearchQuery.value) return text
  const regex = new RegExp(`(${localSearchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 320px;
  max-width: 100%;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(245, 240, 230, 0.5);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 46px;
  background: rgba(59, 58, 64, 0.4);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 50px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #D4AF37;
  background: rgba(59, 58, 64, 0.6);
  outline: none;
}

.clear-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(245, 240, 230, 0.6);
  cursor: pointer;
  padding: 4px;
}

.clear-btn:hover {
  color: #D4AF37;
}

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(11, 11, 15, 0.98);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  max-height: 420px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  font-size: 0.8rem;
  color: rgba(245, 240, 230, 0.6);
}

.result-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover {
  background: rgba(212, 175, 55, 0.1);
}

.result-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(59, 58, 64, 0.3);
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.result-info {
  flex: 1;
}

.result-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.result-title mark {
  background: rgba(212, 175, 55, 0.4);
  color: #D4AF37;
  padding: 0 3px;
  border-radius: 3px;
}

.result-category {
  font-size: 0.8rem;
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 4px;
}

.result-price {
  font-weight: 600;
  color: #D4AF37;
}

.view-all {
  padding: 12px 16px;
  text-align: center;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}

.view-all button {
  color: #D4AF37;
  background: none;
  border: none;
  cursor: pointer;
}

.recent-item {
  padding: 12px 16px;
  cursor: pointer;
}

.recent-item:hover {
  background: rgba(212, 175, 55, 0.1);
}

.clear-history {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 0.75rem;
  cursor: pointer;
}

.no-results {
  padding: 32px 16px;
  text-align: center;
  color: rgba(245, 240, 230, 0.7);
}
</style>