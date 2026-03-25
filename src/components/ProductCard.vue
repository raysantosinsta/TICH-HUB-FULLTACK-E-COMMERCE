<template>
  <div class="product-card" @click="viewProduct">
    <div class="product-image">
      <img :src="product.image" :alt="product.title">
      <div class="image-overlay">
        <span class="quick-view">Ver detalhes</span>
      </div>
      <div class="favorite-overlay">
        <FavoriteButton :product="product" :show-text="false" @update="onFavoriteUpdate" />
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ truncateTitle(product.title) }}</h3>
      <div class="product-rating">
        <span class="stars">{{ getStarRating(product.rating.rate) }}</span>
        <span class="count">({{ product.rating.count }})</span>
      </div>
      <div class="product-price">
        <span class="price">R$ {{ formatPrice(product.price) }}</span>
        <button class="add-to-cart" @click.stop="addToCart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" fill="none" stroke-width="1.5"/>
          </svg>
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types'
import { useCartStore } from '../stores/cart'
import { useToast } from '../plugins/toast'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const toast = useToast()

const emit = defineEmits<{
  (e: 'view', product: Product): void
}>()

const truncateTitle = (title: string) => {
  return title.length > 50 ? title.substring(0, 47) + '...' : title
}

const getStarRating = (rate: number) => {
  const fullStars = Math.floor(rate)
  const hasHalfStar = rate % 1 >= 0.5
  let stars = ''
  for (let i = 0; i < fullStars; i++) stars += '★'
  if (hasHalfStar) stars += '½'
  for (let i = 0; i < 5 - Math.ceil(rate); i++) stars += '☆'
  return stars
}

const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',')
}

const viewProduct = () => {
  emit('view', props.product)
}

const addToCart = () => {
  cartStore.addToCart(props.product, 1)
  toast.success(
    'Produto adicionado!', 
    `${props.product.title.substring(0, 50)}${props.product.title.length > 50 ? '...' : ''} foi adicionado ao carrinho.`,
    3000
  )
}

const onFavoriteUpdate = (isFavorited: boolean) => {
  // Evento já tratado no componente FavoriteButton
}
</script>

<style scoped>
/* Seus estilos existentes do ProductCard */
.product-card {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(212, 175, 55, 0.2);
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(212, 175, 55, 0.2);
  border-color: var(--gold-primary);
}

.product-image {
  position: relative;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 58, 64, 0.3);
  padding: 20px;
  overflow: hidden;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

.image-overlay {
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
  transition: opacity 0.3s ease;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.favorite-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .favorite-overlay {
  opacity: 1;
}

.quick-view {
  background: var(--gold-primary);
  color: var(--black-primary);
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.product-card:hover .quick-view {
  transform: translateY(0);
}

.product-info {
  padding: 18px;
}

.product-title {
  font-size: 0.95rem;
  margin-bottom: 12px;
  color: var(--white-soft);
  min-height: 48px;
  line-height: 1.4;
  font-weight: 500;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  color: var(--gold-primary);
  letter-spacing: 2px;
  font-size: 0.9rem;
}

.count {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.8rem;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--gold-primary);
}

.add-to-cart {
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 8px 14px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-to-cart:hover {
  background: var(--gold-primary);
  color: var(--black-primary);
  transform: scale(1.05);
  border-color: var(--gold-primary);
}

@media (max-width: 768px) {
  .product-image {
    height: 220px;
  }
  
  .favorite-overlay {
    opacity: 1;
  }
}
</style>