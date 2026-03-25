import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '../types'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // Carregar carrinho do localStorage
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }

  // Salvar carrinho no localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // Adicionar item ao carrinho
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    
    saveCart()
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
    clearCart
  }
})