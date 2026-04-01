<template>
  <div class="search-results-premium" :key="$route.fullPath">
    <!-- Background Premium -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="search-particles">
        <div v-for="i in 50" :key="i" class="search-particle" :style="getParticleStyle(i)">🔍</div>
      </div>
    </div>

    <div class="container-premium">
      <!-- Header -->
      <div class="page-header-premium">
        <div class="header-content-premium">
          <div class="title-wrapper-premium">
            <div class="title-icon-premium">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <h1 class="page-title-premium">
              Resultados para: <span class="search-term-premium">"{{ searchQuery || 'Todos os produtos' }}"</span>
            </h1>
          </div>
          <div class="results-count-premium">
            <span class="count-badge">{{ totalResults }}</span>
            <span class="count-text">{{ totalResults === 1 ? 'produto encontrado' : 'produtos encontrados' }}</span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-bar-premium">
        <div class="category-filters-premium">
          <button v-for="cat in categories" :key="cat.id" @click="filterByCategory(cat)" 
                  :class="{ active: selectedCategory === cat.slug }" class="filter-chip-premium">
            {{ cat.name }}
          </button>
          <button v-if="selectedCategory" @click="clearCategoryFilter" class="filter-chip-premium clear-chip">
            Limpar filtro
          </button>
        </div>

        <div class="sort-filters-premium">
          <select v-model="sortBy" class="sort-select-premium">
            <option value="relevance">Mais relevantes</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-premium">Buscando produtos...</div>

      <!-- Resultados -->
      <div v-else-if="results.length > 0" class="results-grid-premium">
        <transition-group name="result-card" tag="div" class="results-grid-inner">
          <ProductCard v-for="product in results" :key="product.id" :product="product" @view="goToProduct"/>
        </transition-group>
      </div>

      <!-- Sem resultados -->
      <div v-else class="no-results-premium">
        <div class="no-results-card-premium">
          <h2>Nenhum produto encontrado</h2>
          <p>Não encontramos resultados para "{{ searchQuery }}".</p>
          <router-link to="/" class="back-home-premium">Ver todos os produtos</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useSearchStore } from '../stores/search'
import ProductCard from '../components/ProductCard.vue'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const searchStore = useSearchStore()

const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref<'relevance' | 'price_asc' | 'price_desc'>('relevance')

const loadSearchResults = async () => {
  loading.value = true

  const q = String(route.query.q || '').trim()
  const cat = String(route.query.category || '').trim()

  searchQuery.value = q
  selectedCategory.value = cat
  searchStore.searchQuery = q
  searchStore.selectedCategory = cat

  if (q) searchStore.addToRecentSearches(q)

  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }

  await nextTick()
  loading.value = false
}

watch([() => route.query.q, () => route.query.category], async () => {
  await loadSearchResults()
}, { immediate: true })

watch(sortBy, (newVal) => { searchStore.sortBy = newVal })

const categories = computed(() => productsStore.categories)

const results = computed(() => {
  let filtered = searchStore.getFilteredResults(productsStore.products)
  
  if (sortBy.value === 'price_asc') return [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price_desc') return [...filtered].sort((a, b) => b.price - a.price)
  return filtered
})

const totalResults = computed(() => results.value.length)

const filterByCategory = (cat: any) => {
  selectedCategory.value = cat.slug
  searchStore.selectedCategory = cat.slug

  router.replace({
    query: { 
      ...(searchQuery.value && { q: searchQuery.value }),
      category: cat.slug 
    }
  })
}

const clearCategoryFilter = () => {
  selectedCategory.value = ''
  searchStore.selectedCategory = ''
  router.replace({ query: searchQuery.value ? { q: searchQuery.value } : {} })
}

const goToProduct = (product: Product) => router.push(`/product/${product.id}`)

const getParticleStyle = (i: number) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `-${Math.random() * 20}s`
})
</script>




<style scoped>
/* ========== SEARCH RESULTS PREMIUM ========== */
.search-results-premium {
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
  animation: gradientPulseSearch 8s ease-in-out infinite;
}

@keyframes gradientPulseSearch {
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
  animation: lightSweepSearch 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepSearch {
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

.search-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.search-particle {
  position: absolute;
  font-size: 12px;
  animation: floatParticleSearch linear infinite;
  opacity: 0;
}

@keyframes floatParticleSearch {
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
  text-align: center;
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
  position: relative;
}

.title-wrapper-premium {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.title-icon-premium {
  position: relative;
  color: var(--gold-primary);
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
  animation: iconPulseSearch 1.5s ease-in-out infinite;
}

@keyframes iconPulseSearch {
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
  animation: iconGlowSearch 2s ease-in-out infinite;
}

@keyframes iconGlowSearch {
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
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.search-term-premium {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
}

.results-count-premium {
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
  margin-bottom: 48px;
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

.clear-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.clear-chip:hover {
  background: rgba(212, 175, 55, 0.2);
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

/* Loading Premium */
.loading-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 24px;
}

.search-loader {
  position: relative;
  width: 80px;
  height: 80px;
}

.magnifying-glass {
  position: relative;
  width: 100%;
  height: 100%;
}

.glass-circle {
  width: 50px;
  height: 50px;
  border: 3px solid var(--gold-primary);
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  animation: circlePulse 1.5s ease-in-out infinite;
}

.glass-handle {
  width: 25px;
  height: 3px;
  background: var(--gold-primary);
  position: absolute;
  bottom: 5px;
  right: 5px;
  transform: rotate(45deg);
  animation: handlePulse 1.5s ease-in-out infinite;
}

@keyframes circlePulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes handlePulse {
  0%, 100% {
    width: 20px;
    opacity: 0.5;
  }
  50% {
    width: 30px;
    opacity: 1;
  }
}

.loading-dots {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: var(--gold-primary);
  border-radius: 50%;
  animation: dotPulse 1s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text-premium {
  color: rgba(245, 240, 230, 0.7);
  font-size: 1rem;
  letter-spacing: 1px;
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

/* Results Grid Premium */
.results-grid-premium {
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

.results-grid-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

/* Result Card Transition */
.result-card-move,
.result-card-enter-active,
.result-card-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-card-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.result-card-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.result-card-leave-active {
  position: absolute;
}

/* No Results Premium */
.no-results-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.no-results-card-premium {
  max-width: 550px;
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

.no-results-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.no-results-animation {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}

.no-results-animation svg {
  color: rgba(245, 240, 230, 0.2);
  animation: floatSearch 3s ease-in-out infinite;
}

@keyframes floatSearch {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-search {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-search span {
  position: absolute;
  font-size: 20px;
  animation: floatIconSearch 2s ease-in-out infinite;
}

.floating-search span:nth-child(1) {
  top: -20px;
  left: 0;
  animation-delay: 0s;
}

.floating-search span:nth-child(2) {
  top: -30px;
  right: 0;
  animation-delay: 0.3s;
}

.floating-search span:nth-child(3) {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.6s;
}

@keyframes floatIconSearch {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
}

.no-results-title {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.no-results-description {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 32px;
  line-height: 1.6;
}

.back-home-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-home-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Responsividade Premium */
@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }
  
  .page-title-premium {
    font-size: 1.6rem;
  }
  
  .results-grid-inner {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .search-results-premium {
    padding: 40px 0 60px;
  }
  
  .container-premium {
    padding: 0 16px;
  }
  
  .page-title-premium {
    font-size: 1.3rem;
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
    gap: 16px;
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
  
  .results-grid-inner {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }
  
  .no-results-card-premium {
    padding: 40px 24px;
    margin: 0 16px;
  }
  
  .no-results-title {
    font-size: 1.3rem;
  }
  
  .no-results-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title-premium {
    font-size: 1.1rem;
  }
  
  .title-icon-premium svg {
    width: 28px;
    height: 28px;
  }
  
  .results-count-premium {
    font-size: 0.8rem;
    padding: 6px 16px;
  }
  
  .filter-chip-premium {
    padding: 6px 18px;
    font-size: 0.75rem;
  }
  
  .results-grid-inner {
    grid-template-columns: 1fr;
  }
  
  .no-results-card-premium {
    padding: 32px 20px;
  }
  
  .no-results-title {
    font-size: 1.1rem;
  }
  
  .back-home-premium {
    padding: 10px 24px;
    font-size: 0.85rem;
  }
}
</style>