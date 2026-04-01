<template>
  <div class="product-card" @click="viewProduct">
    <div class="product-image">
      <img :src="productImage" :alt="product.title">
      <div class="image-overlay">
        <span class="quick-view">Ver detalhes</span>
      </div>
      <!-- Ícone de favorito - posicionado corretamente no canto superior direito -->
      <div class="favorite-overlay" @click.stop="handleFavoriteClick">
        <FavoriteButton 
          :product="product" 
          :show-text="false" 
          @update="onFavoriteUpdate"
        />
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ truncateTitle(product.title) }}</h3>
      <div class="product-rating" v-if="hasRating">
        <span class="stars">{{ getStarRating(product.rating.rate) }}</span>
        <span class="count">({{ product.rating.count }})</span>
      </div>
      <div class="product-price">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <div class="add-to-cart-wrapper">
          <button 
            class="add-to-cart" 
            @click.stop="addToCart"
            :class="{ 'btn-disabled': !isAuthenticated }"
            :disabled="addingToCart"
          >
            <svg v-if="!addingToCart" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" fill="none" stroke-width="1.5"/>
            </svg>
            <span v-else class="spinner-small"></span>
            {{ addingToCart ? 'Adicionando...' : 'Adicionar' }}
          </button>
          <!-- Tooltip para usuários não logados -->
          <span v-if="!isAuthenticated" class="tooltip-text">
            🔒 Faça login para adicionar
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '../types'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

const addingToCart = ref(false)

const emit = defineEmits<{
  (e: 'view', product: Product): void
}>()

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Função para obter a imagem do produto
const productImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images[0]
  }
  if (props.product.image) {
    return props.product.image
  }
  return '/placeholder-image.jpg'
})

// Verificar se o produto tem rating
const hasRating = computed(() => {
  return props.product.rating && 
         props.product.rating.rate !== undefined && 
         props.product.rating.count !== undefined
})

const truncateTitle = (title: string) => {
  if (!title) return ""
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
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
}

const viewProduct = () => {
  emit('view', props.product)
}

const handleFavoriteClick = (event: MouseEvent) => {
  // Previne a propagação para o card pai
  event.stopPropagation()
  
  // Verificar se usuário está logado
  if (!isAuthenticated.value) {
    toast.warning(
      'Login necessário',
      'Faça login para adicionar produtos aos favoritos.',
      4000
    )
    // Redirecionar para página de login
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { redirect: '/favorites' }
      })
    }, 1500)
    return
  }
  
  // Se estiver logado, apenas atualiza o favorito
  console.log('Favoritando produto:', props.product.title)
}

const addToCart = async (event: MouseEvent) => {
  // Previne a propagação para o card pai
  event.stopPropagation()
  
  // Verificar se usuário está logado
  if (!isAuthenticated.value) {
    toast.warning(
      'Login necessário',
      'Faça login para adicionar produtos ao carrinho.',
      4000
    )
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return
  }
  
  addingToCart.value = true
  
  try {
    cartStore.addToCart(props.product, 1)
    toast.success(
      'Produto adicionado!', 
      `${props.product.title.substring(0, 50)}${props.product.title.length > 50 ? '...' : ''} foi adicionado ao carrinho.`,
      3000
    )
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error)
    toast.error(
      'Erro',
      'Não foi possível adicionar o produto ao carrinho. Tente novamente.',
      3000
    )
  } finally {
    setTimeout(() => {
      addingToCart.value = false
    }, 500)
  }
}

const onFavoriteUpdate = (isFavorited: boolean) => {
  console.log('Favorite status updated:', isFavorited)
}
</script>

<style scoped>
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

/* Ícone de favorito posicionado no canto superior direito */
.favorite-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 20;
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.favorite-overlay:active {
  transform: scale(0.95);
}

.product-card:hover .favorite-overlay {
  transform: scale(1.05);
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

/* Wrapper para o botão com tooltip */
.add-to-cart-wrapper {
  position: relative;
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

.add-to-cart:hover:not(:disabled) {
  background: var(--gold-primary);
  color: var(--black-primary);
  transform: scale(1.05);
  border-color: var(--gold-primary);
}

.add-to-cart.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-to-cart.btn-disabled:hover {
  transform: none;
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary);
}

/* Tooltip Styles */
.add-to-cart-wrapper .tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 120%;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  color: var(--gold-primary);
  text-align: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 100;
  transition: all 0.3s ease;
  pointer-events: none;
  border: 1px solid rgba(212, 175, 55, 0.3);
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.add-to-cart-wrapper .tooltip-text::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 15px;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
}

.add-to-cart-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  bottom: 130%;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-top-color: var(--gold-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estilos para o ícone de favorito dentro do componente */
.favorite-overlay :deep(.favorite-btn-premium) {
  background: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  padding: 8px !important;
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
}

.favorite-overlay :deep(.favorite-btn-premium.active) {
  background: rgba(255, 107, 107, 0.2) !important;
  border-color: #ff6b6b !important;
}

.favorite-overlay :deep(.heart-icon-premium) {
  width: 18px !important;
  height: 18px !important;
}

@media (max-width: 768px) {
  .product-image {
    height: 220px;
  }
  
  .favorite-overlay {
    top: 10px;
    right: 10px;
  }
  
  .favorite-overlay :deep(.favorite-btn-premium) {
    width: 32px !important;
    height: 32px !important;
    padding: 6px !important;
  }
  
  .favorite-overlay :deep(.heart-icon-premium) {
    width: 16px !important;
    height: 16px !important;
  }
  
  .add-to-cart-wrapper .tooltip-text {
    white-space: normal;
    width: 160px;
    font-size: 0.65rem;
    right: -20px;
  }
  
  .add-to-cart-wrapper .tooltip-text::after {
    right: 30px;
  }
}

@media (max-width: 480px) {
  .favorite-overlay :deep(.favorite-btn-premium) {
    width: 28px !important;
    height: 28px !important;
    padding: 5px !important;
  }
  
  .favorite-overlay :deep(.heart-icon-premium) {
    width: 14px !important;
    height: 14px !important;
  }
  
  .add-to-cart-wrapper .tooltip-text {
    width: 140px;
    right: -30px;
  }
  
  .add-to-cart-wrapper .tooltip-text::after {
    right: 40px;
  }
}
</style>