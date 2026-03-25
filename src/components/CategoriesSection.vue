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
          <p class="category-count">{{ getProductCount(category) }} products</p>
          <button class="category-btn">Explore</button>
        </div>
      </div>
      <div v-else-if="!loading" class="no-categories">
        No categories available
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProductsStore } from '../stores/products';
import { computed } from 'vue';

const store = useProductsStore();
const categories = computed(() => store.categories);
const loading = computed(() => store.loading);

const formatCategoryName = (category: string): string => {
  return category
    .split("'")
    .join("")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    "men's clothing": "👔",
    "women's clothing": "👗",
    "jewelery": "💍",
    "electronics": "📱"
  };
  return icons[category] || "🛍️";
};

const getProductCount = (category: string): number => {
  return store.getProductsByCategory(category).length;
};

const handleCategoryClick = (category: string) => {
  console.log('Category clicked:', category);
  // You can implement category filtering logic here
};
</script>

<style scoped>
.categories {
  margin: 50px 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.category-card {
  background: var(--white);
  padding: 30px;
  text-align: center;
  border-radius: 10px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.category-card h3 {
  margin: 15px 0 10px;
  color: var(--dark-color);
  font-size: 1.2rem;
}

.category-count {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.category-btn {
  background: linear-gradient(135deg, var(--secondary-color) 0%, #764ba2 100%);
  color: var(--white);
  border: none;
  padding: 8px 25px;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.category-btn:hover {
  transform: scale(1.05);
}
</style>