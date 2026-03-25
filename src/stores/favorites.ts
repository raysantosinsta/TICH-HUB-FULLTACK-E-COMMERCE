import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import type { Product } from '../types'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Product[]>([])
  const loading = ref(false)
  const authStore = useAuthStore()

  // Computed: total de favoritos
  const totalFavorites = computed(() => favorites.value.length)

  // Chave para armazenamento baseada no usuário
  const getStorageKey = (userId?: number) => {
    const uid = userId || authStore.user?.id
    return uid ? `favorites_user_${uid}` : null
  }

  // Carregar favoritos do localStorage do usuário atual
  const loadFavorites = () => {
    if (!authStore.isAuthenticated) {
      favorites.value = []
      return
    }

    loading.value = true
    try {
      const storageKey = getStorageKey()
      if (!storageKey) {
        favorites.value = []
        return
      }
      
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        favorites.value = JSON.parse(saved)
        console.log(`Favoritos carregados para usuário ${authStore.user?.id}:`, favorites.value.length)
      } else {
        favorites.value = []
        console.log(`Nenhum favorito encontrado para usuário ${authStore.user?.id}`)
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
      favorites.value = []
    } finally {
      loading.value = false
    }
  }

  // Salvar favoritos no localStorage do usuário atual
  const saveFavorites = () => {
    if (!authStore.isAuthenticated) {
      console.warn('Tentativa de salvar favoritos sem usuário autenticado')
      return
    }

    const storageKey = getStorageKey()
    if (!storageKey) return
    
    localStorage.setItem(storageKey, JSON.stringify(favorites.value))
    console.log(`Favoritos salvos para usuário ${authStore.user?.id}:`, favorites.value.length)
  }

  // Verificar se produto está favoritado
  const isFavorite = (productId: number): boolean => {
    return favorites.value.some(item => item.id === productId)
  }

  // Adicionar aos favoritos
  const addToFavorites = (product: Product) => {
    if (!authStore.isAuthenticated) {
      console.warn('Tentativa de adicionar favorito sem usuário autenticado')
      return false
    }

    if (!isFavorite(product.id)) {
      favorites.value.push(product)
      saveFavorites()
      console.log(`Produto ${product.id} adicionado aos favoritos`)
      return true
    }
    return false
  }

  // Remover dos favoritos
  const removeFromFavorites = (productId: number) => {
    if (!authStore.isAuthenticated) {
      console.warn('Tentativa de remover favorito sem usuário autenticado')
      return false
    }

    const index = favorites.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
      console.log(`Produto ${productId} removido dos favoritos`)
      return true
    }
    return false
  }

  // Toggle favorito
  const toggleFavorite = (product: Product): boolean => {
    if (!authStore.isAuthenticated) {
      console.warn('Tentativa de toggle favorito sem usuário autenticado')
      return false
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
      return false
    } else {
      addToFavorites(product)
      return true
    }
  }

  // Limpar todos os favoritos do usuário atual
  const clearFavorites = () => {
    if (!authStore.isAuthenticated) {
      console.warn('Tentativa de limpar favoritos sem usuário autenticado')
      return
    }

    console.log('clearFavorites called, before:', favorites.value.length)
    favorites.value = []
    saveFavorites()
    console.log('clearFavorites after:', favorites.value.length)
  }

  // Limpar favoritos de um usuário específico (útil para logout)
  const clearUserFavorites = (userId?: number) => {
    const storageKey = getStorageKey(userId)
    if (storageKey) {
      localStorage.removeItem(storageKey)
      console.log(`Favoritos do usuário ${userId} removidos do localStorage`)
    }
  }

  // Sincronizar favoritos com o usuário atual
  const syncWithUser = () => {
    if (authStore.isAuthenticated) {
      loadFavorites()
    } else {
      favorites.value = []
    }
  }

  // Carregar favoritos ao iniciar se usuário estiver logado
  if (authStore.isAuthenticated) {
    loadFavorites()
  }

  return {
    // Estado
    favorites,
    loading,
    
    // Computed
    totalFavorites,
    isFavorite,
    
    // Actions
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    clearUserFavorites,
    syncWithUser
  }
})