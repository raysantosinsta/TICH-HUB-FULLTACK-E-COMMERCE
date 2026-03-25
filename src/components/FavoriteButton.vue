<template>
  <div class="favorite-wrapper">
    <button 
      class="favorite-btn"
      :class="{ active: isFavorited, animated: isAnimating, 'btn-disabled': !isAuthenticated }"
      @click="handleFavorite"
      :disabled="disabled || !isAuthenticated"
    >
      <svg 
        class="heart-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
          fill="currentColor"
        />
      </svg>
      <span v-if="showText" class="favorite-text">
        {{ isFavorited ? 'Favoritado' : 'Favoritar' }}
      </span>
    </button>
    <!-- Tooltip para usuários não logados -->
    <div v-if="!isAuthenticated" class="tooltip-text">
      🔒 Faça login para favoritar
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import type { Product } from '../types'

const props = defineProps<{
  product: Product
  showText?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', isFavorited: boolean): void
}>()

const router = useRouter()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const toast = useToast()
const isAnimating = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isFavorited = computed(() => favoritesStore.isFavorite(props.product.id))

const handleFavorite = async () => {
  if (props.disabled) return
  
  // Verificar se usuário está logado
  if (!isAuthenticated.value) {
    toast.warning(
      'Login necessário',
      'Faça login para adicionar produtos aos favoritos.',
      4000
    )
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return
  }
  
  isAnimating.value = true
  
  const wasFavorited = isFavorited.value
  const isNowFavorited = favoritesStore.toggleFavorite(props.product)
  
  if (isNowFavorited && !wasFavorited) {
    toast.success(
      'Adicionado aos favoritos!',
      `${props.product.title.substring(0, 50)}${props.product.title.length > 50 ? '...' : ''} foi salvo nos favoritos.`,
      2000
    )
  } else if (!isNowFavorited && wasFavorited) {
    toast.info(
      'Removido dos favoritos',
      `${props.product.title.substring(0, 50)}${props.product.title.length > 50 ? '...' : ''} foi removido dos favoritos.`,
      2000
    )
  }
  
  emit('update', isNowFavorited)
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}
</script>

<style scoped>
.favorite-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: rgba(245, 240, 230, 0.6);
  position: relative;
  z-index: 2;
}

.favorite-btn:hover:not(:disabled) {
  transform: scale(1.1);
  color: #ff6b6b;
}

.favorite-btn.active {
  color: #ff6b6b;
}

.favorite-btn.animated {
  animation: heartBeat 0.3s ease;
}

.favorite-btn.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorite-btn.btn-disabled:hover {
  transform: none;
  color: rgba(245, 240, 230, 0.6);
}

.heart-icon {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.favorite-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.favorite-btn.active .favorite-text {
  color: #ff6b6b;
}

/* Tooltip Styles - igual ao do botão de carrinho */
.favorite-wrapper .tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  color: var(--gold-primary);
  text-align: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
  border: 1px solid rgba(212, 175, 55, 0.3);
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.favorite-wrapper .tooltip-text::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
}

.favorite-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  bottom: 130%;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.favorite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsividade do Tooltip */
@media (max-width: 768px) {
  .favorite-wrapper .tooltip-text {
    white-space: normal;
    width: 150px;
    font-size: 0.65rem;
    padding: 6px 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .favorite-wrapper .tooltip-text::after {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>