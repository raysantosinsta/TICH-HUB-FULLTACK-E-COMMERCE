<template>
  <div class="profile-page-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="profile-particles">
        <div v-for="i in 40" :key="i" class="profile-particle" :style="getParticleStyle(i)">
          👤
        </div>
      </div>
    </div>

    <div class="container-premium">
      <!-- Skeleton Loading Premium -->
      <div v-if="loading" class="skeleton-loader-premium">
        <div class="skeleton-header-premium shimmer"></div>
        <div class="skeleton-card-premium shimmer"></div>
        <div class="skeleton-card-premium shimmer"></div>
      </div>

      <!-- Conteúdo do Perfil Premium -->
      <div v-else class="profile-content-premium">
        <!-- Header do Profile Premium -->
        <div class="profile-header-premium">
          <div class="avatar-section-premium">
            <div class="avatar-premium">
              <span class="avatar-text-premium">{{ userInitials }}</span>
              <div class="avatar-glow"></div>
            </div>
            <div class="avatar-ring"></div>
          </div>
          <div class="user-info-premium">
            <h1 class="user-name-premium">{{ user?.name || 'Usuário' }}</h1>
            <p class="user-email-premium">{{ user?.email || 'email@exemplo.com' }}</p>
            <p class="user-role-premium" v-if="user?.role === 'admin'">
              <span class="role-badge">👑 Administrador</span>
            </p>
          </div>
          <button class="edit-profile-btn-premium" @click="openEditModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 14.66V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H10M15.5 2L22 8.5M21 3L11 13L8 14L9 11L19 1L21 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Editar Perfil</span>
          </button>
        </div>

        <!-- Informações do Usuário Premium -->
        <div class="info-card-premium">
          <h2 class="card-title-premium">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Informações Pessoais
          </h2>
          <div class="info-grid-premium">
            <div class="info-item-premium">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Nome completo
              </label>
              <p>{{ user?.name || 'Não informado' }}</p>
            </div>
            <div class="info-item-premium">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                E-mail
              </label>
              <p>{{ user?.email || 'Não informado' }}</p>
            </div>
            <div class="info-item-premium">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
                </svg>
                Tipo de conta
              </label>
              <p>{{ user?.role === 'admin' ? 'Administrador' : 'Usuário comum' }}</p>
            </div>
          </div>
        </div>

        <!-- Meus Pedidos Premium -->
        <div class="orders-card-premium">
          <h2 class="card-title-premium">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Meus Pedidos
            <span class="orders-count-premium" v-if="orders.length > 0">{{ orders.length }}</span>
          </h2>
          
          <div v-if="orders.length === 0" class="empty-orders-premium">
            <div class="empty-animation-premium">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <div class="floating-packages-profile">
                <span>📦</span>
                <span>🛍️</span>
                <span>✨</span>
              </div>
            </div>
            <p>Nenhum pedido encontrado</p>
            <router-link to="/products" class="btn-shop-premium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2"/>
              </svg>
              Começar a comprar
            </router-link>
          </div>

          <div v-else class="orders-list-premium">
            <transition-group name="order-premium" tag="div" class="orders-grid-premium">
              <div v-for="order in orders" :key="order.id" class="order-card-premium">
                <div class="card-glow-premium"></div>
                
                <div class="order-header-premium">
                  <div class="order-info-premium">
                    <h3 class="order-id-premium">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                      </svg>
                      Pedido #{{ order.id }}
                    </h3>
                    <span class="order-date-premium">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H21M8 3V6M16 3V6M4 12H20M7 18H9M12 18H14" stroke="currentColor" stroke-width="1.5"/>
                      </svg>
                      {{ formatDate(order.date) }}
                    </span>
                  </div>
                  <span class="order-status-premium" :class="order.status">
                    <span class="status-dot"></span>
                    {{ getStatusText(order.status) }}
                  </span>
                </div>

                <div class="order-details-premium">
                  <div class="order-summary-premium">
                    <div class="summary-item-premium">
                      <span>Subtotal</span>
                      <span>{{ formatPrice(order.subtotal) }}</span>
                    </div>
                    <div class="summary-item-premium">
                      <span>Frete</span>
                      <span>{{ order.shipping === 0 ? 'Grátis' : formatPrice(order.shipping) }}</span>
                    </div>
                    <div v-if="order.discount > 0" class="summary-item-premium discount">
                      <span>Desconto</span>
                      <span>- {{ formatPrice(order.discount) }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-item-premium total">
                      <span>Total</span>
                      <span class="total-value">{{ formatPrice(order.total) }}</span>
                    </div>
                  </div>

                  <div v-if="order.trackingCode" class="tracking-info-premium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <span>Código de rastreio: <strong>{{ order.trackingCode }}</strong></span>
                  </div>
                </div>

                <div class="order-timeline-premium">
                  <div class="timeline-step-premium" :class="{ active: getStatusStep('pending', order.status) }">
                    <div class="step-icon-premium">📦</div>
                    <span>Pedido</span>
                  </div>
                  <div class="timeline-line-premium" :class="{ active: getStatusStep('processing', order.status) }"></div>
                  <div class="timeline-step-premium" :class="{ active: getStatusStep('processing', order.status) }">
                    <div class="step-icon-premium">⚙️</div>
                    <span>Processando</span>
                  </div>
                  <div class="timeline-line-premium" :class="{ active: getStatusStep('shipped', order.status) }"></div>
                  <div class="timeline-step-premium" :class="{ active: getStatusStep('shipped', order.status) }">
                    <div class="step-icon-premium">🚚</div>
                    <span>Enviado</span>
                  </div>
                  <div class="timeline-line-premium" :class="{ active: getStatusStep('delivered', order.status) }"></div>
                  <div class="timeline-step-premium" :class="{ active: getStatusStep('delivered', order.status) }">
                    <div class="step-icon-premium">✅</div>
                    <span>Entregue</span>
                  </div>
                </div>

                <div class="order-products-premium">
                  <h4>Produtos</h4>
                  <div v-for="product in order.products.slice(0, 2)" :key="product.id" class="product-item-premium">
                    <img :src="product.image" :alt="product.name" class="product-image-premium">
                    <div class="product-info-premium">
                      <p class="product-name-premium">{{ product.name }}</p>
                      <div class="product-meta-premium">
                        <span class="product-price-premium">{{ formatPrice(product.price) }}</span>
                        <span>Qtd: {{ product.quantity }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="order.products.length > 2" class="more-products-premium">
                    + {{ order.products.length - 2 }} outro(s) produto(s)
                  </div>
                </div>

                <div class="order-footer-premium">
                  <button class="view-details-btn-premium" @click="goToOrderDetails(order.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    Ver detalhes completos
                  </button>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Perfil Premium -->
    <div v-if="showEditModal" class="modal-overlay-premium" @click="closeEditModal">
      <div class="modal-content-premium" @click.stop>
        <div class="modal-header-premium">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 14.66V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H10M15.5 2L22 8.5M21 3L11 13L8 14L9 11L19 1L21 3Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Editar Perfil
          </h3>
          <button class="close-modal-premium" @click="closeEditModal">✕</button>
        </div>
        <form @submit.prevent="saveProfile">
          <div class="form-group-premium">
            <label>Nome completo</label>
            <input type="text" v-model="editForm.name" required placeholder="Seu nome">
          </div>
          <div class="form-group-premium">
            <label>E-mail</label>
            <input type="email" v-model="editForm.email" required placeholder="seu@email.com">
          </div>
          <div class="modal-actions-premium">
            <button type="button" class="btn-cancel-premium" @click="closeEditModal">Cancelar</button>
            <button type="submit" class="btn-save-premium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { useToast } from '../plugins/toast'
import { useConfirm } from '../plugins/confirm'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const toast = useToast()
const { confirm } = useConfirm()

// Estado
const loading = ref(true)
const showEditModal = ref(false)
const editForm = ref({
  name: '',
  email: ''
})

// Partículas
const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${12 + Math.random() * 15}s`,
    opacity: 0.1 + Math.random() * 0.3
  }
}

// Computed
const orders = computed(() => ordersStore.orders)
const totalOrders = computed(() => ordersStore.totalOrders)
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
  return ordersStore.formatDate(dateString)
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

// Redirecionar para página de detalhes do pedido
const goToOrderDetails = (orderId: string) => {
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

// Observar mudanças na autenticação
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    ordersStore.syncWithUser()
  }
})

// Verificar autenticação e carregar pedidos
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  ordersStore.syncWithUser()
  
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
/* ========== PROFILE PAGE PREMIUM ========== */
.profile-page-premium {
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
  animation: gradientPulseProfile 8s ease-in-out infinite;
}

@keyframes gradientPulseProfile {
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
  animation: lightSweepProfile 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepProfile {
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

.profile-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.profile-particle {
  position: absolute;
  font-size: 12px;
  animation: floatParticleProfile linear infinite;
  opacity: 0;
}

@keyframes floatParticleProfile {
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

/* Skeleton Loading Premium */
.skeleton-loader-premium {
  animation: fadeIn 0.3s ease;
}

.skeleton-header-premium {
  height: 200px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 32px;
  margin-bottom: 24px;
}

.skeleton-card-premium {
  height: 300px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 32px;
  margin-bottom: 24px;
}

.shimmer {
  background: linear-gradient(90deg, rgba(59, 58, 64, 0.3) 25%, rgba(212, 175, 55, 0.1) 50%, rgba(59, 58, 64, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Profile Content */
.profile-content-premium {
  animation: fadeInUpProfile 0.6s ease;
}

@keyframes fadeInUpProfile {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Profile Header Premium */
.profile-header-premium {
  background: rgba(11, 11, 15, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 40px;
  margin-bottom: 32px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-header-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.avatar-section-premium {
  position: relative;
}

.avatar-premium {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.avatar-premium:hover {
  transform: scale(1.05);
}

.avatar-text-premium {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--black-primary);
  text-transform: uppercase;
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.avatar-premium:hover .avatar-glow {
  opacity: 1;
}

.avatar-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.user-info-premium {
  flex: 1;
}

.user-name-premium {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.user-email-premium {
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 8px;
}

.role-badge {
  display: inline-block;
  background: rgba(212, 175, 55, 0.15);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gold-primary);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.edit-profile-btn-premium {
  background: transparent;
  border: 1.5px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 12px 28px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.edit-profile-btn-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.4s ease;
}

.edit-profile-btn-premium:hover::before {
  left: 100%;
}

.edit-profile-btn-premium:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
  gap: 14px;
}

/* Info Card Premium */
.info-card-premium {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 32px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.info-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-title-premium {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3rem;
  color: var(--white-soft);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.card-title-premium svg {
  color: var(--gold-primary);
}

.info-grid-premium {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}

.info-item-premium {
  padding: 16px;
  background: rgba(59, 58, 64, 0.2);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.info-item-premium:hover {
  background: rgba(212, 175, 55, 0.05);
  transform: translateY(-2px);
}

.info-item-premium label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.75rem;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item-premium p {
  color: var(--white-soft);
  font-size: 1rem;
  font-weight: 500;
}

/* Orders Card Premium */
.orders-card-premium {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 32px;
  padding: 32px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.orders-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.orders-count-premium {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 10px;
}

/* Empty Orders Premium */
.empty-orders-premium {
  text-align: center;
  padding: 60px 20px;
}

.empty-animation-premium {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.empty-animation-premium svg {
  color: rgba(245, 240, 230, 0.2);
  animation: floatEmptyProfile 3s ease-in-out infinite;
}

@keyframes floatEmptyProfile {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-packages-profile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-packages-profile span {
  position: absolute;
  font-size: 18px;
  animation: floatPackageProfile 2s ease-in-out infinite;
}

.floating-packages-profile span:nth-child(1) {
  top: -20px;
  left: 0;
  animation-delay: 0s;
}

.floating-packages-profile span:nth-child(2) {
  top: -30px;
  right: 0;
  animation-delay: 0.3s;
}

.floating-packages-profile span:nth-child(3) {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.6s;
}

@keyframes floatPackageProfile {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
}

.empty-orders-premium p {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 24px;
}

.btn-shop-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 12px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-shop-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Orders List Premium */
.orders-list-premium {
  margin-top: 24px;
}

.orders-grid-premium {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card-premium {
  position: relative;
  background: rgba(59, 58, 64, 0.2);
  border-radius: 28px;
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(212, 175, 55, 0.1);
  overflow: hidden;
}

.order-card-premium:hover {
  transform: translateX(5px);
  border-color: rgba(212, 175, 55, 0.3);
  background: rgba(59, 58, 64, 0.3);
}

.card-glow-premium {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.08), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.order-card-premium:hover .card-glow-premium {
  left: 100%;
}

/* Order Header */
.order-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
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
  font-size: 1rem;
  color: var(--gold-primary);
  margin: 0;
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
}

.order-status-premium.pending { background: rgba(255, 193, 7, 0.15); color: #ffc107; }
.order-status-premium.processing { background: rgba(33, 150, 243, 0.15); color: #2196f3; }
.order-status-premium.shipped { background: rgba(156, 39, 176, 0.15); color: #9c27b0; }
.order-status-premium.delivered { background: rgba(76, 175, 80, 0.15); color: #4caf50; }
.order-status-premium.cancelled { background: rgba(244, 67, 54, 0.15); color: #f44336; }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulseDot 1.5s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Order Details */
.order-details-premium {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.order-summary-premium {
  flex: 1;
  min-width: 200px;
}

.summary-item-premium {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: rgba(245, 240, 230, 0.7);
}

.summary-item-premium.discount {
  color: #4caf50;
}

.summary-divider {
  height: 1px;
  background: rgba(212, 175, 55, 0.15);
  margin: 12px 0;
}

.summary-item-premium.total {
  font-size: 1rem;
  font-weight: bold;
  color: var(--white-soft);
}

.total-value {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 1.1rem;
}

.tracking-info-premium {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(212, 175, 55, 0.08);
  border-radius: 16px;
  font-size: 0.8rem;
  color: var(--gold-primary);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

/* Timeline Premium */
.order-timeline-premium {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  padding: 20px 0;
  flex-wrap: wrap;
  gap: 8px;
}

.timeline-step-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 60px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.timeline-step-premium.active {
  opacity: 1;
}

.timeline-step-premium.active .step-icon-premium {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.5));
}

.step-icon-premium {
  font-size: 1.4rem;
  transition: all 0.3s ease;
}

.timeline-step-premium span {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.7);
}

.timeline-line-premium {
  flex: 1;
  height: 2px;
  background: rgba(212, 175, 55, 0.2);
  min-width: 20px;
}

.timeline-line-premium.active {
  background: linear-gradient(90deg, var(--gold-primary), rgba(212, 175, 55, 0.5));
}

/* Order Products */
.order-products-premium {
  margin: 20px 0;
}

.order-products-premium h4 {
  color: var(--white-soft);
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.product-item-premium {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: rgba(11, 11, 15, 0.3);
  border-radius: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.product-item-premium:hover {
  background: rgba(212, 175, 55, 0.05);
  transform: translateX(5px);
}

.product-image-premium {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: white;
  border-radius: 12px;
  padding: 6px;
}

.product-info-premium {
  flex: 1;
}

.product-name-premium {
  color: var(--white-soft);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.product-meta-premium {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
}

.product-price-premium {
  color: var(--gold-primary);
  font-weight: 500;
}

.more-products-premium {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 30px;
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.6);
  margin-top: 8px;
}

/* Order Footer */
.order-footer-premium {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  justify-content: flex-end;
}

.view-details-btn-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 8px 20px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.view-details-btn-premium:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
  gap: 12px;
}

/* Modal Premium */
.modal-overlay-premium {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
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

.modal-content-premium {
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
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
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.modal-header-premium h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--white-soft);
  font-size: 1.3rem;
}

.modal-header-premium svg {
  color: var(--gold-primary);
}

.close-modal-premium {
  background: transparent;
  border: none;
  color: rgba(245, 240, 230, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal-premium:hover {
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.1);
  transform: rotate(90deg);
}

.form-group-premium {
  margin-bottom: 24px;
}

.form-group-premium label {
  display: block;
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.form-group-premium input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  color: var(--white-soft);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-group-premium input:focus {
  outline: none;
  border-color: var(--gold-primary);
  background: rgba(59, 58, 64, 0.5);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.modal-actions-premium {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn-cancel-premium {
  background: transparent;
  border: 1px solid rgba(245, 240, 230, 0.3);
  color: var(--white-soft);
  padding: 10px 24px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.btn-cancel-premium:hover {
  background: rgba(245, 240, 230, 0.1);
  transform: translateY(-2px);
}

.btn-save-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  padding: 10px 28px;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.btn-save-premium:hover {
  transform: translateY(-2px);
  gap: 12px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Transition Group */
.order-premium-move,
.order-premium-enter-active,
.order-premium-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.order-premium-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.order-premium-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.order-premium-leave-active {
  position: absolute;
}

/* Responsividade Premium */
@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }
  
  .profile-header-premium {
    padding: 32px;
  }
  
  .avatar-premium {
    width: 100px;
    height: 100px;
  }
  
  .avatar-text-premium {
    font-size: 2rem;
  }
  
  .user-name-premium {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .profile-page-premium {
    padding: 40px 0 60px;
  }
  
  .container-premium {
    padding: 0 16px;
  }
  
  .profile-header-premium {
    flex-direction: column;
    text-align: center;
    padding: 28px;
    gap: 20px;
  }
  
  .avatar-premium {
    width: 90px;
    height: 90px;
  }
  
  .avatar-text-premium {
    font-size: 1.8rem;
  }
  
  .user-name-premium {
    font-size: 1.4rem;
  }
  
  .info-grid-premium {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .order-header-premium {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-details-premium {
    flex-direction: column;
  }
  
  .order-timeline-premium {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .timeline-step-premium {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }
  
  .timeline-line-premium {
    width: 2px;
    height: 20px;
    margin-left: 12px;
  }
  
  .product-item-premium {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .product-image-premium {
    width: 80px;
    height: 80px;
  }
  
  .product-meta-premium {
    justify-content: center;
  }
  
  .order-footer-premium {
    justify-content: center;
  }
  
  .modal-content-premium {
    padding: 24px;
    margin: 0 16px;
  }
}

@media (max-width: 480px) {
  .profile-header-premium,
  .info-card-premium,
  .orders-card-premium {
    padding: 20px;
  }
  
  .user-name-premium {
    font-size: 1.2rem;
  }
  
  .card-title-premium {
    font-size: 1.1rem;
  }
  
  .order-id-premium {
    font-size: 0.9rem;
  }
  
  .order-summary-premium {
    min-width: auto;
  }
  
  .modal-header-premium h3 {
    font-size: 1.1rem;
  }
  
  .btn-save-premium,
  .btn-cancel-premium {
    padding: 8px 20px;
  }
}
</style>