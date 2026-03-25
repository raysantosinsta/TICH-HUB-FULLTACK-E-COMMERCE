<template>
  <div v-if="isLoading" class="app-loading-overlay">
    <Card class="loading-card">
      <template #content>
        <div class="loading-content">
          <div class="custom-spinner">
            <ProgressSpinner 
              strokeWidth="4" 
              animationDuration=".8s"
              style="width: 60px; height: 60px"
              :style="{ 'stroke': 'var(--gold-primary)' }"
            />
          </div>
          <p class="loading-message">{{ message }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isLoading = computed(() => authStore.isLoading)

const message = computed(() => {
  if (authStore.isLoading) {
    return 'Carregando...'
  }
  return ''
})
</script>

<style scoped>
.app-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(11, 11, 15, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

.loading-card {
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 24px;
  min-width: 240px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.loading-content {
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.custom-spinner {
  position: relative;
}

.loading-message {
  color: #F5F0E6;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Customização do ProgressSpinner */
:deep(.p-progressspinner) {
  color: #D4AF37;
}

:deep(.p-progressspinner-circle) {
  stroke: #D4AF37 !important;
  stroke-width: 4 !important;
  animation: custom-progress-spinner-dash 1.5s ease-in-out infinite, custom-progress-spinner-color 6s ease-in-out infinite;
}

/* Animação personalizada para o spinner */
@keyframes custom-progress-spinner-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}

@keyframes custom-progress-spinner-color {
  0%, 100% {
    stroke: #D4AF37;
  }
  40% {
    stroke: #D4AF37;
  }
  66% {
    stroke: #D4AF37;
  }
  80%, 90% {
    stroke: #D4AF37;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>