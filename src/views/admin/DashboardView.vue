<template>
  <div class="admin-dashboard-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="admin-particles">
        <div v-for="i in 50" :key="i" class="admin-particle" :style="getParticleStyle(i)">
          ⚡
        </div>
      </div>
    </div>

    <div class="container-premium">
      <!-- Header Premium New -->
      <div class="dashboard-header-premium">
        <div class="header-left-premium">
          <div class="icon-wrapper-premium">
            <div class="icon-glow-premium"></div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="header-text-premium">
            <h1 class="dashboard-title-premium">Painel Administrativo</h1>
            <p class="dashboard-subtitle-premium">Gerencie sua loja de forma completa e eficiente</p>
          </div>
        </div>
        <div class="header-right-premium">
          <div class="admin-badge-premium">
            <span class="badge-icon">👑</span>
            <span class="badge-text">Administrador</span>
          </div>
          <div class="user-greeting-premium">
            <div class="greeting-avatar">{{ userInitials }}</div>
            <div class="greeting-info">
              <span class="greeting-text">Olá,</span>
              <span class="greeting-name">{{ user?.name?.split(' ')[0] || 'Admin' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards Premium -->
      <div class="stats-grid-premium">
        <div class="stat-card-premium" data-aos="fade-up" data-aos-delay="0">
          <div class="stat-icon-premium products">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <div class="icon-ring"></div>
          </div>
          <div class="stat-info-premium">
            <span class="stat-value-premium">{{ stats.totalProducts.toLocaleString() }}</span>
            <span class="stat-label-premium">Total de Produtos</span>
          </div>
          <div class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>+12%</span>
          </div>
        </div>

        <div class="stat-card-premium" data-aos="fade-up" data-aos-delay="100">
          <div class="stat-icon-premium orders">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M9 18H15" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <div class="icon-ring"></div>
          </div>
          <div class="stat-info-premium">
            <span class="stat-value-premium">{{ stats.totalOrders.toLocaleString() }}</span>
            <span class="stat-label-premium">Total de Pedidos</span>
          </div>
          <div class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>+8%</span>
          </div>
        </div>

        <div class="stat-card-premium" data-aos="fade-up" data-aos-delay="200">
          <div class="stat-icon-premium users">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <div class="icon-ring"></div>
          </div>
          <div class="stat-info-premium">
            <span class="stat-value-premium">{{ stats.totalUsers.toLocaleString() }}</span>
            <span class="stat-label-premium">Usuários Ativos</span>
          </div>
          <div class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>+5%</span>
          </div>
        </div>

        <div class="stat-card-premium" data-aos="fade-up" data-aos-delay="300">
          <div class="stat-icon-premium revenue">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
            </svg>
            <div class="icon-ring"></div>
          </div>
          <div class="stat-info-premium">
            <span class="stat-value-premium">{{ formatPrice(stats.totalRevenue) }}</span>
            <span class="stat-label-premium">Receita Total</span>
          </div>
          <div class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>+23%</span>
          </div>
        </div>
      </div>

      <!-- Mensagem de Boas-vindas Premium -->
      <div class="welcome-card-premium" data-aos="fade-up" data-aos-delay="400">
        <div class="welcome-content-premium">
          <div class="welcome-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="welcome-text-premium">
            <h3>Bem-vindo ao seu painel de controle</h3>
            <p>Aqui você pode gerenciar todos os aspectos da sua loja, visualizar estatísticas e acompanhar o crescimento do seu negócio.</p>
          </div>
        </div>
        <div class="welcome-decoration"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { useOrdersStore } from '@/stores/orders'
import { useToast } from '@/plugins/toast'

const authStore = useAuthStore()
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const toast = useToast()

const user = computed(() => authStore.user)
const userInitials = computed(() => {
  if (!user.value?.name) return 'AD'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Stats
const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0
})

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

// Carregar dados
const loadStats = async () => {
  try {
    stats.value.totalProducts = productsStore.products.length || 0
    const orders = ordersStore.orders
    stats.value.totalOrders = orders.length
    stats.value.totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    stats.value.totalUsers = 2 // admin + user
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    toast.error('Erro', 'Não foi possível carregar os dados do dashboard.', 3000)
  }
}

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  
  ordersStore.syncWithUser()
  await loadStats()
})
</script>

<style scoped>
/* ========== ADMIN DASHBOARD PREMIUM ========== */
.admin-dashboard-premium {
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
  animation: gradientPulseAdmin 8s ease-in-out infinite;
}

@keyframes gradientPulseAdmin {
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
  animation: lightSweepAdmin 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepAdmin {
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

.admin-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.admin-particle {
  position: absolute;
  font-size: 12px;
  animation: floatParticleAdmin linear infinite;
  opacity: 0;
}

@keyframes floatParticleAdmin {
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

/* Header Premium */
.dashboard-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 24px;
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(20px);
  padding: 28px 36px;
  border-radius: 32px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
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

.dashboard-header-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.header-left-premium {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper-premium {
  position: relative;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-primary);
  animation: iconPulseAdmin 2s ease-in-out infinite;
}

@keyframes iconPulseAdmin {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.icon-glow-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.icon-wrapper-premium:hover .icon-glow-premium {
  opacity: 1;
}

.dashboard-title-premium {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.dashboard-subtitle-premium {
  font-size: 0.85rem;
  color: rgba(245, 240, 230, 0.6);
  margin-top: 6px;
}

.header-right-premium {
  display: flex;
  align-items: center;
  gap: 20px;
}

.admin-badge-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.badge-icon {
  font-size: 1rem;
  animation: badgeWave 2s ease-in-out infinite;
}

@keyframes badgeWave {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

.badge-text {
  color: var(--gold-primary);
  font-size: 0.85rem;
  font-weight: 600;
}

.user-greeting-premium {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(59, 58, 64, 0.3);
  padding: 6px 16px 6px 6px;
  border-radius: 50px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.greeting-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--black-primary);
  font-size: 0.9rem;
}

.greeting-info {
  display: flex;
  flex-direction: column;
}

.greeting-text {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.6);
}

.greeting-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--white-soft);
}

/* Stats Grid Premium */
.stats-grid-premium {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  margin-bottom: 48px;
}

.stat-card-premium {
  position: relative;
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 28px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: fadeInUp 0.6s ease backwards;
}

.stat-card-premium:nth-child(1) { animation-delay: 0.1s; }
.stat-card-premium:nth-child(2) { animation-delay: 0.2s; }
.stat-card-premium:nth-child(3) { animation-delay: 0.3s; }
.stat-card-premium:nth-child(4) { animation-delay: 0.4s; }

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

.stat-card-premium:hover {
  transform: translateY(-6px);
  border-color: var(--gold-primary);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
}

.stat-icon-premium {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stat-icon-premium.products {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.05) 100%);
  color: #2196f3;
}

.stat-icon-premium.orders {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.05) 100%);
  color: #4caf50;
}

.stat-icon-premium.users {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.05) 100%);
  color: #9c27b0;
}

.stat-icon-premium.revenue {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%);
  color: var(--gold-primary);
}

.icon-ring {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  border: 1px solid currentColor;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.stat-card-premium:hover .icon-ring {
  opacity: 1;
  transform: scale(1.05);
}

.stat-icon-premium svg {
  transition: transform 0.3s ease;
}

.stat-card-premium:hover .stat-icon-premium svg {
  transform: scale(1.1);
}

.stat-info-premium {
  flex: 1;
}

.stat-value-premium {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: block;
  line-height: 1;
}

.stat-label-premium {
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.6);
  margin-top: 6px;
  display: block;
}

.stat-trend {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
}

.stat-trend.positive {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.stat-trend.positive svg {
  transform: rotate(45deg);
}

/* Welcome Card Premium */
.welcome-card-premium {
  position: relative;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 32px;
  padding: 32px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease 0.5s backwards;
}

.welcome-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.welcome-content-premium {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 2;
}

.welcome-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-primary);
  animation: iconGlow 2s ease-in-out infinite;
}

@keyframes iconGlow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.5));
  }
}

.welcome-text-premium h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--white-soft);
  margin-bottom: 8px;
}

.welcome-text-premium p {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
}

.welcome-decoration {
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Responsividade Premium */
@media (max-width: 1200px) {
  .stats-grid-premium {
    gap: 20px;
  }
  
  .stat-value-premium {
    font-size: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }
  
  .stats-grid-premium {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-title-premium {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .admin-dashboard-premium {
    padding: 40px 0 60px;
  }
  
  .container-premium {
    padding: 0 16px;
  }
  
  .dashboard-header-premium {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
  
  .header-left-premium {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid-premium {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .welcome-content-premium {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-text-premium h3 {
    font-size: 1.1rem;
  }
  
  .welcome-text-premium p {
    font-size: 0.85rem;
  }
  
  .dashboard-title-premium {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .stat-card-premium {
    padding: 18px;
  }
  
  .stat-icon-premium {
    width: 54px;
    height: 54px;
  }
  
  .stat-icon-premium svg {
    width: 28px;
    height: 28px;
  }
  
  .stat-value-premium {
    font-size: 1.3rem;
  }
  
  .header-right-premium {
    flex-direction: column;
    width: 100%;
  }
  
  .admin-badge-premium,
  .user-greeting-premium {
    width: 100%;
    justify-content: center;
  }
  
  .welcome-icon {
    width: 60px;
    height: 60px;
  }
}
</style>