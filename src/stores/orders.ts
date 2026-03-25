import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '../types'

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  category?: string
}

export interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  shipping: number
  discount: number
  products: OrderItem[]
  paymentMethod?: string
  trackingCode?: string
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])

  // Carregar pedidos do localStorage
  const loadOrders = () => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      orders.value = JSON.parse(savedOrders)
    }
  }

  // Salvar pedidos no localStorage
  const saveOrders = () => {
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  // Criar novo pedido
  const createOrder = (
    products: OrderItem[],
    subtotal: number,
    shipping: number,
    discount: number,
    total: number
  ): Order => {
    const now = new Date()
    const orderId = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(orders.value.length + 1).padStart(4, '0')}`

    const newOrder: Order = {
      id: orderId,
      date: now.toISOString(),
      status: 'processing',
      total,
      subtotal,
      shipping,
      discount,
      products,
      trackingCode: `BR${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    }

    orders.value.unshift(newOrder) // Adicionar no início do array
    saveOrders()
    return newOrder
  }

  // Atualizar status do pedido
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      saveOrders()
    }
  }

  // Obter pedido por ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.value.find(o => o.id === orderId)
  }

  // Contagem de pedidos
  const totalOrders = computed(() => orders.value.length)

  // Status do pedido para exibição
  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: { text: 'Aguardando pagamento', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)' },
      processing: { text: 'Processando', color: '#2196f3', bg: 'rgba(33, 150, 243, 0.1)' },
      shipped: { text: 'Enviado', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.1)' },
      delivered: { text: 'Entregue', color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.1)' },
      cancelled: { text: 'Cancelado', color: '#ff6b6b', bg: 'rgba(255, 107, 107, 0.1)' }
    }
    return badges[status]
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    orders,
    totalOrders,
    loadOrders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getStatusBadge,
    formatDate
  }
})