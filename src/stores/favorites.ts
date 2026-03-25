import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '../types'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Product[]>([])

  // Carregar favoritos do localStorage
  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      favorites.value = JSON.parse(saved)
    }
  }

  // Salvar favoritos no localStorage
  const saveFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  // Verificar se produto está favoritado
  const isFavorite = (productId: number): boolean => {
    return favorites.value.some(item => item.id === productId)
  }

  // Adicionar aos favoritos
  const addToFavorites = (product: Product) => {
    if (!isFavorite(product.id)) {
      favorites.value.push(product)
      saveFavorites()
      return true
    }
    return false
  }

  // Remover dos favoritos
  const removeFromFavorites = (productId: number) => {
    const index = favorites.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
      return true
    }
    return false
  }

  // Toggle favorito
  const toggleFavorite = (product: Product): boolean => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
      return false
    } else {
      addToFavorites(product)
      return true
    }
  }

  // Limpar todos os favoritos
 // src/stores/favorites.ts
const clearFavorites = () => {
  console.log('clearFavorites called, before:', favorites.value.length)
  favorites.value = []
  saveFavorites()
  console.log('clearFavorites after:', favorites.value.length)
}

  // Computed: total de favoritos
  const totalFavorites = computed(() => favorites.value.length)

  return {
    favorites,
    totalFavorites,
    loadFavorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites
  }
})