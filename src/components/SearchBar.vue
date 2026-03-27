<template>
  <div class="search-container" v-click-outside="closeDropdown">
    <div class="search-input-wrapper">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      
      <input
        ref="searchInput"
        v-model="localSearchQuery"
        type="text"
        class="search-input"
        placeholder="Buscar produtos..."
        @input="handleInput"
        @focus="openDropdown"
        @keydown.escape="closeDropdown"
        @keydown.enter="handleEnter"
      />
      
      <button 
        v-if="localSearchQuery" 
        class="clear-btn"
        @click="clearSearch"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Dropdown de Resultados -->
    <div v-show="showDropdown && (filteredResults.length > 0 || recentSearches.length > 0 || localSearchQuery)" class="search-dropdown">
      <!-- Resultados da Busca -->
      <div v-if="localSearchQuery" class="search-results">
        <div class="dropdown-header">
          <span>Resultados ({{ filteredResults.length }})</span>
          <span v-if="filteredResults.length > 0" class="results-count">produtos encontrados</span>
        </div>
        
        <div v-if="filteredResults.length > 0" class="results-list">
          <div 
            v-for="product in filteredResults.slice(0, 5)" 
            :key="product.id"
            class="result-item"
            @click="selectProduct(product)"
          >
            <div class="result-image">
              <img :src="product.image" :alt="product.title">
            </div>
            <div class="result-info">
              <div class="result-title" v-html="highlightText(product.title)"></div>
              <div class="result-category">{{ formatCategory(product.category) }}</div>
              <div class="result-price">R$ {{ formatPrice(product.price) }}</div>
            </div>
          </div>
          
          <div v-if="filteredResults.length > 5" class="view-all">
            <button @click="viewAllResults">
              Ver todos os {{ filteredResults.length }} resultados
            </button>
          </div>
        </div>
        
        <div v-else class="no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <p>Nenhum produto encontrado</p>
          <span>Tente usar palavras diferentes</span>
        </div>
      </div>

      <!-- Histórico de Buscas -->
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>{{ search }}</span>
          </div>
        </div>
      </div>

      <!-- Sugestões Populares -->
      <div v-else class="popular-searches">
        <div class="dropdown-header">
          <span>Produtos em destaque</span>
        </div>
        <div class="popular-list">
          <div 
            v-for="product in featuredProducts" 
            :key="product.id"
            class="popular-item"
            @click="selectProduct(product)"
          >
            <div class="popular-image">
              <img :src="product.image" :alt="product.title">
            </div>
            <div class="popular-info">
              <span class="popular-title">{{ truncateTitle(product.title, 40) }}</span>
              <span class="popular-price">R$ {{ formatPrice(product.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
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
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Sync with route on mount
onMounted(() => {
  const queryParam = route.query.q as string
  if (queryParam) {
    localSearchQuery.value = queryParam
    searchStore.searchQuery = queryParam
  }
})

// Watch for route changes
watch(
  () => route.query.q,
  (newQuery) => {
    const newQueryValue = (newQuery as string) || ''
    if (newQueryValue !== localSearchQuery.value) {
      localSearchQuery.value = newQueryValue
      searchStore.searchQuery = newQueryValue
    }
  }
)

const filteredResults = computed(() => {
  if (!localSearchQuery.value.trim()) return []
  const results = searchStore.getFilteredResults(productsStore.products)
  return results
})

const recentSearches = computed(() => searchStore.recentSearches)
const featuredProducts = computed(() => productsStore.products.slice(0, 3))

const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',')
}

const formatCategory = (category: string) => {
  const categories: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    "jewelery": "Jóias",
    "electronics": "Eletrônicos"
  }
  return categories[category] || category
}

const truncateTitle = (title: string, length: number) => {
  if (title.length > length) {
    return title.substring(0, length - 3) + '...'
  }
  return title
}

const highlightText = (text: string) => {
  if (!localSearchQuery.value) return text
  
  const regex = new RegExp(`(${localSearchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// No handleInput, quando estiver na página de busca
const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  debounceTimer = setTimeout(() => {
    searchStore.searchQuery = localSearchQuery.value
    
    // Se estiver na página de busca, atualiza a URL
    if (route.path === '/search') {
      const params: any = {}
      if (localSearchQuery.value.trim()) {
        params.q = localSearchQuery.value
      }
      if (route.query.category) {
        params.category = route.query.category
      }
      // Usar replace para não criar histórico desnecessário
      router.replace({ query: params })
    }
    
    if (localSearchQuery.value.trim()) {
      showDropdown.value = true
    }
  }, 300)
}

const handleEnter = () => {
  if (localSearchQuery.value.trim()) {
    viewAllResults()
  }
}

const openDropdown = () => {
  showDropdown.value = true
}

const closeDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const clearSearch = () => {
  localSearchQuery.value = ''
  searchStore.searchQuery = ''
  searchInput.value?.focus()
  
  // Limpar a URL
  if (route.query.q) {
    router.push({ query: {} })
  }
}

const selectProduct = (product: Product) => {
  if (localSearchQuery.value.trim()) {
    searchStore.addToRecentSearches(localSearchQuery.value)
  }
  closeDropdown()
  router.push(`/product/${product.id}`)
}

const viewAllResults = () => {
  if (localSearchQuery.value.trim()) {
    searchStore.addToRecentSearches(localSearchQuery.value)
    // IMPORTANTE: Usar push para navegar para a página de busca
    router.push({
      path: '/search',
      query: { q: localSearchQuery.value }
    })
    closeDropdown()
  }
}

const useRecentSearch = (search: string) => {
  localSearchQuery.value = search
  searchStore.searchQuery = search
  // Navegar para a página de busca
  router.push({
    path: '/search',
    query: { q: search }
  })
  showDropdown.value = false
  searchInput.value?.blur()
}

const clearHistory = () => {
  searchStore.clearRecentSearches()
}

watch(localSearchQuery, (newVal) => {
  if (!newVal.trim()) {
    searchStore.searchQuery = ''
  }
})

// Diretiva para clicar fora
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
</script>

<style scoped>
.search-container {
  position: relative;
  width: 300px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: rgba(245, 240, 230, 0.5);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 32px 10px 40px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 30px;
  color: var(--white-soft);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--gold-primary);
  background: rgba(59, 58, 64, 0.5);
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: rgba(245, 240, 230, 0.5);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  color: var(--gold-primary);
}

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.results-count {
  font-size: 0.7rem;
  color: var(--gold-primary);
}

/* Resultados */
.results-list {
  max-height: 320px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(212, 175, 55, 0.05);
}

.result-item:hover {
  background: rgba(212, 175, 55, 0.1);
}

.result-image {
  width: 50px;
  height: 50px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.result-info {
  flex: 1;
}

.result-title {
  font-size: 0.85rem;
  color: var(--white-soft);
  margin-bottom: 4px;
  font-weight: 500;
}

.result-title :deep(mark) {
  background: rgba(212, 175, 55, 0.3);
  color: var(--gold-primary);
  padding: 0 2px;
  border-radius: 3px;
}

.result-category {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
  margin-bottom: 4px;
}

.result-price {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gold-primary);
}

.view-all {
  padding: 12px 16px;
  text-align: center;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}

.view-all button {
  background: none;
  border: none;
  color: var(--gold-primary);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-all button:hover {
  text-decoration: underline;
}

/* Sem resultados */
.no-results {
  text-align: center;
  padding: 32px 16px;
}

.no-results svg {
  color: rgba(245, 240, 230, 0.3);
  margin-bottom: 12px;
}

.no-results p {
  color: var(--white-soft);
  margin-bottom: 4px;
  font-weight: 500;
}

.no-results span {
  font-size: 0.8rem;
  color: rgba(245, 240, 230, 0.5);
}

/* Histórico */
.recent-list, .popular-list {
  max-height: 320px;
  overflow-y: auto;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(245, 240, 230, 0.8);
  font-size: 0.85rem;
}

.recent-item:hover {
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold-primary);
}

.recent-item svg {
  flex-shrink: 0;
}

.clear-history {
  background: none;
  border: none;
  color: rgba(245, 240, 230, 0.5);
  cursor: pointer;
  font-size: 0.7rem;
  transition: all 0.3s ease;
}

.clear-history:hover {
  color: #ff6b6b;
}

/* Produtos em destaque */
.popular-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(212, 175, 55, 0.05);
}

.popular-item:hover {
  background: rgba(212, 175, 55, 0.1);
}

.popular-image {
  width: 45px;
  height: 45px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popular-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.popular-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.popular-title {
  font-size: 0.85rem;
  color: var(--white-soft);
}

.popular-price {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gold-primary);
}

/* Scrollbar */
.search-dropdown::-webkit-scrollbar {
  width: 6px;
}

.search-dropdown::-webkit-scrollbar-track {
  background: rgba(59, 58, 64, 0.3);
  border-radius: 3px;
}

.search-dropdown::-webkit-scrollbar-thumb {
  background: var(--gold-primary);
  border-radius: 3px;
}

/* Responsividade */
@media (max-width: 768px) {
  .search-container {
    width: 100%;
    margin: 8px 0;
  }
  
  .search-dropdown {
    position: fixed;
    top: 70px;
    left: 16px;
    right: 16px;
    max-height: 70vh;
  }
}
</style>