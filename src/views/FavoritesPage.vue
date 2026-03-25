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

      <!-- Lista de Favoritos -->
      <div v-if="favorites.length > 0" class="favorites-list">
        <FavoriteItem 
          v-for="product in favorites" 
          :key="product.id"
          :product="product"
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

      <!-- Estado Vazio -->
      <div v-else class="empty-favorites">
        <div class="empty-content">
          <svg class="empty-icon" width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <h2>Você ainda não tem produtos favoritos</h2>
          <p>Comece adicionando produtos que você gosta ❤️</p>
          <router-link to="/" class="explore-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Explorar produtos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useToast } from '../plugins/toast'
import { useConfirm } from '../plugins/confirm'
import FavoriteItem from '../components/FavoriteItem.vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const toast = useToast()
const { confirm } = useConfirm()

const favorites = computed(() => favoritesStore.favorites)
const totalFavorites = computed(() => favoritesStore.totalFavorites)

const clearAllFavorites = async () => {
  console.log('clearAllFavorites called') // Debug
  
  const result = await confirm({
    title: 'Limpar favoritos',
    message: 'Tem certeza que deseja remover todos os produtos dos favoritos? Esta ação não pode ser desfeita.',
    confirmText: 'Sim, limpar tudo',
    cancelText: 'Cancelar',
    type: 'danger'
  })
  
  console.log('Confirm result:', result) // Debug
  
  if (result) {
    console.log('Clearing favorites...') // Debug
    favoritesStore.clearFavorites()
    console.log('Favorites after clear:', favoritesStore.favorites.value) // Debug
    toast.info(
      'Favoritos limpos', 
      'Todos os produtos foram removidos dos favoritos.', 
      3000
    )
  }
}

onMounted(() => {
  favoritesStore.loadFavorites()
  console.log('Favorites loaded:', favoritesStore.favorites.value) // Debug
})
</script>

<style scoped>
/* Seus estilos existentes... */
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
}

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
}
</style>