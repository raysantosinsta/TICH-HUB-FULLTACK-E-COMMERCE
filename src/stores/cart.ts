import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Cart } from '../models/cart.model'
import { useAuthStore } from './auth'
import type { Product } from '../types'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart>(new Cart()) // Instância da classe Cart
  const authStore = useAuthStore()

  // Computed properties (delegam para a classe)
  const items = computed(() => cart.value.items)
  const totalItems = computed(() => cart.value.getTotalItems())
  const subtotal = computed(() => cart.value.getSubtotal())
  const totalDiscount = computed(() => cart.value.getTotalDiscount())
  const totalWithDiscount = computed(() => cart.value.getTotalWithDiscount())

  // Frete (simulado) - lógica específica do store
  const shipping = computed(() => {
    return subtotal.value > 200 ? 0 : 15.90
  })

  // Desconto (simulado) - lógica específica do store
  const discount = computed(() => {
    return subtotal.value > 500 ? subtotal.value * 0.1 : 0
  })

  // Total final (com frete e desconto)
  const total = computed(() => {
    return subtotal.value + shipping.value - discount.value
  })

  // Obter chave do localStorage baseada no usuário
  const getStorageKey = () => {
    const userId = authStore.user?.id
    if (!userId) return null
    return `cart_user_${userId}`
  }

  // Carregar carrinho do localStorage
  const loadCart = () => {
    const storageKey = getStorageKey()
    
    if (storageKey) {
      // Usuário logado - carregar carrinho do usuário
      const savedCart = localStorage.getItem(storageKey)
      if (savedCart) {
        const data = JSON.parse(savedCart)
        cart.value = Cart.fromJSON(data)
      } else {
        cart.value = new Cart()
      }
    } else {
      // Visitante - carregar carrinho temporário
      const guestCart = localStorage.getItem('cart_guest')
      if (guestCart) {
        const data = JSON.parse(guestCart)
        cart.value = Cart.fromJSON(data)
      } else {
        cart.value = new Cart()
      }
    }
  }

  // Salvar carrinho no localStorage
  const saveCart = () => {
    const storageKey = getStorageKey()
    
    if (storageKey) {
      // Usuário logado - salvar no carrinho do usuário
      localStorage.setItem(storageKey, JSON.stringify(cart.value.toJSON()))
    } else {
      // Visitante - salvar no carrinho temporário
      localStorage.setItem('cart_guest', JSON.stringify(cart.value.toJSON()))
    }
  }

  // Adicionar ao carrinho
  const addToCart = (product: Product, quantity: number = 1) => {
    cart.value.addItem(product, quantity)
    saveCart()
    return true
  }

  // Remover do carrinho
  const removeFromCart = (productId: number) => {
    cart.value.removeItem(productId)
    saveCart()
  }

  // Atualizar quantidade
  const updateQuantity = (productId: number, quantity: number) => {
    cart.value.updateQuantity(productId, quantity)
    saveCart()
  }

  // Limpar carrinho
  const clearCart = () => {
    cart.value.clearCart()
    saveCart()
  }

  // Limpar carrinho do usuário (útil para logout)
  const clearUserCart = () => {
    cart.value.clearCart()
    const storageKey = getStorageKey()
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
    saveCart()
  }

  // Sincronizar com o usuário atual (ao fazer login/logout)
  const syncWithUser = () => {
    if (authStore.isAuthenticated) {
      // Usuário fez login
      const userId = authStore.user?.id
      const userCartKey = `cart_user_${userId}`
      const savedUserCart = localStorage.getItem(userCartKey)
      
      if (savedUserCart) {
        // Carregar carrinho do usuário
        const data = JSON.parse(savedUserCart)
        const userCart = Cart.fromJSON(data)
        
        // Se tinha carrinho de convidado, mesclar
        const guestCart = localStorage.getItem('cart_guest')
        if (guestCart) {
          const guestData = JSON.parse(guestCart)
          const guestCartObj = Cart.fromJSON(guestData)
          userCart.mergeWith(guestCartObj)
          // Remover carrinho de convidado
          localStorage.removeItem('cart_guest')
        }
        
        cart.value = userCart
      } else {
        // Usuário não tinha carrinho, verificar se tem carrinho de convidado
        const guestCart = localStorage.getItem('cart_guest')
        if (guestCart) {
          const guestData = JSON.parse(guestCart)
          cart.value = Cart.fromJSON(guestData)
          // Remover carrinho de convidado
          localStorage.removeItem('cart_guest')
        } else {
          cart.value = new Cart()
        }
      }
      
      saveCart()
    } else {
      // Usuário fez logout - carregar carrinho de convidado se existir
      const guestCart = localStorage.getItem('cart_guest')
      if (guestCart) {
        const data = JSON.parse(guestCart)
        cart.value = Cart.fromJSON(data)
      } else {
        cart.value = new Cart()
      }
    }
  }

  // Obter carrinho atual (para uso em outros lugares)
  const getCurrentCart = () => cart.value

  // Verificar se carrinho está vazio
  const isEmpty = computed(() => cart.value.getTotalItems() === 0)

  // Carregar carrinho ao iniciar
  loadCart()

  return {
    // Estado
    items,
    totalItems,
    subtotal,
    totalDiscount,
    totalWithDiscount,
    shipping,
    discount,
    total,
    isEmpty,
    
    // Actions
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUserCart,
    syncWithUser,
    getCurrentCart
  }
})