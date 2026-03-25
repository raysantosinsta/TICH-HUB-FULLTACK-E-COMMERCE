<template>
  <div class="favorites-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <svg class="title-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
          </svg>
          Meus Favoritos
        </h1>
        <p class="favorites-count">{{ totalFavorites }} produto(s) favoritado(s)</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando seus favoritos...</p>
      </div>

      <!-- Lista de Favoritos (apenas quando autenticado) -->
      <div v-else-if="isAuthenticated && favorites.length > 0" class="favorites-list">
        <FavoriteItem 
          v-for="product in favorites" 
          :key="product.id"
          :product="product"
          @remove="handleRemoveFavorite"
        />
        
        <div class="actions-footer">
          <button class="clear-all-btn" @click="clearAllFavorites">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Limpar todos os favoritos
          </button>
        </div>
      </div>

      <!-- Estado Vazio (autenticado mas sem favoritos) -->
      <div v-else-if="isAuthenticated && favorites.length === 0 && !loading" class="empty-favorites">
        <div class="empty-content">
          <svg class="empty-icon" width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <h2>Você ainda não tem produtos favoritos</h2>
          <p>Comece adicionando produtos que você gosta ❤️</p>
          <router-link to="/products" class="explore-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Explorar produtos
          </router-link>
        </div>
      </div>

      <!-- Estado Não Autenticado -->
      <div v-else-if="!isAuthenticated" class="login-prompt">
        <div class="login-prompt-content">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
          </svg>
          <h2>Faça login para ver seus favoritos</h2>
          <p>Entre com sua conta para acessar seus produtos favoritos</p>
          <div class="login-buttons">
            <router-link to="/login" class="btn btn-primary">Entrar</router-link>
            <router-link to="/register" class="btn btn-outline">Criar conta</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import { useConfirm } from '../plugins/confirm'
import FavoriteItem from '../components/FavoriteItem.vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const toast = useToast()
const { confirm } = useConfirm()

// Computed properties
const favorites = computed(() => favoritesStore.favorites)
const totalFavorites = computed(() => favoritesStore.totalFavorites)
const loading = computed(() => favoritesStore.loading)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

// Observar mudanças na autenticação
watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    // Usuário fez login, carregar favoritos
    favoritesStore.syncWithUser()
  } else {
    // Usuário fez logout, limpar lista
    favoritesStore.syncWithUser()
  }
})

// Observar mudanças no ID do usuário
watch(() => authStore.user?.id, () => {
  if (authStore.isAuthenticated) {
    favoritesStore.syncWithUser()
  }
})

// Remover um favorito específico
const handleRemoveFavorite = (productId: number) => {
  // O FavoriteItem já chama o removeFromFavorites
  // Aqui apenas mostramos um toast adicional se necessário
  toast.info(
    'Favorito removido', 
    'Produto removido dos seus favoritos.', 
    2000
  )
}

// Limpar todos os favoritos
const clearAllFavorites = async () => {
  if (!isAuthenticated.value) {
    toast.warning('Acesso negado', 'Faça login para gerenciar seus favoritos.', 3000)
    router.push('/login')
    return
  }
  
  const result = await confirm({
    title: 'Limpar favoritos',
    message: 'Tem certeza que deseja remover todos os produtos dos favoritos? Esta ação não pode ser desfeita.',
    confirmText: 'Sim, limpar tudo',
    cancelText: 'Cancelar',
    type: 'danger'
  })
  
  if (result) {
    favoritesStore.clearFavorites()
    toast.success(
      'Favoritos limpos', 
      'Todos os produtos foram removidos dos seus favoritos.', 
      3000
    )
  }
}

// Recarregar favoritos manualmente
const refreshFavorites = () => {
  if (isAuthenticated.value) {
    favoritesStore.loadFavorites()
  }
}

onMounted(() => {
  // Se estiver autenticado, carregar favoritos
  if (isAuthenticated.value) {
    favoritesStore.syncWithUser()
  }
})
</script>

<style scoped>
.favorites-page {
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
  margin-bottom: 12px;
}

.title-icon {
  color: #ff6b6b;
}

.favorites-count {
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

/* Favorites List */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.actions-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 30px;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.clear-all-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: translateY(-2px);
  border-color: #ff6b6b;
}

/* Empty State */
.empty-favorites {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  text-align: center;
}

.empty-content {
  animation: fadeInUp 0.5s ease;
}

.empty-icon {
  color: rgba(245, 240, 230, 0.3);
  margin-bottom: 24px;
}

.empty-favorites h2 {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.empty-favorites p {
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

/* Login Prompt */
.login-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  text-align: center;
}

.login-prompt-content {
  max-width: 400px;
  padding: 48px 32px;
  background: rgba(11, 11, 15, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: fadeInUp 0.5s ease;
}

.login-prompt-content svg {
  color: var(--gold-primary);
  margin-bottom: 24px;
}

.login-prompt-content h2 {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.login-prompt-content p {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 32px;
}

.login-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--gold-primary);
  color: var(--gold-primary);
}

.btn-outline:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

/* Animations */
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
  
  .favorites-list {
    gap: 12px;
  }
  
  .actions-footer {
    justify-content: center;
  }
  
  .login-prompt-content {
    padding: 32px 24px;
    margin: 0 16px;
  }
  
  .login-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>