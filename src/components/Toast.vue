<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="toast.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click.stop="removeToast(toast.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="toast-progress" :style="{ animationDuration: `${toast.duration}ms` }"></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ToastItem } from '../types/toast'

const toasts = ref<ToastItem[]>([])

let nextId = 0

const addToast = (
  type: ToastItem['type'],
  title: string,
  message: string,
  duration: number = 3000
) => {
  const id = `${Date.now()}-${nextId++}`
  const toast: ToastItem = {
    id,
    type,
    title,
    message,
    duration
  }
  
  toasts.value.push(toast)
  
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// Expor métodos para uso global
defineExpose({
  addToast,
  success: (title: string, message: string, duration?: number) => 
    addToast('success', title, message, duration),
  error: (title: string, message: string, duration?: number) => 
    addToast('error', title, message, duration),
  warning: (title: string, message: string, duration?: number) => 
    addToast('warning', title, message, duration),
  info: (title: string, message: string, duration?: number) => 
    addToast('info', title, message, duration)
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  min-width: 320px;
  max-width: 400px;
  background: rgba(11, 11, 15, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.toast:hover {
  transform: translateX(-5px);
  border-color: var(--gold-primary);
}

/* Tipos de Toast */
.toast.success {
  border-left: 4px solid #4caf50;
}

.toast.success .toast-icon {
  color: #4caf50;
}

.toast.error {
  border-left: 4px solid #ff6b6b;
}

.toast.error .toast-icon {
  color: #ff6b6b;
}

.toast.warning {
  border-left: 4px solid #ffc107;
}

.toast.warning .toast-icon {
  color: #ffc107;
}

.toast.info {
  border-left: 4px solid var(--gold-primary);
}

.toast.info .toast-icon {
  color: var(--gold-primary);
}

/* Ícone */
.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Conteúdo */
.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: var(--white-soft);
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.toast-message {
  font-size: 0.85rem;
  color: rgba(245, 240, 230, 0.7);
  line-height: 1.4;
}

/* Botão fechar */
.toast-close {
  background: transparent;
  border: none;
  color: rgba(245, 240, 230, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--white-soft);
  background: rgba(255, 255, 255, 0.1);
}

/* Barra de progresso */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--gold-primary);
  animation: progress linear forwards;
}

.toast.success .toast-progress {
  background: #4caf50;
}

.toast.error .toast-progress {
  background: #ff6b6b;
}

.toast.warning .toast-progress {
  background: #ffc107;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Animações de entrada/saída */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsividade */
@media (max-width: 768px) {
  .toast-container {
    top: 70px;
    right: 16px;
    left: 16px;
  }
  
  .toast {
    min-width: auto;
    width: 100%;
    max-width: none;
  }
}
</style>