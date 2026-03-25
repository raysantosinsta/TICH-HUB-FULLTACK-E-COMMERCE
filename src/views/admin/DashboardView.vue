<template>
  <div class="admin-dashboard">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-left">
          <div class="icon-wrapper">
            <i class="pi pi-shield"></i>
          </div>
          <div>
            <h1>Painel Administrativo</h1>
            <p class="subtitle">Gerencie sua loja de forma completa</p>
          </div>
        </div>
        <div class="header-right">
          <span class="admin-badge">Administrador</span>
          <span class="user-greeting">Olá, {{ user?.name || 'Administrador' }}</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon products">
            <i class="pi pi-box"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalProducts }}</span>
            <span class="stat-label">Total de Produtos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orders">
            <i class="pi pi-shopping-cart"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalOrders }}</span>
            <span class="stat-label">Total de Pedidos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon users">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">Usuários Ativos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon revenue">
            <i class="pi pi-chart-line"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ formatPrice(stats.totalRevenue) }}</span>
            <span class="stat-label">Receita Total</span>
          </div>
        </div>
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

// Stats
const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0
})

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Carregar dados
const loadStats = async () => {
  try {
    // Produtos
    stats.value.totalProducts = productsStore.products.length || 0
    
    // Pedidos
    const orders = ordersStore.orders
    stats.value.totalOrders = orders.length
    
    // Receita total
    stats.value.totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    
    // Usuários (simulado)
    stats.value.totalUsers = 2 // admin + user
    
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    toast.error('Erro', 'Não foi possível carregar os dados do dashboard.', 3000)
  }
}

onMounted(async () => {
  // Carregar dados necessários
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  
  ordersStore.syncWithUser()
  await loadStats()
})
</script>

<style scoped>
.admin-dashboard {
  position: relative;
  min-height: 100vh;
  padding: 40px 0 80px;
}

/* Background Premium */
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

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  padding: 24px 32px;
  border-radius: 24px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background: rgba(212, 175, 55, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 2rem;
  color: var(--gold-primary);
}

.header-left h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--white-soft);
  margin: 0;
}

.subtitle {
  font-size: 0.85rem;
  color: rgba(245, 240, 230, 0.6);
  margin-top: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-badge {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
}

.user-greeting {
  color: var(--white-soft);
  font-weight: 500;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: var(--gold-primary);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.products {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.stat-icon.orders {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.stat-icon.users {
  background: rgba(156, 39, 176, 0.2);
  color: #9c27b0;
}

.stat-icon.revenue {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gold-primary);
}

.stat-icon i {
  font-size: 1.8rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--white-soft);
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(245, 240, 230, 0.6);
}

/* Responsividade */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .header-left h1 {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 20px;
  }
}
</style>