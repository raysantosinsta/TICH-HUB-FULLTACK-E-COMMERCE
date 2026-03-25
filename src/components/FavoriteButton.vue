<template>
  <button 
    class="favorite-btn"
    :class="{ active: isFavorited, animated: isAnimating }"
    @click="handleFavorite"
    :disabled="disabled"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFavoritesStore } from '../stores/favorites'
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

const favoritesStore = useFavoritesStore()
const toast = useToast()
const isAnimating = ref(false)

const isFavorited = computed(() => favoritesStore.isFavorite(props.product.id))

const handleFavorite = async () => {
  if (props.disabled) return
  
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
}

.favorite-btn:hover {
  transform: scale(1.1);
  color: #ff6b6b;
}

.favorite-btn.active {
  color: #ff6b6b;
}

.favorite-btn.animated {
  animation: heartBeat 0.3s ease;
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
</style>