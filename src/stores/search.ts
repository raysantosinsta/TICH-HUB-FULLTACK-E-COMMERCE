import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  const searchResults = ref<Product[]>([])
  const isSearching = ref(false)
  const recentSearches = ref<string[]>([])
  const selectedCategory = ref<string>('')
  const sortBy = ref<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance')

  // Carregar histórico do localStorage
  const loadRecentSearches = () => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  }

  // Salvar histórico no localStorage
  const saveRecentSearches = () => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value.slice(0, 5)))
  }

  // Adicionar busca ao histórico
  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return
    
    const index = recentSearches.value.indexOf(query)
    if (index !== -1) {
      recentSearches.value.splice(index, 1)
    }
    recentSearches.value.unshift(query)
    saveRecentSearches()
  }

  // Limpar histórico
  const clearRecentSearches = () => {
    recentSearches.value = []
    saveRecentSearches()
  }

  // Função de busca
  const searchProducts = (products: Product[], query: string, category?: string) => {
    // If no query and no category, return empty array
    if (!query.trim() && !category) {
      return []
    }

    const searchTerm = query.toLowerCase().trim()
    
    return products.filter(product => {
      // Filtro por categoria
      if (category && product.category !== category) {
        return false
      }
      
      // Se não há termo de busca, retorna apenas produtos da categoria
      if (!searchTerm) {
        return true
      }
      
      // Busca por nome, categoria ou descrição
      return (
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      )
    })
  }

  // Ordenar resultados
  const sortResults = (results: Product[]) => {
    const sorted = [...results]
    
    switch (sortBy.value) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'rating':
        return sorted.sort((a, b) => b.rating.rate - a.rating.rate)
      default:
        return sorted
    }
  }

  // Computed para resultados filtrados
  const getFilteredResults = (products: Product[]) => {
    let results = searchProducts(products, searchQuery.value, selectedCategory.value)
    results = sortResults(results)
    return results
  }

  // Resetar busca
  const resetSearch = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
    sortBy.value = 'relevance'
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    recentSearches,
    selectedCategory,
    sortBy,
    loadRecentSearches,
    addToRecentSearches,
    clearRecentSearches,
    getFilteredResults,
    resetSearch
  }
})