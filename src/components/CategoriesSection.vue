<template>
  <section class="categories">
    <div class="container">
      <h2 class="section-title">Shop by Category</h2>
      <div class="categories-grid" v-if="categories.length > 0">
        <div 
          v-for="category in categories" 
          :key="category"
          class="category-card"
          @click="handleCategoryClick(category)"
        >
          <div class="category-icon">
            {{ getCategoryIcon(category) }}
          </div>
          <h3>{{ formatCategoryName(category) }}</h3>
          <p class="category-count">{{ getProductCount(category) }} produtos</p>
          <button class="category-btn">Explorar</button>
        </div>
      </div>
      <div v-else-if="!loading" class="no-categories">
        <p>Carregando categorias...</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { computed } from 'vue'

const router = useRouter()
const store = useProductsStore()

const categories = computed(() => store.categories)
const loading = computed(() => store.loading)

const formatCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    "jewelery": "Jóias",
    "electronics": "Eletrônicos"
  }
  return names[category] || category.split("'").join("").split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    "men's clothing": "👔",
    "women's clothing": "👗",
    "jewelery": "💍",
    "electronics": "📱"
  }
  return icons[category] || "🛍️"
}

const getProductCount = (category: string): number => {
  try {
    // Verificar se o método existe
    if (store.getProductsByCategory && typeof store.getProductsByCategory === 'function') {
      return store.getProductsByCategory(category).length
    }
    // Fallback: contar manualmente
    return store.products.filter(p => p.category === category).length
  } catch (error) {
    console.error('Erro ao contar produtos:', error)
    return 0
  }
}

const handleCategoryClick = (category: string) => {
  // Redirecionar para a página de produtos com o filtro da categoria
  router.push(`/products?category=${encodeURIComponent(category)}`)
  // Scroll suave para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.categories {
  margin: 50px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: var(--white-soft);
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--gold-primary);
  border-radius: 3px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.category-card {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  padding: 30px;
  text-align: center;
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  border-color: var(--gold-primary);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-card h3 {
  margin: 15px 0 10px;
  color: var(--white-soft);
  font-size: 1.2rem;
  font-weight: 600;
}

.category-count {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.category-btn {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  padding: 8px 25px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.category-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.no-categories {
  text-align: center;
  padding: 40px;
  color: var(--white-soft);
}

/* Responsividade */
@media (max-width: 768px) {
  .categories {
    margin: 30px 0;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .category-card {
    padding: 20px;
  }
  
  .category-icon {
    font-size: 2.5rem;
  }
  
  .category-card h3 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-card {
    padding: 25px;
  }
}
</style>