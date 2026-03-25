import type { App } from 'vue'

let confirmInstance: any = null

export default {
  install(app: App) {
    const confirmPlugin = {
      confirm(options: any) {
        if (confirmInstance) {
          return confirmInstance.confirm(options)
        }
        console.warn('Confirm instance not initialized yet')
        return Promise.resolve(false)
      }
    }
    
    app.config.globalProperties.$confirm = confirmPlugin
    app.provide('confirm', confirmPlugin)
  },
  setInstance(instance: any) {
    console.log('Confirm instance set:', instance)
    confirmInstance = instance
  },
  getInstance() {
    return confirmInstance
  }
}

// Hook para usar nos componentes
export const useConfirm = () => {
  const confirm = (options: any) => {
    if (confirmInstance) {
      return confirmInstance.confirm(options)
    }
    console.warn('Confirm instance not initialized yet')
    return Promise.resolve(false)
  }
  return { confirm }
}