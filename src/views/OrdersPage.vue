<template>
  <div class="orders-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Meus Pedidos
        </h1>
        <p class="orders-count">{{ totalOrders }} pedido(s) realizado(s)</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando seus pedidos...</p>
      </div>

      <!-- Lista de Pedidos -->
      <div v-else-if="orders.length > 0" class="orders-list">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="order-card"
          :class="{ 'highlight': route.query.orderId === order.id }"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">Pedido {{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.date) }}</span>
            </div>
            <div class="order-status" :style="{ color: statusBadge(order.status).color, background: statusBadge(order.status).bg }">
              {{ statusBadge(order.status).text }}
            </div>
          </div>

          <div class="order-products">
            <div 
              v-for="product in order.products.slice(0, 3)" 
              :key="product.id"
              class="order-product"
              @click="goToProduct(product.id)"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
              </div>
              <div class="product-details">
                <h4 class="product-name">{{ truncateTitle(product.name, 40) }}</h4>
                <div class="product-meta">
                  <span class="product-quantity">Qtd: {{ product.quantity }}</span>
                  <span class="product-price">R$ {{ formatPrice(product.price) }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="order.products.length > 3" class="more-products">
              + {{ order.products.length - 3 }} outro(s) produto(s)
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span>Total do pedido</span>
              <strong>R$ {{ formatPrice(order.total) }}</strong>
            </div>
            <button class="order-details-btn" @click="viewOrderDetails(order)">
              Ver detalhes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else-if="!loading" class="empty-orders">
        <div class="empty-content">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <h2>Você ainda não possui pedidos</h2>
          <p>Comece suas compras e acompanhe seus pedidos aqui.</p>
          <router-link to="/products" class="explore-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Explorar produtos
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Pedido -->
    <div v-if="selectedOrder" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalhes do Pedido</h2>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="order-info-detail">
            <div class="info-row">
              <span>Número do pedido:</span>
              <strong>{{ selectedOrder.id }}</strong>
            </div>
            <div class="info-row">
              <span>Data:</span>
              <strong>{{ formatDate(selectedOrder.date) }}</strong>
            </div>
            <div class="info-row">
              <span>Status:</span>
              <span class="status-badge" :style="{ color: statusBadge(selectedOrder.status).color, background: statusBadge(selectedOrder.status).bg }">
                {{ statusBadge(selectedOrder.status).text }}
              </span>
            </div>
            <div class="info-row" v-if="selectedOrder.trackingCode">
              <span>Código de rastreio:</span>
              <strong>{{ selectedOrder.trackingCode }}</strong>
            </div>
          </div>

          <div class="timeline">
            <div class="timeline-step" :class="{ active: selectedOrder.status !== 'cancelled' }">
              <div class="step-icon">✓</div>
              <div class="step-info">
                <strong>Pedido confirmado</strong>
                <span>{{ formatDate(selectedOrder.date) }}</span>
              </div>
            </div>
            <div class="timeline-step" :class="{ active: selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' }">
              <div class="step-icon">📦</div>
              <div class="step-info">
                <strong>Processando</strong>
                <span>Aguardando separação</span>
              </div>
            </div>
            <div class="timeline-step" :class="{ active: selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' }">
              <div class="step-icon">🚚</div>
              <div class="step-info">
                <strong>Enviado</strong>
                <span>Produto a caminho</span>
              </div>
            </div>
            <div class="timeline-step" :class="{ active: selectedOrder.status === 'delivered' }">
              <div class="step-icon">🏠</div>
              <div class="step-info">
                <strong>Entregue</strong>
                <span>Produto entregue</span>
              </div>
            </div>
          </div>

          <div class="products-list">
            <h3>Produtos</h3>
            <div v-for="product in selectedOrder.products" :key="product.id" class="product-item">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
              </div>
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-meta">
                  <span>R$ {{ formatPrice(product.price) }}</span>
                  <span>Qtd: {{ product.quantity }}</span>
                  <span>Subtotal: R$ {{ formatPrice(product.price * product.quantity) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-summary-detail">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>R$ {{ formatPrice(selectedOrder.subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Frete:</span>
              <span>R$ {{ formatPrice(selectedOrder.shipping) }}</span>
            </div>
            <div v-if="selectedOrder.discount > 0" class="summary-row discount">
              <span>Desconto:</span>
              <span>- R$ {{ formatPrice(selectedOrder.discount) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>R$ {{ formatPrice(selectedOrder.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrdersStore } from '../stores/orders'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import type { Order } from '../stores/orders'

const router = useRouter()
const route = useRoute()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const toast = useToast()

const selectedOrder = ref<Order | null>(null)
const loading = ref(true)

const orders = computed(() => ordersStore.orders)
const totalOrders = computed(() => ordersStore.totalOrders)

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const formatDate = (dateString: string) => {
  return ordersStore.formatDate(dateString)
}

const statusBadge = (status: Order['status']) => {
  return ordersStore.getStatusBadge(status)
}

const truncateTitle = (title: string, length: number = 60) => {
  if (title.length > length) {
    return title.substring(0, length - 3) + '...'
  }
  return title
}

const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`)
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
}

const closeModal = () => {
  selectedOrder.value = null
}

// Observar mudanças na autenticação
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loading.value = true
    ordersStore.syncWithUser()
    setTimeout(() => {
      loading.value = false
    }, 500)
  } else {
    router.push('/login')
  }
})

// Observar pedidos carregados
watch(() => orders.value, () => {
  // Se tiver orderId na URL e pedidos carregados, abrir modal do pedido
  if (route.query.orderId && orders.value.length > 0 && !selectedOrder.value) {
    const orderId = route.query.orderId as string
    const order = ordersStore.getOrderById(orderId)
    if (order) {
      setTimeout(() => {
        selectedOrder.value = order
      }, 300)
    }
  }
})

// Carregar dados
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    toast.info('Login necessário', 'Faça login para visualizar seus pedidos.', 3000)
    router.push('/login')
    return
  }
  
  loading.value = true
  ordersStore.syncWithUser()
  
  // Pequeno delay para garantir que os dados foram carregados
  setTimeout(() => {
    loading.value = false
    
    // Se tiver orderId na URL, abrir modal do pedido
    if (route.query.orderId) {
      const orderId = route.query.orderId as string
      const order = ordersStore.getOrderById(orderId)
      if (order) {
        selectedOrder.value = order
      } else {
        toast.info('Pedido não encontrado', 'O pedido que você tentou acessar não foi encontrado.', 3000)
      }
    }
  }, 500)
})
</script>

<style scoped>
.orders-page {
  position: relative;
  min-height: 100vh;
  padding: 40px 0 80px;
}

.bg-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
}

.light-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.1) 40%,
    rgba(212, 175, 55, 0.15) 45%,
    rgba(212, 175, 55, 0.2) 50%,
    rgba(212, 175, 55, 0.15) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweep 15s ease-in-out infinite;
}

@keyframes lightSweep {
  0% { background-position: -100% 0%; opacity: 0; }
  20% { opacity: 0.5; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  100% { background-position: 200% 0%; opacity: 0; }
}

.glass-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(2px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 2rem;
  color: var(--white-soft);
  margin-bottom: 8px;
}

.orders-count {
  color: rgba(245, 240, 230, 0.6);
  font-size: 1rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: var(--gold-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: rgba(245, 240, 230, 0.7);
  font-size: 1rem;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  border-color: var(--gold-primary);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1);
}

.order-card.highlight {
  border-color: var(--gold-primary);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(212, 175, 55, 0.05);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-weight: 600;
  color: var(--gold-primary);
  font-size: 0.9rem;
}

.order-date {
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.5);
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.order-products {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.order-product {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.order-product:hover {
  background: rgba(212, 175, 55, 0.05);
  padding-left: 8px;
}

.product-image {
  width: 60px;
  height: 60px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 0.9rem;
  color: var(--white-soft);
  margin-bottom: 4px;
}

.product-meta {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.5);
}

.more-products {
  text-align: center;
  padding: 12px;
  color: rgba(245, 240, 230, 0.5);
  font-size: 0.8rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  margin-top: 12px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-total span {
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.5);
}

.order-total strong {
  font-size: 1.2rem;
  color: var(--gold-primary);
}

.order-details-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 8px 20px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.order-details-btn:hover {
  background: var(--gold-primary);
  color: var(--black-primary);
  transform: translateY(-2px);
}

/* Empty State */
.empty-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  text-align: center;
}

.empty-content {
  animation: fadeInUp 0.5s ease;
}

.empty-content svg {
  color: rgba(245, 240, 230, 0.3);
  margin-bottom: 24px;
}

.empty-orders h2 {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.empty-orders p {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 24px;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.modal-header h2 {
  color: var(--white-soft);
  font-size: 1.3rem;
}

.modal-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(245, 240, 230, 0.5);
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--white-soft);
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
}

.order-info-detail {
  background: rgba(212, 175, 55, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row span {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
}

.info-row strong {
  color: var(--white-soft);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.timeline {
  margin-bottom: 24px;
}

.timeline-step {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  position: relative;
  opacity: 0.5;
}

.timeline-step.active {
  opacity: 1;
}

.timeline-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 40px;
  width: 2px;
  height: 40px;
  background: rgba(212, 175, 55, 0.3);
}

.timeline-step.active:not(:last-child)::before {
  background: var(--gold-primary);
}

.step-icon {
  width: 40px;
  height: 40px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--gold-primary);
}

.timeline-step.active .step-icon {
  background: var(--gold-primary);
  color: var(--black-primary);
}

.step-info {
  flex: 1;
}

.step-info strong {
  display: block;
  color: var(--white-soft);
  margin-bottom: 4px;
}

.step-info span {
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.5);
}

.products-list h3 {
  color: var(--white-soft);
  margin-bottom: 16px;
  font-size: 1rem;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.product-item .product-image {
  width: 60px;
  height: 60px;
}

.product-item .product-info {
  flex: 1;
}

.product-item .product-name {
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.order-summary-detail {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.order-summary-detail .summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: rgba(245, 240, 230, 0.8);
}

.order-summary-detail .summary-row.total {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--gold-primary);
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .order-header,
  .order-products,
  .order-footer {
    padding: 16px;
  }

  .order-footer {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .order-details-btn {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .modal-body {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .order-product {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }

  .product-meta {
    justify-content: center;
  }
}
</style>