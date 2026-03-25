<template>
  <div class="profile-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <!-- Skeleton Loading -->
      <div v-if="loading" class="skeleton-loader">
        <div class="skeleton-header"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>

      <!-- Conteúdo do Perfil -->
      <div v-else class="profile-content">
        <!-- Header do Profile -->
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar">
              <span class="avatar-text">{{ userInitials }}</span>
            </div>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ user?.name || 'Usuário' }}</h1>
            <p class="user-email">{{ user?.email || 'email@exemplo.com' }}</p>
            <p class="user-role" v-if="user?.role === 'admin'">Administrador</p>
          </div>
          <button class="edit-profile-btn" @click="openEditModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 14.66V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H10M15.5 2L22 8.5M21 3L11 13L8 14L9 11L19 1L21 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Editar Perfil
          </button>
        </div>

        <!-- Informações do Usuário -->
        <div class="info-card">
          <h2 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Informações Pessoais
          </h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Nome completo</label>
              <p>{{ user?.name || 'Não informado' }}</p>
            </div>
            <div class="info-item">
              <label>E-mail</label>
              <p>{{ user?.email || 'Não informado' }}</p>
            </div>
            <div class="info-item">
              <label>Tipo de conta</label>
              <p>{{ user?.role === 'admin' ? 'Administrador' : 'Usuário comum' }}</p>
            </div>
          </div>
        </div>

        <!-- Meus Pedidos -->
        <div class="orders-card">
          <h2 class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Meus Pedidos
            <span class="orders-count" v-if="orders.length > 0">({{ orders.length }})</span>
          </h2>
          
          <div v-if="orders.length === 0" class="empty-orders">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <p>Nenhum pedido encontrado</p>
            <router-link to="/products" class="btn-shop">Começar a comprar</router-link>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-card">
              <!-- Cabeçalho do Pedido -->
              <div class="order-header">
                <div class="order-info">
                  <h3 class="order-id">Pedido {{ order.id }}</h3>
                  <span class="order-date">{{ formatDate(order.date) }}</span>
                </div>
                <span class="order-status" :class="order.status">
                  {{ getStatusText(order.status) }}
                </span>
              </div>

              <!-- Detalhes do Pedido -->
              <div class="order-details">
                <div class="order-summary">
                  <div class="summary-item">
                    <span class="summary-label">Subtotal:</span>
                    <span class="summary-value">{{ formatPrice(order.subtotal) }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Frete:</span>
                    <span class="summary-value">{{ formatPrice(order.shipping) }}</span>
                  </div>
                  <div v-if="order.discount > 0" class="summary-item">
                    <span class="summary-label">Desconto:</span>
                    <span class="summary-value discount">-{{ formatPrice(order.discount) }}</span>
                  </div>
                  <div class="summary-item total">
                    <span class="summary-label">Total:</span>
                    <span class="summary-value">{{ formatPrice(order.total) }}</span>
                  </div>
                </div>

                <!-- Código de Rastreamento -->
                <div v-if="order.trackingCode" class="tracking-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <span>Código de rastreio: <strong>{{ order.trackingCode }}</strong></span>
                </div>
              </div>

              <!-- Timeline do Pedido -->
              <div class="order-timeline">
                <div class="timeline-step" :class="{ active: getStatusStep('pending', order.status) }">
                  <div class="step-icon">📦</div>
                  <span class="step-label">Pedido Realizado</span>
                </div>
                <div class="timeline-line" :class="{ active: getStatusStep('processing', order.status) }"></div>
                <div class="timeline-step" :class="{ active: getStatusStep('processing', order.status) }">
                  <div class="step-icon">⚙️</div>
                  <span class="step-label">Processando</span>
                </div>
                <div class="timeline-line" :class="{ active: getStatusStep('shipped', order.status) }"></div>
                <div class="timeline-step" :class="{ active: getStatusStep('shipped', order.status) }">
                  <div class="step-icon">🚚</div>
                  <span class="step-label">Enviado</span>
                </div>
                <div class="timeline-line" :class="{ active: getStatusStep('delivered', order.status) }"></div>
                <div class="timeline-step" :class="{ active: getStatusStep('delivered', order.status) }">
                  <div class="step-icon">✅</div>
                  <span class="step-label">Entregue</span>
                </div>
              </div>

              <!-- Produtos do Pedido -->
              <div class="order-products">
                <h4>Produtos</h4>
                <div v-for="product in order.products" :key="product.id" class="product-item">
                  <img :src="product.image" :alt="product.name" class="product-image">
                  <div class="product-info">
                    <p class="product-name">{{ product.name }}</p>
                    <p class="product-category">{{ formatCategory(product.category) }}</p>
                    <div class="product-meta">
                      <span class="product-price">{{ formatPrice(product.price) }}</span>
                      <span class="product-quantity">Qtd: {{ product.quantity }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botão Ver Detalhes - Redireciona para Orders -->
              <div class="order-footer">
                <button class="view-details-btn" @click="goToOrderDetails(order.id)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  Ver detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Perfil -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Perfil</h3>
          <button class="close-modal" @click="closeEditModal">✕</button>
        </div>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label>Nome</label>
            <input type="text" v-model="editForm.name" required>
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" v-model="editForm.email" required>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeEditModal">Cancelar</button>
            <button type="submit" class="btn-save">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import { useConfirm } from '../plugins/confirm'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const { confirm } = useConfirm()

// Estado
const loading = ref(true)
const showEditModal = ref(false)
const orders = ref<any[]>([])
const editForm = ref({
  name: '',
  email: ''
})

// Computed
const user = computed(() => authStore.user)
const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Formatar preço
const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Formatar data
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatar categoria
const formatCategory = (category: string) => {
  const categories: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    "jewelery": "Jóias",
    "electronics": "Eletrônicos"
  }
  return categories[category] || category
}

// Status do pedido
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  }
  return statusMap[status] || status
}

// Verificar se o passo da timeline está ativo
const getStatusStep = (step: string, currentStatus: string) => {
  const steps = ['pending', 'processing', 'shipped', 'delivered']
  const currentIndex = steps.indexOf(currentStatus)
  const stepIndex = steps.indexOf(step)
  return stepIndex <= currentIndex
}

// Carregar pedidos do localStorage
const loadOrders = () => {
  const savedOrders = localStorage.getItem('orders')
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders)
    // Ordenar por data decrescente (mais recentes primeiro)
    orders.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

// Redirecionar para página de detalhes do pedido
const goToOrderDetails = (orderId: string) => {
  // Redirecionar para a página de orders com o ID do pedido
  router.push(`/orders?orderId=${orderId}`)
}

// Editar perfil
const openEditModal = () => {
  editForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveProfile = async () => {
  if (editForm.value.name && editForm.value.email) {
    authStore.updateUser(editForm.value)
    toast.success('Perfil atualizado', 'Suas informações foram atualizadas com sucesso.', 3000)
    closeEditModal()
  }
}

// Verificar autenticação e carregar pedidos
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  loadOrders()
  
  // Simular carregamento mínimo
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
/* Mantenha todos os estilos existentes */
.profile-page {
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

/* Skeleton Loading */
.skeleton-loader {
  animation: fadeIn 0.3s ease;
}

.skeleton-header {
  height: 180px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 24px;
  margin-bottom: 24px;
}

.skeleton-card {
  height: 200px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 24px;
  margin-bottom: 24px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Profile Content */
.profile-content {
  animation: fadeInUp 0.5s ease;
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

/* Profile Header */
.profile-header {
  background: rgba(11, 11, 15, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--black-primary);
}

.avatar-text {
  text-transform: uppercase;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.8rem;
  color: var(--white-soft);
  margin-bottom: 8px;
}

.user-email {
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 4px;
}

.user-role {
  color: var(--gold-primary);
  font-size: 0.85rem;
  font-weight: 500;
}

.edit-profile-btn {
  background: transparent;
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 10px 24px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.edit-profile-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

/* Cards */
.info-card,
.orders-card {
  background: rgba(11, 11, 15, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3rem;
  color: var(--white-soft);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.info-item label {
  display: block;
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.info-item p {
  color: var(--white-soft);
  font-size: 1rem;
  font-weight: 500;
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  background: rgba(59, 58, 64, 0.3);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.order-card:hover {
  transform: translateX(5px);
  border-color: rgba(212, 175, 55, 0.3);
  background: rgba(59, 58, 64, 0.4);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 1.1rem;
  color: var(--gold-primary);
  margin: 0;
}

.order-date {
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.5);
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.pending { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.order-status.processing { background: rgba(33, 150, 243, 0.2); color: #2196f3; }
.order-status.shipped { background: rgba(156, 39, 176, 0.2); color: #9c27b0; }
.order-status.delivered { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
.order-status.cancelled { background: rgba(244, 67, 54, 0.2); color: #f44336; }

.order-details {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.order-summary {
  flex: 1;
  min-width: 200px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.summary-label {
  color: rgba(245, 240, 230, 0.6);
}

.summary-value {
  color: var(--white-soft);
  font-weight: 500;
}

.summary-value.discount {
  color: #4caf50;
}

.summary-item.total {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  font-size: 1rem;
  font-weight: bold;
}

.summary-item.total .summary-value {
  color: var(--gold-primary);
  font-size: 1.1rem;
}

.tracking-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--gold-primary);
}

/* Timeline */
.order-timeline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  padding: 20px 0;
  flex-wrap: wrap;
  gap: 8px;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 60px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.timeline-step.active {
  opacity: 1;
}

.timeline-step.active .step-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
}

.step-icon {
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.7rem;
  text-align: center;
  color: rgba(245, 240, 230, 0.7);
}

.timeline-line {
  flex: 1;
  height: 2px;
  background: rgba(212, 175, 55, 0.2);
  min-width: 20px;
}

.timeline-line.active {
  background: linear-gradient(90deg, var(--gold-primary), rgba(212, 175, 55, 0.5));
}

/* Products */
.order-products {
  margin: 20px 0;
}

.order-products h4 {
  color: var(--white-soft);
  margin-bottom: 16px;
  font-size: 1rem;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: rgba(11, 11, 15, 0.3);
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.product-item:hover {
  background: rgba(11, 11, 15, 0.5);
  transform: translateX(5px);
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: white;
  border-radius: 8px;
  padding: 4px;
}

.product-info {
  flex: 1;
}

.product-name {
  color: var(--white-soft);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.product-category {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
  margin-bottom: 8px;
}

.product-meta {
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
}

.product-price {
  color: var(--gold-primary);
  font-weight: 500;
}

.product-quantity {
  color: rgba(245, 240, 230, 0.6);
}

/* Order Footer */
.order-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  justify-content: flex-end;
}

.view-details-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.view-details-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.orders-count {
  font-size: 0.9rem;
  color: var(--gold-primary);
  margin-left: 8px;
}

.empty-orders {
  text-align: center;
  padding: 40px;
}

.empty-orders svg {
  color: rgba(245, 240, 230, 0.3);
  margin-bottom: 16px;
}

.empty-orders p {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 20px;
}

.btn-shop {
  display: inline-block;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 10px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-shop:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: rgba(11, 11, 15, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: slideUp 0.3s ease;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  color: var(--white-soft);
  font-size: 1.3rem;
}

.close-modal {
  background: transparent;
  border: none;
  color: rgba(245, 240, 230, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-modal:hover {
  color: var(--gold-primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  color: var(--white-soft);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--gold-primary);
  background: rgba(59, 58, 64, 0.5);
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(245, 240, 230, 0.3);
  color: var(--white-soft);
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(245, 240, 230, 0.1);
}

.btn-save {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .user-name {
    font-size: 1.3rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-details {
    flex-direction: column;
  }
  
  .order-timeline {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .timeline-step {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }
  
  .timeline-line {
    width: 2px;
    height: 20px;
    margin-left: 12px;
  }
  
  .product-item {
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

@media (max-width: 480px) {
  .profile-header,
  .info-card,
  .orders-card {
    padding: 20px;
  }
}
</style>