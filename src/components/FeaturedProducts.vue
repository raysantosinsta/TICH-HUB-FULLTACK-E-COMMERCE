<template>
  <section class="featured-products">
    <div class="container">
      <h2 class="section-title">Featured Products</h2>
      
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading products...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>⚠️ {{ error }}</p>
        <button @click="retry" class="retry-btn">Retry</button>
      </div>
      
      <div v-else class="products-grid">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.title" loading="lazy">
            <div class="product-overlay">
              <button class="quick-view">Quick View</button>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ truncateTitle(product.title) }}</h3>
            <div class="product-rating" v-if="product.rating">
  <span class="stars">{{ getStarRating(product.rating.rate) }}</span>
  <span class="rating-count">({{ product.rating.count }})</span>
</div>
<div class="product-rating" v-else>
  <span class="stars">☆☆☆☆☆</span>
  <span class="rating-count">(0)</span>
</div>
            <div class="product-price">
              <span class="price">${{ product.price.toFixed(2) }}</span>
              <button class="add-to-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '../types';

defineProps<{
  products: Product[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: 'retry'): void;
}>();

const truncateTitle = (title: string): string => {
  if (title.length > 50) {
    return title.substring(0, 47) + '...';
  }
  return title;
};

const getStarRating = (rate: number = 0): string => {
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate % 1 >= 0.5;
  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '½';
  stars += '☆'.repeat(5 - Math.ceil(rate));
  return stars;
};

const retry = () => {
  emit('retry');
};
</script>

<style scoped>
.featured-products {
  margin: 50px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.product-card {
  background: var(--white);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.product-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view {
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}

.quick-view:hover {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 1rem;
  margin-bottom: 10px;
  color: var(--dark-color);
  min-height: 45px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.stars {
  color: #ffc107;
  letter-spacing: 2px;
}

.rating-count {
  color: #666;
  font-size: 0.85rem;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary-color);
}

.add-to-cart {
  background: var(--secondary-color);
  color: var(--white);
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart:hover {
  background: #764ba2;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--light-color);
  border-top-color: var(--secondary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 15px;
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}
</style>