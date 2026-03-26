<template>
  <div class="favorite-item-premium">
    <!-- Glow Effect no Card -->
    <div class="card-glow-premium"></div>
    
    <div class="item-image-premium" @click="goToProduct">
      <div class="image-wrapper-premium">
        <img :src="product.image" :alt="product.title">
        <div class="image-overlay-premium"></div>
        <div class="image-shine-premium"></div>
      </div>
    </div>
    
    <div class="item-info-premium">
      <div class="info-header-premium">
        <h3 class="item-title-premium" @click="goToProduct">{{ truncateTitle(product.title) }}</h3>
        <div class="category-badge-premium">
          <span class="badge-dot"></span>
          {{ formatCategory(product.category) }}
        </div>
      </div>
      
      <div class="item-price-premium">
        <span class="price-label">Preço especial</span>
        <span class="price-value">R$ {{ formatPrice(product.price) }}</span>
      </div>
      
      <div class="item-rating-premium">
        <div class="stars-premium">
          <span v-for="i in 5" :key="i" class="star-premium" :class="{ filled: i <= Math.floor(product.rating?.rate || 0) }">
            ★
          </span>
        </div>
        <span class="rating-count" v-if="product.rating?.count">({{ product.rating.count }})</span>
      </div>
    </div>
    
    <div class="item-actions-premium">
      <button class="action-btn-premium view-btn-premium" @click="goToProduct">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span>Ver detalhes</span>
      </button>
      <button class="action-btn-premium remove-btn-premium" @click="removeFavorite">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>Remover</span>
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
    "jewelery": "Jóias Exclusivas",
    "electronics": "Tecnologia Premium"
  }
  return categories[category] || category
}

const truncateTitle = (title: string) => {
  return title.length > 60 ? title.substring(0, 57) + '...' : title
}

const goToProduct = () => {
  router.push(`/product/${props.product.id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
/* ========== FAVORITE ITEM PREMIUM ========== */
.favorite-item-premium {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: fadeInItem 0.5s ease backwards;
}

.favorite-item-premium:nth-child(1) { animation-delay: 0.05s; }
.favorite-item-premium:nth-child(2) { animation-delay: 0.1s; }
.favorite-item-premium:nth-child(3) { animation-delay: 0.15s; }
.favorite-item-premium:nth-child(4) { animation-delay: 0.2s; }

@keyframes fadeInItem {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.favorite-item-premium:hover {
  transform: translateY(-4px);
  border-color: var(--gold-primary);
  box-shadow: 0 15px 35px rgba(212, 175, 55, 0.15);
}

.card-glow-premium {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.08), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.favorite-item-premium:hover .card-glow-premium {
  left: 100%;
}

/* Imagem Premium */
.item-image-premium {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(59, 58, 64, 0.3);
  transition: all 0.3s ease;
}

.image-wrapper-premium {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.item-image-premium img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-image-premium:hover img {
  transform: scale(1.1);
}

.image-overlay-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 50%, rgba(212, 175, 55, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.item-image-premium:hover .image-overlay-premium {
  opacity: 1;
}

.image-shine-premium {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.item-image-premium:hover .image-shine-premium {
  left: 100%;
}

/* Informações Premium */
.item-info-premium {
  flex: 1;
  min-width: 0;
}

.info-header-premium {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.item-title-premium {
  font-size: 1rem;
  font-weight: 600;
  color: var(--white-soft);
  margin: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 1.4;
  flex: 1;
}

.item-title-premium:hover {
  color: var(--gold-primary);
  transform: translateX(2px);
}

.category-badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(212, 175, 55, 0.1);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--gold-primary);
  border: 1px solid rgba(212, 175, 55, 0.2);
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: var(--gold-primary);
  border-radius: 50%;
  display: inline-block;
  animation: pulseDot 1.5s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Preço Premium */
.item-price-premium {
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.price-label {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Rating Premium */
.item-rating-premium {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars-premium {
  display: flex;
  gap: 2px;
}

.star-premium {
  color: rgba(245, 240, 230, 0.2);
  font-size: 0.9rem;
}

.star-premium.filled {
  color: var(--gold-primary);
}

.rating-count {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
}

/* Ações Premium */
.item-actions-premium {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.action-btn-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(59, 58, 64, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 50px;
  color: rgba(245, 240, 230, 0.8);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.action-btn-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.4s ease;
}

.action-btn-premium:hover::before {
  left: 100%;
}

.action-btn-premium:hover {
  transform: translateY(-2px);
}

.action-btn-premium svg {
  transition: transform 0.3s ease;
}

.action-btn-premium:hover svg {
  transform: scale(1.1);
}

.view-btn-premium:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
}

.remove-btn-premium:hover {
  background: rgba(255, 107, 107, 0.15);
  border-color: #ff6b6b;
  color: #ff6b6b;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.2);
}

/* Responsividade Premium */
@media (max-width: 768px) {
  .favorite-item-premium {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 20px;
  }
  
  .item-image-premium {
    width: 130px;
    height: 130px;
  }
  
  .info-header-premium {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .item-title-premium {
    text-align: center;
  }
  
  .item-price-premium {
    justify-content: center;
  }
  
  .item-rating-premium {
    justify-content: center;
  }
  
  .item-actions-premium {
    width: 100%;
    justify-content: center;
  }
  
  .action-btn-premium {
    flex: 1;
    justify-content: center;
    padding: 10px 16px;
  }
  
  .action-btn-premium span {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .favorite-item-premium {
    padding: 16px;
    gap: 16px;
    border-radius: 20px;
  }
  
  .item-image-premium {
    width: 100px;
    height: 100px;
  }
  
  .item-title-premium {
    font-size: 0.9rem;
  }
  
  .category-badge-premium {
    font-size: 0.65rem;
    padding: 3px 10px;
  }
  
  .price-value {
    font-size: 1.1rem;
  }
  
  .action-btn-premium {
    padding: 8px 14px;
    gap: 6px;
  }
  
  .action-btn-premium svg {
    width: 16px;
    height: 16px;
  }
  
  .action-btn-premium span {
    font-size: 0.75rem;
  }
}

/* Efeito de brilho ao remover */
.remove-btn-premium:active {
  transform: scale(0.95);
}

/* Animação de entrada para cada item */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>