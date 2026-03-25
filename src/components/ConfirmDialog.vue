<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="confirm-overlay" @click.self="handleCancel">
        <div class="confirm-dialog">
          <div class="dialog-header">
            <div class="header-icon" :class="type">
              <svg v-if="type === 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else-if="type === 'danger'" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <button class="close-btn" @click="handleCancel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="dialog-content">
            <h3 class="dialog-title">{{ title }}</h3>
            <p class="dialog-message">{{ message }}</p>
          </div>
          
          <div class="dialog-actions">
            <button class="btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button class="btn-confirm" :class="type" @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

const visible = ref(false)
let resolvePromise: ((value: boolean) => void) | null = null

const title = ref('Confirmar ação')
const message = ref('Tem certeza que deseja continuar?')
const confirmText = ref('Confirmar')
const cancelText = ref('Cancelar')
const type = ref<'warning' | 'danger' | 'info'>('warning')

const confirm = (options: ConfirmOptions): Promise<boolean> => {
  console.log('Confirm called with options:', options)
  return new Promise((resolve) => {
    title.value = options.title || 'Confirmar ação'
    message.value = options.message || 'Tem certeza que deseja continuar?'
    confirmText.value = options.confirmText || 'Confirmar'
    cancelText.value = options.cancelText || 'Cancelar'
    type.value = options.type || 'warning'
    
    resolvePromise = resolve
    visible.value = true
  })
}

const handleConfirm = () => {
  console.log('Confirm confirmed')
  if (resolvePromise) {
    resolvePromise(true)
  }
  visible.value = false
}

const handleCancel = () => {
  console.log('Confirm cancelled')
  if (resolvePromise) {
    resolvePromise(false)
  }
  visible.value = false
}

defineExpose({
  confirm
})
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.confirm-dialog {
  background: rgba(11, 11, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.3s ease;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0 24px;
}

.header-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
}

.header-icon.warning {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.header-icon.danger {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.header-icon.info {
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold-primary);
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(245, 240, 230, 0.5);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--white-soft);
  background: rgba(255, 255, 255, 0.1);
}

.dialog-content {
  padding: 20px 24px;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--white-soft);
  margin-bottom: 8px;
}

.dialog-message {
  font-size: 0.9rem;
  color: rgba(245, 240, 230, 0.7);
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px 24px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: rgba(59, 58, 64, 0.5);
  color: var(--white-soft);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.btn-cancel:hover {
  background: rgba(59, 58, 64, 0.8);
  transform: translateY(-2px);
}

.btn-confirm {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.btn-confirm.warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: var(--black-primary);
}

.btn-confirm.danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  color: white;
}

.btn-confirm.info {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: translateY(30px);
}
</style>