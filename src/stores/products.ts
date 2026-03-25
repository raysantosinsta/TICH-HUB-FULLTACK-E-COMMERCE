import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Product } from '../models/product.model'
import type { ProductRating } from '../models/product.model'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<string>('')

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('https://fakestoreapi.com/products')
      if (!response.ok) throw new Error('Erro ao carregar produtos')
      const data = await response.json()
      products.value = Product.fromAPIList(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('Erro:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProductsByCategory = async (category: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`)
      if (!response.ok) throw new Error('Erro ao carregar produtos')
      const data = await response.json()
      products.value = Product.fromAPIList(data)
      selectedCategory.value = category
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    } finally {
      loading.value = false
    }
  }

  // Método para buscar produtos por categoria (filtra localmente)
  const getProductsByCategory = (category: string): Product[] => {
    return products.value.filter(p => p.category === category)
  }

  const getProductById = (id: number): Product | undefined => {
    return products.value.find(p => p.id === id)
  }

  const featuredProducts = computed(() => products.value.slice(0, 8))
  
  const categories = computed(() => {
    const cats = [...new Set(products.value.map(p => p.category))]
    return cats
  })

  const productsByCategory = computed(() => {
    if (!selectedCategory.value) return products.value
    return products.value.filter(p => p.category === selectedCategory.value)
  })

  return {
    products,
    loading,
    error,
    selectedCategory,
    featuredProducts,
    categories,
    productsByCategory,
    fetchProducts,
    fetchProductsByCategory,
    getProductById,
    getProductsByCategory 
  }
})