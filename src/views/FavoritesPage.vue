<template>
  <div class="favorites-page-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="heart-particles">
        <div v-for="i in 30" :key="i" class="heart-particle" :style="getParticleStyle(i)">
          ❤️
        </div>
      </div>
    </div>

    <div class="container-premium">
      <div class="page-header-premium">
        <div class="header-content-premium">
          <div class="title-wrapper-premium">
            <div class="title-icon-premium">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
              </svg>
              <div class="icon-glow"></div>
            </div>
            <h1 class="page-title-premium">Meus <span class="gold-text">Favoritos</span></h1>
          </div>
          <div class="favorites-count-premium">
            <span class="count-badge">{{ totalFavorites }}</span>
            <span class="count-text">{{ totalFavorites === 1 ? 'produto favoritado' : 'produtos favoritados' }}</span>
          </div>
        </div>
      </div>

      <!-- Loading State Premium -->
      <div v-if="loading" class="loading-state-premium">
        <div class="loading-heart">
          <div class="heart-loader"></div>
          <div class="heart-loader heart-loader-2"></div>
          <div class="heart-loader heart-loader-3"></div>
        </div>
        <p class="loading-text-premium">Carregando seus favoritos...</p>
      </div>

      <!-- Lista de Favoritos Premium -->
      <div v-else-if="isAuthenticated && favorites.length > 0" class="favorites-list-premium">
        <transition-group name="favorite-list" tag="div" class="favorites-grid-premium">
          <FavoriteItem 
            v-for="product in favorites" 
            :key="product.id"
            :product="product"
            @remove="handleRemoveFavorite"
          />
        </transition-group>
        
        <div class="actions-footer-premium">
          <button class="clear-all-btn-premium" @click="clearAllFavorites">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Limpar todos os favoritos</span>
          </button>
        </div>
      </div>

      <!-- Estado Vazio Premium -->
      <div v-else-if="isAuthenticated && favorites.length === 0 && !loading" class="empty-favorites-premium">
        <div class="empty-content-premium">
          <div class="empty-animation">
            <svg class="empty-icon-premium" width="120" height="120" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <div class="floating-hearts">
              <span>❤️</span>
              <span>❤️</span>
              <span>❤️</span>
            </div>
          </div>
          <h2 class="empty-title">Sua lista de favoritos está vazia</h2>
          <p class="empty-description">Comece adicionando produtos que você ama. Eles aparecerão aqui para você!</p>
          <router-link to="/products" class="explore-btn-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Explorar produtos
          </router-link>
        </div>
      </div>

      <!-- Estado Não Autenticado Premium -->
      <div v-else-if="!isAuthenticated" class="login-prompt-premium">
        <div class="login-prompt-card-premium">
          <div class="login-prompt-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
            <div class="icon-pulse"></div>
          </div>
          <h2 class="login-prompt-title">Acesso Exclusivo para Membros</h2>
          <p class="login-prompt-description">Faça login para ver e gerenciar seus produtos favoritos</p>
          <div class="login-buttons-premium">
            <router-link to="/login" class="btn-primary-premium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Entrar na conta
            </router-link>
            <router-link to="/register" class="btn-outline-premium">
              Criar nova conta
            </router-link>
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

// Partículas de coração
const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${10 + Math.random() * 15}s`,
    opacity: 0.1 + Math.random() * 0.3
  }
}

// Observar mudanças na autenticação
watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    favoritesStore.syncWithUser()
  } else {
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
  toast.info('Favorito removido', 'Produto removido dos seus favoritos.', 2000)
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
    toast.success('Favoritos limpos', 'Todos os produtos foram removidos dos seus favoritos.', 3000)
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    favoritesStore.syncWithUser()
  }
})
</script>

<style scoped>
/* ========== FAVORITES PAGE PREMIUM ========== */
.favorites-page-premium {
  position: relative;
  min-height: 100vh;
  padding: 60px 0 100px;
  overflow-x: hidden;
}

/* Background Premium Avançado */
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
    radial-gradient(circle at 40% 90%, rgba(255, 107, 107, 0.05) 0%, transparent 60%),
    linear-gradient(135deg, #0B0B0F 0%, #13131A 100%);
  animation: gradientPulseFav 8s ease-in-out infinite;
}

@keyframes gradientPulseFav {
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
    rgba(212, 175, 55, 0.1) 40%,
    rgba(255, 107, 107, 0.1) 45%,
    rgba(212, 175, 55, 0.15) 50%,
    rgba(255, 107, 107, 0.1) 55%,
    rgba(212, 175, 55, 0.08) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweepFav 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepFav {
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

.heart-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.heart-particle {
  position: absolute;
  font-size: 12px;
  animation: floatHeart linear infinite;
  opacity: 0;
}

@keyframes floatHeart {
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
  margin-bottom: 60px;
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
  color: #ff6b6b;
  filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
  animation: heartPulse 1.5s ease-in-out infinite;
}

@keyframes heartPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: iconGlow 2s ease-in-out infinite;
}

@keyframes iconGlow {
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
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.favorites-count-premium {
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
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  color: white;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 30px;
}

.loading-heart {
  position: relative;
  width: 80px;
  height: 80px;
}

.heart-loader {
  position: absolute;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  transform: rotate(45deg);
  animation: heartBeatLoader 1.2s ease-in-out infinite;
  border-radius: 50% 50% 0 50%;
}

.heart-loader::before,
.heart-loader::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  background: inherit;
  border-radius: 50%;
}

.heart-loader::before {
  top: -40px;
  left: 0;
}

.heart-loader::after {
  top: 0;
  left: -40px;
}

.heart-loader-2 {
  transform: rotate(45deg) scale(0.6);
  opacity: 0.6;
  animation-delay: 0.2s;
}

.heart-loader-3 {
  transform: rotate(45deg) scale(0.3);
  opacity: 0.3;
  animation-delay: 0.4s;
}

@keyframes heartBeatLoader {
  0%, 100% {
    transform: rotate(45deg) scale(1);
  }
  50% {
    transform: rotate(45deg) scale(1.2);
  }
}

.loading-text-premium {
  color: rgba(245, 240, 230, 0.7);
  font-size: 1rem;
  letter-spacing: 1px;
}

/* Favorites List Premium */
.favorites-list-premium {
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

.favorites-grid-premium {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Transition Group */
.favorite-list-move,
.favorite-list-enter-active,
.favorite-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.favorite-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.favorite-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.favorite-list-leave-active {
  position: absolute;
}

/* Actions Footer Premium */
.actions-footer-premium {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.clear-all-btn-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: rgba(255, 107, 107, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 50px;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.clear-all-btn-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.2), transparent);
  transition: left 0.4s ease;
}

.clear-all-btn-premium:hover::before {
  left: 100%;
}

.clear-all-btn-premium:hover {
  background: rgba(255, 107, 107, 0.2);
  transform: translateY(-2px);
  border-color: #ff6b6b;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.2);
}

/* Empty State Premium */
.empty-favorites-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  text-align: center;
}

.empty-content-premium {
  animation: fadeInUp 0.6s ease;
}

.empty-animation {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}

.empty-icon-premium {
  color: rgba(245, 240, 230, 0.2);
  animation: floatEmptyFav 3s ease-in-out infinite;
}

@keyframes floatEmptyFav {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-hearts {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-hearts span {
  position: absolute;
  font-size: 20px;
  animation: floatHeartSmall 2s ease-in-out infinite;
}

.floating-hearts span:nth-child(1) {
  top: -20px;
  left: 0;
  animation-delay: 0s;
}

.floating-hearts span:nth-child(2) {
  top: -30px;
  right: 0;
  animation-delay: 0.3s;
}

.floating-hearts span:nth-child(3) {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.6s;
}

@keyframes floatHeartSmall {
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
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.empty-description {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 32px;
  font-size: 1rem;
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
  font-size: 0.95rem;
}

.explore-btn-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Login Prompt Premium */
.login-prompt-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.login-prompt-card-premium {
  max-width: 450px;
  width: 100%;
  padding: 48px 40px;
  background: rgba(11, 11, 15, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  text-align: center;
  animation: fadeInUp 0.6s ease;
  transition: all 0.3s ease;
}

.login-prompt-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.login-prompt-icon {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
  color: var(--gold-primary);
}

.login-prompt-icon svg {
  filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 1;
  }
}

.login-prompt-title {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.login-prompt-description {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 32px;
}

.login-buttons-premium {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.btn-outline-premium {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: transparent;
  border: 2px solid var(--gold-primary);
  color: var(--gold-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-premium:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
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
  .favorites-page-premium {
    padding: 40px 0 60px;
  }
  
  .container-premium {
    padding: 0 20px;
  }
  
  .page-title-premium {
    font-size: 1.6rem;
  }
  
  .title-wrapper-premium {
    gap: 12px;
  }
  
  .title-icon-premium svg {
    width: 32px;
    height: 32px;
  }
  
  .favorites-grid-premium {
    gap: 16px;
  }
  
  .actions-footer-premium {
    justify-content: center;
  }
  
  .empty-title {
    font-size: 1.3rem;
  }
  
  .empty-description {
    font-size: 0.9rem;
    padding: 0 20px;
  }
  
  .login-prompt-card-premium {
    padding: 40px 24px;
    margin: 0 16px;
  }
  
  .login-prompt-title {
    font-size: 1.3rem;
  }
  
  .login-buttons-premium {
    flex-direction: column;
  }
  
  .btn-primary-premium,
  .btn-outline-premium {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container-premium {
    padding: 0 16px;
  }
  
  .page-title-premium {
    font-size: 1.3rem;
  }
  
  .title-wrapper-premium {
    gap: 8px;
  }
  
  .title-icon-premium svg {
    width: 28px;
    height: 28px;
  }
  
  .count-badge {
    font-size: 0.8rem;
  }
  
  .count-text {
    font-size: 0.8rem;
  }
  
  .empty-title {
    font-size: 1.1rem;
  }
  
  .explore-btn-premium {
    padding: 12px 28px;
    font-size: 0.85rem;
  }
  
  .login-prompt-title {
    font-size: 1.1rem;
  }
  
  .login-prompt-description {
    font-size: 0.85rem;
  }
}
</style>