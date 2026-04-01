// stores/search.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  const selectedCategory = ref('')           // usamos o slug da categoria
  const sortBy = ref<'relevance' | 'price_asc' | 'price_desc'>('relevance')
  const recentSearches = ref<string[]>([])

  // ====================== HISTÓRICO ======================
  const loadRecentSearches = () => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) recentSearches.value = JSON.parse(saved)
  }

  const saveRecentSearches = () => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value.slice(0, 8)))
  }

  const addToRecentSearches = (query: string) => {
    if (!query?.trim()) return
    const q = query.trim()
    const index = recentSearches.value.indexOf(q)
    if (index !== -1) recentSearches.value.splice(index, 1)
    recentSearches.value.unshift(q)
    saveRecentSearches()
  }

  const clearRecentSearches = () => {
    recentSearches.value = []
    saveRecentSearches()
  }

  // ====================== FILTRO PRINCIPAL ======================
  const getFilteredResults = (products: Product[]) => {
    const term = searchQuery.value.toLowerCase().trim()
    const catFilter = selectedCategory.value.trim()

    return products.filter((product: Product) => {
      // Filtro por categoria (category é OBJETO)
      if (catFilter) {
        const productSlug = product.category?.slug || ''
        if (productSlug !== catFilter) return false
      }

      // Se não tem termo de busca → retorna todos (ou filtrado só por categoria)
      if (!term) return true

      // Busca segura no título, descrição e nome da categoria
      const titleMatch = product.title?.toLowerCase().includes(term) || false
      const descMatch = product.description?.toLowerCase().includes(term) || false
      const catNameMatch = product.category?.name?.toLowerCase().includes(term) || false

      return titleMatch || descMatch || catNameMatch
    })
  }

  return {
    searchQuery,
    selectedCategory,
    sortBy,
    recentSearches,
    getFilteredResults,
    addToRecentSearches,
    clearRecentSearches,
    loadRecentSearches,
  }
})