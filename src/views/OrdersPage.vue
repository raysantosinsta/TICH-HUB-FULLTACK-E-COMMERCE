<template>
  <div class="orders-page-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="order-particles">
        <div v-for="i in 40" :key="i" class="order-particle" :style="getParticleStyle(i)">
          📦
        </div>
      </div>
    </div>

    <div class="container-premium">
      <div class="page-header-premium">
        <div class="header-content-premium">
          <div class="title-wrapper-premium">
            <div class="title-icon-premium">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
                <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <div class="icon-glow"></div>
            </div>
            <h1 class="page-title-premium">Meus <span class="gold-text">Pedidos</span></h1>
          </div>
          <div class="orders-count-premium">
            <span class="count-badge">{{ totalOrders }}</span>
            <span class="count-text">{{ totalOrders === 1 ? 'pedido realizado' : 'pedidos realizados' }}</span>
          </div>
        </div>
      </div>

      <!-- Loading State Premium -->
      <div v-if="loading" class="loading-state-premium">
        <div class="loading-box">
          <div class="package-loader">
            <div class="package"></div>
            <div class="package-shadow"></div>
          </div>
          <p class="loading-text-premium">Carregando seus pedidos...</p>
        </div>
      </div>

      <!-- Lista de Pedidos Premium -->
      <div v-else-if="orders.length > 0" class="orders-list-premium">
        <transition-group name="order-card" tag="div" class="orders-grid-premium">
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="order-card-premium"
            :class="{ 'highlight': route.query.orderId === order.id }"
          >
            <div class="card-glow"></div>
            
            <div class="order-header-premium">
              <div class="order-info-premium">
                <div class="order-id-premium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  Pedido #{{ order.id }}
                </div>
                <div class="order-date-premium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H21M8 3V6M16 3V6M4 12H20M7 18H9M12 18H14" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  {{ formatDate(order.date) }}
                </div>
              </div>
              <div class="order-status-premium" :class="order.status">
                <span class="status-dot"></span>
                {{ statusBadge(order.status).text }}
              </div>
            </div>

            <div class="order-products-premium">
              <div 
                v-for="product in order.products.slice(0, 2)" 
                :key="product.id"
                class="order-product-premium"
                @click="goToProduct(product.id)"
              >
                <div class="product-image-premium">
                  <div class="image-wrapper-premium">
                    <img :src="product.image" :alt="product.name">
                    <div class="image-shine"></div>
                  </div>
                </div>
                <div class="product-details-premium">
                  <h4 class="product-name-premium">{{ truncateTitle(product.name, 35) }}</h4>
                  <div class="product-meta-premium">
                    <span class="product-quantity">Qtd: {{ product.quantity }}</span>
                    <span class="product-price">{{ formatPrice(product.price) }}</span>
                  </div>
                </div>
              </div>
              
              <div v-if="order.products.length > 2" class="more-products-premium">
                <span>+ {{ order.products.length - 2 }} outro(s) produto(s)</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <div class="order-footer-premium">
              <div class="order-total-premium">
                <span>Total do pedido</span>
                <strong>{{ formatPrice(order.total) }}</strong>
              </div>
              <button class="order-details-btn-premium" @click="viewOrderDetails(order)">
                <span>Ver detalhes</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Estado Vazio Premium -->
      <div v-else-if="!loading" class="empty-orders-premium">
        <div class="empty-card-premium">
          <div class="empty-animation">
            <div class="empty-box">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
                <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <div class="floating-packages">
                <span>📦</span>
                <span>📦</span>
                <span>📦</span>
              </div>
            </div>
          </div>
          <h2 class="empty-title">Nenhum pedido encontrado</h2>
          <p class="empty-description">Você ainda não realizou nenhuma compra. Comece agora e acompanhe seus pedidos aqui!</p>
          <router-link to="/products" class="explore-btn-premium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"/>
            </svg>
            Explorar produtos
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Pedido Premium -->
    <div v-if="selectedOrder" class="modal-overlay-premium" @click="closeModal">
      <div class="modal-content-premium" @click.stop>
        <div class="modal-header-premium">
          <h2 class="modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Detalhes do Pedido
          </h2>
          <button class="modal-close-premium" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <div class="modal-body-premium">
          <div class="order-info-card-premium">
            <div class="info-row-premium">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Número do pedido
              </span>
              <strong>#{{ selectedOrder.id }}</strong>
            </div>
            <div class="info-row-premium">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21M8 3V6M16 3V6M4 12H20M7 18H9M12 18H14" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Data
              </span>
              <strong>{{ formatDate(selectedOrder.date) }}</strong>
            </div>
            <div class="info-row-premium">
              <span class="info-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
                </svg>
                Status
              </span>
              <div class="order-status-modal" :class="selectedOrder.status">
                <span class="status-dot"></span>
                {{ statusBadge(selectedOrder.status).text }}
              </div>
            </div>
          </div>

          <div class="timeline-premium">
            <div class="timeline-step-premium" :class="{ active: selectedOrder.status !== 'cancelled' }">
              <div class="step-icon-premium">✓</div>
              <div class="step-content-premium">
                <strong>Pedido confirmado</strong>
                <span>{{ formatDate(selectedOrder.date) }}</span>
              </div>
            </div>
            <div class="timeline-step-premium" :class="{ active: ['processing', 'shipped', 'delivered'].includes(selectedOrder.status) }">
              <div class="step-icon-premium">📦</div>
              <div class="step-content-premium">
                <strong>Processando</strong>
                <span>Aguardando separação</span>
              </div>
            </div>
            <div class="timeline-step-premium" :class="{ active: ['shipped', 'delivered'].includes(selectedOrder.status) }">
              <div class="step-icon-premium">🚚</div>
              <div class="step-content-premium">
                <strong>Enviado</strong>
                <span>Produto a caminho</span>
              </div>
            </div>
            <div class="timeline-step-premium" :class="{ active: selectedOrder.status === 'delivered' }">
              <div class="step-icon-premium">🏠</div>
              <div class="step-content-premium">
                <strong>Entregue</strong>
                <span>Produto entregue com sucesso</span>
              </div>
            </div>
          </div>

          <div class="products-section-premium">
            <h3 class="section-title-premium">Produtos</h3>
            <div class="products-list-modal-premium">
              <div v-for="product in selectedOrder.products" :key="product.id" class="product-item-modal-premium">
                <div class="product-image-modal">
                  <img :src="product.image" :alt="product.name">
                </div>
                <div class="product-info-modal">
                  <div class="product-name-modal">{{ product.name }}</div>
                  <div class="product-meta-modal">
                    <span>{{ formatPrice(product.price) }}</span>
                    <span>Qtd: {{ product.quantity }}</span>
                    <span class="product-subtotal">Subtotal: {{ formatPrice(product.price * product.quantity) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="order-summary-modal-premium">
            <div class="summary-row-modal">
              <span>Subtotal</span>
              <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
            </div>
            <div class="summary-row-modal">
              <span>Frete</span>
              <span>{{ selectedOrder.shipping === 0 ? 'Grátis' : formatPrice(selectedOrder.shipping) }}</span>
            </div>
            <div v-if="selectedOrder.discount > 0" class="summary-row-modal discount">
              <span>Desconto</span>
              <span>- {{ formatPrice(selectedOrder.discount) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row-modal total">
              <span>Total</span>
              <span class="total-value-modal">{{ formatPrice(selectedOrder.total) }}</span>
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

const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${12 + Math.random() * 15}s`,
    opacity: 0.1 + Math.random() * 0.3
  }
}

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
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
}

const closeModal = () => {
  selectedOrder.value = null
}

const loadOrdersData = async () => {
  if (!authStore.isAuthenticated) return
  
  loading.value = true
  
  try {
    ordersStore.syncWithUser()
    
    setTimeout(() => {
      loading.value = false
      
      if (route.query.orderId) {
        const orderId = route.query.orderId as string
        const order = ordersStore.getOrderById(orderId)
        if (order) {
          selectedOrder.value = order
        } else {
          toast.info('Pedido não encontrado', 'O pedido que você tentou acessar não foi encontrado.', 3000)
        }
      }
    }, 300)
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error)
    toast.error('Erro', 'Não foi possível carregar seus pedidos.', 3000)
    loading.value = false
  }
}

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadOrdersData()
  } else {
    router.push('/login')
  }
})

watch(() => orders.value.length, () => {
  if (authStore.isAuthenticated && !loading.value) {
    loadOrdersData()
  }
})

onMounted(() => {
  if (!authStore.isAuthenticated) {
    toast.info('Login necessário', 'Faça login para visualizar seus pedidos.', 3000)
    router.push('/login')
    return
  }
  
  loadOrdersData()
})
</script>

<style scoped>
/* ========== ORDERS PAGE PREMIUM ========== */
.orders-page-premium {
  position: relative;
  min-height: 100vh;
  padding: 60px 0 100px;
  overflow-x: hidden;
}

/* Background Premium */
.bg-premium-advanced {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
  overflow: hidden;
}

.bg-gradient-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0B0B0F 0%, #13131A 100%);
  animation: gradientPulseOrders 8s ease-in-out infinite;
}

@keyframes gradientPulseOrders {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.light-sweep-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.12) 40%,
    rgba(212, 175, 55, 0.18) 45%,
    rgba(212, 175, 55, 0.22) 50%,
    rgba(212, 175, 55, 0.18) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweepOrders 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepOrders {
  0% { background-position: -100% 0%; opacity: 0; }
  20% { opacity: 0.5; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  100% { background-position: 200% 0%; opacity: 0; }
}

.glass-overlay-advanced {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.55);
  backdrop-filter: blur(2px);
}

.order-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.order-particle {
  position: absolute;
  font-size: 14px;
  animation: floatOrderParticle linear infinite;
  opacity: 0;
}

@keyframes floatOrderParticle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Container Premium */
.container-premium {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}

/* Page Header Premium */
.page-header-premium {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content-premium {
  position: relative;
}

.title-wrapper-premium {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.title-icon-premium {
  position: relative;
  color: var(--gold-primary);
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
  animation: iconPulseOrders 1.5s ease-in-out infinite;
}

@keyframes iconPulseOrders {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: iconGlowOrders 2s ease-in-out infinite;
}

@keyframes iconGlowOrders {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.page-title-premium {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-title-premium .gold-text {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.orders-count-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.count-badge {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 2px 10px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: bold;
}

.count-text {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.9rem;
}

/* Loading State Premium */
.loading-state-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.loading-box {
  text-align: center;
}

.package-loader {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.package {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  position: absolute;
  top: 15px;
  left: 15px;
  animation: packageBounce 0.8s ease-in-out infinite;
  border-radius: 8px;
}

.package-shadow {
  width: 50px;
  height: 10px;
  background: rgba(212, 175, 55, 0.3);
  position: absolute;
  bottom: -5px;
  left: 15px;
  border-radius: 50%;
  filter: blur(4px);
  animation: packageShadow 0.8s ease-in-out infinite;
}

@keyframes packageBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes packageShadow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(0.8);
    opacity: 0.3;
  }
}

.loading-text-premium {
  color: rgba(245, 240, 230, 0.7);
  font-size: 1rem;
  letter-spacing: 1px;
}

/* Orders Grid Premium */
.orders-list-premium {
  animation: fadeInUp 0.6s ease;
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

.orders-grid-premium {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Order Card Premium */
.order-card-premium {
  position: relative;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 28px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.order-card-premium:hover {
  transform: translateY(-4px);
  border-color: var(--gold-primary);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
}

.order-card-premium.highlight {
  border-color: var(--gold-primary);
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  animation: highlightPulse 0.5s ease;
}

@keyframes highlightPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.card-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.08), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.order-card-premium:hover .card-glow {
  left: 100%;
}

/* Order Header */
.order-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(212, 175, 55, 0.05);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.order-info-premium {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-id-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--gold-primary);
  font-size: 0.9rem;
}

.order-date-premium {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
}

.order-status-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold-primary);
}

.order-status-premium.pending {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.order-status-premium.processing {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.order-status-premium.shipped {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.order-status-premium.delivered {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.order-status-premium.cancelled {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulseDot 1.5s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Order Products */
.order-products-premium {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.order-product-premium {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
}

.order-product-premium:hover {
  background: rgba(212, 175, 55, 0.05);
  transform: translateX(5px);
}

.product-image-premium {
  width: 70px;
  height: 70px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.image-wrapper-premium {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.product-image-premium img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
  transition: transform 0.4s ease;
}

.order-product-premium:hover .product-image-premium img {
  transform: scale(1.1);
}

.image-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.order-product-premium:hover .image-shine {
  left: 100%;
}

.product-details-premium {
  flex: 1;
}

.product-name-premium {
  font-size: 0.9rem;
  color: var(--white-soft);
  margin-bottom: 6px;
  font-weight: 500;
}

.product-meta-premium {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.5);
}

.product-price {
  color: var(--gold-primary);
}

.more-products-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(212, 175, 55, 0.05);
  border-radius: 30px;
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.75rem;
  margin-top: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.more-products-premium:hover {
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold-primary);
  transform: translateX(3px);
}

/* Order Footer */
.order-footer-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

.order-total-premium {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-total-premium span {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-total-premium strong {
  font-size: 1.2rem;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.order-details-btn-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 1.5px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 10px 24px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.order-details-btn-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.4s ease;
}

.order-details-btn-premium:hover::before {
  left: 100%;
}

.order-details-btn-premium:hover {
  background: var(--gold-primary);
  color: var(--black-primary);
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

/* Empty State Premium */
.empty-orders-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.empty-card-premium {
  max-width: 500px;
  width: 100%;
  padding: 48px 40px;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  text-align: center;
  animation: fadeInUp 0.6s ease;
  transition: all 0.3s ease;
}

.empty-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.empty-animation {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}

.empty-box svg {
  color: rgba(245, 240, 230, 0.2);
  animation: floatEmptyBox 3s ease-in-out infinite;
}

@keyframes floatEmptyBox {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-packages {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-packages span {
  position: absolute;
  font-size: 20px;
  animation: floatPackage 2s ease-in-out infinite;
}

.floating-packages span:nth-child(1) {
  top: -20px;
  left: 0;
  animation-delay: 0s;
}

.floating-packages span:nth-child(2) {
  top: -30px;
  right: 0;
  animation-delay: 0.3s;
}

.floating-packages span:nth-child(3) {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.6s;
}

@keyframes floatPackage {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
}

.empty-title {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.empty-description {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 32px;
  line-height: 1.6;
}

.explore-btn-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.explore-btn-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Modal Premium */
.modal-overlay-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content-premium {
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  width: 90%;
  max-width: 750px;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: slideUpModal 0.3s ease;
}

@keyframes slideUpModal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  position: sticky;
  top: 0;
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  z-index: 10;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--white-soft);
  font-size: 1.3rem;
  font-weight: 600;
}

.modal-close-premium {
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(245, 240, 230, 0.5);
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-premium:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  transform: rotate(90deg);
}

.modal-body-premium {
  padding: 28px;
}

/* Order Info Card */
.order-info-card-premium {
  background: rgba(212, 175, 55, 0.05);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 28px;
}

.info-row-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.info-row-premium:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
}

.info-row-premium strong {
  color: var(--white-soft);
  font-weight: 600;
}

.order-status-modal {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Timeline Premium */
.timeline-premium {
  margin-bottom: 28px;
  position: relative;
}

.timeline-step-premium {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  position: relative;
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.timeline-step-premium.active {
  opacity: 1;
}

.timeline-step-premium:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 50px;
  width: 2px;
  height: 50px;
  background: rgba(212, 175, 55, 0.3);
}

.timeline-step-premium.active:not(:last-child)::before {
  background: var(--gold-primary);
}

.step-icon-premium {
  width: 44px;
  height: 44px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--gold-primary);
  transition: all 0.3s ease;
}

.timeline-step-premium.active .step-icon-premium {
  background: var(--gold-primary);
  color: var(--black-primary);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
}

.step-content-premium {
  flex: 1;
}

.step-content-premium strong {
  display: block;
  color: var(--white-soft);
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.step-content-premium span {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
}

/* Products Section */
.products-section-premium {
  margin-bottom: 28px;
}

.section-title-premium {
  color: var(--gold-primary);
  font-size: 1rem;
  margin-bottom: 16px;
  font-weight: 600;
}

.products-list-modal-premium {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.products-list-modal-premium::-webkit-scrollbar {
  width: 4px;
}

.products-list-modal-premium::-webkit-scrollbar-track {
  background: rgba(212, 175, 55, 0.1);
  border-radius: 4px;
}

.products-list-modal-premium::-webkit-scrollbar-thumb {
  background: var(--gold-primary);
  border-radius: 4px;
}

.product-item-modal-premium {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.product-item-modal-premium:hover {
  background: rgba(212, 175, 55, 0.05);
  transform: translateX(3px);
}

.product-image-modal {
  width: 60px;
  height: 60px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.product-image-modal img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.product-info-modal {
  flex: 1;
}

.product-name-modal {
  color: var(--white-soft);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.product-meta-modal {
  display: flex;
  gap: 12px;
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
}

.product-subtotal {
  color: var(--gold-primary);
}

/* Order Summary Modal */
.order-summary-modal-premium {
  background: rgba(212, 175, 55, 0.05);
  border-radius: 20px;
  padding: 20px;
  margin-top: 8px;
}

.summary-row-modal {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.85rem;
}

.summary-row-modal.discount {
  color: #4caf50;
}

.summary-divider {
  height: 1px;
  background: rgba(212, 175, 55, 0.15);
  margin: 12px 0;
}

.summary-row-modal.total {
  font-size: 1rem;
  font-weight: bold;
  padding-top: 12px;
}

.total-value-modal {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 1.1rem;
}

/* Transition Group */
.order-card-move,
.order-card-enter-active,
.order-card-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.order-card-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.order-card-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.order-card-leave-active {
  position: absolute;
}

/* Responsividade Premium */
@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }
  
  .page-title-premium {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .orders-page-premium {
    padding: 40px 0 60px;
  }
  
  .container-premium {
    padding: 0 16px;
  }
  
  .page-title-premium {
    font-size: 1.6rem;
  }
  
  .title-wrapper-premium {
    gap: 12px;
  }
  
  .order-header-premium,
  .order-products-premium,
  .order-footer-premium {
    padding: 16px;
  }
  
  .order-footer-premium {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .order-details-btn-premium {
    width: 100%;
    justify-content: center;
  }
  
  .order-product-premium {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .product-image-premium {
    width: 90px;
    height: 90px;
  }
  
  .product-meta-premium {
    justify-content: center;
  }
  
  .modal-content-premium {
    width: 95%;
    max-height: 90vh;
  }
  
  .modal-body-premium {
    padding: 20px;
  }
  
  .modal-header-premium {
    padding: 18px 20px;
  }
  
  .info-row-premium {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .timeline-step-premium {
    gap: 12px;
  }
  
  .step-icon-premium {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .timeline-step-premium:not(:last-child)::before {
    left: 18px;
    top: 42px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .page-title-premium {
    font-size: 1.3rem;
  }
  
  .title-icon-premium svg {
    width: 32px;
    height: 32px;
  }
  
  .order-id-premium {
    font-size: 0.8rem;
  }
  
  .order-total-premium strong {
    font-size: 1rem;
  }
  
  .empty-card-premium {
    padding: 32px 24px;
  }
  
  .empty-title {
    font-size: 1.2rem;
  }
  
  .empty-description {
    font-size: 0.85rem;
  }
  
  .product-name-modal {
    font-size: 0.8rem;
  }
  
  .product-meta-modal {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>