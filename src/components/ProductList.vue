<template>
  <div class="product-list">
    <!-- Filtros -->
    <div class="filters">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="filterByCategory(cat)"
        :class="{ active: selectedCategory === cat }"
        class="filter-btn"
      >
        {{ formatCategoryName(cat) }}
      </button>
      <button 
        @click="clearFilter"
        class="filter-btn clear"
        v-if="selectedCategory"
      >
        Limpar Filtro
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando produtos...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="error">
      <p>⚠️ {{ error }}</p>
      <button @click="retry" class="retry-btn">Tentar Novamente</button>
    </div>

    <!-- Listagem de Produtos -->
    <div v-else class="products-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id"
        :product="product"
        @view="goToProduct"
      />
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
  toast.info('Filtro aplicado', `Mostrando produtos de ${formatCategoryName(category)}`, 2000)
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
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Filtros */
.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  justify-content: center;
}

.filter-btn {
  padding: 10px 24px;
  border: 2px solid var(--gray-dark);
  background: transparent;
  color: var(--white-soft);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: var(--gold-primary);
  color: var(--black-primary);
  border-color: var(--gold-primary);
}

.filter-btn.clear {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.filter-btn.clear:hover {
  background: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

/* Loading */
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

.loading p {
  color: var(--white-soft);
  font-size: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error {
  text-align: center;
  padding: 60px;
  color: var(--gold-primary);
}

.error p {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.retry-btn {
  padding: 10px 24px;
  background: var(--gold-primary);
  color: var(--black-primary);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
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

/* Responsividade */
@media (max-width: 768px) {
  .product-list {
    padding: 16px;
  }

  .filters {
    gap: 8px;
  }

  .filter-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>