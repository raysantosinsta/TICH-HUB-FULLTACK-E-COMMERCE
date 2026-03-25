import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import type { Product } from '../types'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const authStore = useAuthStore()

  // Obter chave do localStorage baseada no usuário
  const getStorageKey = () => {
    const userId = authStore.user?.id
    if (!userId) return null
    return `cart_user_${userId}`
  }

  // Carregar carrinho do localStorage do usuário
  const loadCart = () => {
    const storageKey = getStorageKey()
    if (!storageKey) {
      items.value = []
      return
    }

    const savedCart = localStorage.getItem(storageKey)
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    } else {
      items.value = []
    }
  }

  // Salvar carrinho no localStorage do usuário
  const saveCart = () => {
    const storageKey = getStorageKey()
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(items.value))
  }

  // Adicionar item ao carrinho
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!authStore.isAuthenticated) {
      console.warn('Tentativa de adicionar ao carrinho sem usuário logado')
      return false
    }

    const existingItem = items.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    
    saveCart()
    return true
  }

  // Remover item do carrinho
  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  // Atualizar quantidade
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  // Limpar carrinho
  const clearCart = () => {
    items.value = []
    saveCart()
  }

  // Limpar carrinho do usuário (útil para logout)
  const clearUserCart = () => {
    items.value = []
    const storageKey = getStorageKey()
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
  }

  // Sincronizar com o usuário atual
  const syncWithUser = () => {
    if (authStore.isAuthenticated) {
      loadCart()
    } else {
      items.value = []
    }
  }

  // Computed: total de itens
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Computed: subtotal
  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  })

  // Computed: frete (simulado)
  const shipping = computed(() => {
    return subtotal.value > 200 ? 0 : 15.90
  })

  // Computed: desconto (simulado)
  const discount = computed(() => {
    return subtotal.value > 500 ? subtotal.value * 0.1 : 0
  })

  // Computed: total final
  const total = computed(() => {
    return subtotal.value + shipping.value - discount.value
  })

  return {
    items,
    totalItems,
    subtotal,
    shipping,
    discount,
    total,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUserCart,
    syncWithUser
  }
})