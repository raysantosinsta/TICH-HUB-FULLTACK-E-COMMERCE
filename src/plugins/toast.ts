import type { App } from 'vue'

let toastInstance: any = null

export default {
  install(app: App) {
    // Criar uma instância global do toast
    const toastPlugin = {
      success(title: string, message: string, duration?: number) {
        if (toastInstance) {
          toastInstance.success(title, message, duration)
        } else {
          console.warn('Toast instance not initialized yet')
        }
      },
      error(title: string, message: string, duration?: number) {
        if (toastInstance) {
          toastInstance.error(title, message, duration)
        } else {
          console.warn('Toast instance not initialized yet')
        }
      },
      warning(title: string, message: string, duration?: number) {
        if (toastInstance) {
          toastInstance.warning(title, message, duration)
        } else {
          console.warn('Toast instance not initialized yet')
        }
      },
      info(title: string, message: string, duration?: number) {
        if (toastInstance) {
          toastInstance.info(title, message, duration)
        } else {
          console.warn('Toast instance not initialized yet')
        }
      }
    }
    
    app.config.globalProperties.$toast = toastPlugin
    app.provide('toast', toastPlugin)
  },
  setInstance(instance: any) {
    toastInstance = instance
  }
}

// Hook para usar nos componentes
export const useToast = () => {
  const toast = {
    success: (title: string, message: string, duration?: number) => {
      if (toastInstance) {
        toastInstance.success(title, message, duration)
      } else {
        console.warn('Toast instance not initialized yet')
      }
    },
    error: (title: string, message: string, duration?: number) => {
      if (toastInstance) {
        toastInstance.error(title, message, duration)
      } else {
        console.warn('Toast instance not initialized yet')
      }
    },
    warning: (title: string, message: string, duration?: number) => {
      if (toastInstance) {
        toastInstance.warning(title, message, duration)
      } else {
        console.warn('Toast instance not initialized yet')
      }
    },
    info: (title: string, message: string, duration?: number) => {
      if (toastInstance) {
        toastInstance.info(title, message, duration)
      } else {
        console.warn('Toast instance not initialized yet')
      }
    }
  }
  return toast
}