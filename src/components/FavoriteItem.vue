<template>
  <div class="favorite-item">
    <div class="item-image" @click="goToProduct">
      <img :src="product.image" :alt="product.title">
    </div>
    
    <div class="item-info">
      <h3 class="item-title" @click="goToProduct">{{ truncateTitle(product.title) }}</h3>
      <span class="item-category">{{ formatCategory(product.category) }}</span>
      <div class="item-price">R$ {{ formatPrice(product.price) }}</div>
    </div>
    
    <div class="item-actions">
      <button class="action-btn view-btn" @click="goToProduct">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Ver
      </button>
      <button class="action-btn remove-btn" @click="removeFavorite">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Remover
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useToast } from '../plugins/toast'
import type { Product } from '../types'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const favoritesStore = useFavoritesStore()
const toast = useToast()

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

const truncateTitle = (title: string) => {
  return title.length > 60 ? title.substring(0, 57) + '...' : title
}

const goToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const removeFavorite = () => {
  favoritesStore.removeFromFavorites(props.product.id)
  toast.info(
    'Removido dos favoritos',
    `${props.product.title.substring(0, 50)}${props.product.title.length > 50 ? '...' : ''} foi removido dos favoritos.`,
    2000
  )
}
</script>

<style scoped>
.favorite-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.favorite-item:hover {
  transform: translateY(-2px);
  border-color: var(--gold-primary);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.1);
}

.item-image {
  width: 100px;
  height: 100px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: transform 0.3s ease;
}

.item-image:hover img {
  transform: scale(1.1);
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 1rem;
  color: var(--white-soft);
  margin-bottom: 6px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.item-title:hover {
  color: var(--gold-primary);
}

.item-category {
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.5);
  display: block;
  margin-bottom: 8px;
}

.item-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--gold-primary);
}

.item-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 30px;
  color: var(--white-soft);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.view-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--gold-primary);
  color: var(--gold-primary);
}

.remove-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: #ff6b6b;
  color: #ff6b6b;
}

@media (max-width: 768px) {
  .favorite-item {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .item-image {
    width: 120px;
    height: 120px;
  }
  
  .item-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>