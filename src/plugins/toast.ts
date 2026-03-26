// src/plugins/toast.ts

import type { App } from 'vue';

// ========== TIPOS ==========

export interface ToastService {
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
}

export interface ToastPlugin extends ToastService {}

export interface UseToastReturn extends ToastService {}

// ========== CONSTANTES ==========
const TOAST_NOT_INITIALIZED = 'Toast instance not initialized yet';

// ========== ESTADO PRIVADO ==========
let toastServiceInstance: ToastService | null = null;

// ========== MÉTODOS PRIVADOS ==========

/**
 * Verifica se a instância do toast está inicializada
 * @returns true se a instância existe
 */
const isToastReady = (): boolean => {
  if (!toastServiceInstance) {
    console.warn(TOAST_NOT_INITIALIZED);
    return false;
  }
  return true;
};

/**
 * Cria um método de toast com validação
 * @param method - Nome do método a ser chamado
 * @returns Função que chama o método com validação
 */
const createToastMethod = (method: keyof ToastService) => {
  return (title: string, message: string, duration?: number): void => {
    if (toastServiceInstance && typeof toastServiceInstance[method] === 'function') {
      (toastServiceInstance[method] as Function)(title, message, duration);
    } else {
      console.warn(TOAST_NOT_INITIALIZED);
    }
  };
};

// ========== CRIAR MÉTODOS ==========
const toastMethods: ToastService = {
  success: createToastMethod('success'),
  error: createToastMethod('error'),
  warning: createToastMethod('warning'),
  info: createToastMethod('info'),
};

// ========== PLUGIN ==========
export default {
  /**
   * Instala o plugin de toast na aplicação Vue
   * @param app - Instância da aplicação Vue
   */
  install(app: App): void {
    // Plugin simplificado para uso em componentes
    const pluginMethods: ToastPlugin = {
      success: toastMethods.success,
      error: toastMethods.error,
      warning: toastMethods.warning,
      info: toastMethods.info,
    };
    
    // Usar type assertion para evitar conflito de tipos
    app.config.globalProperties.$toast = pluginMethods as any;
    app.provide('toast', pluginMethods);
  },

  /**
   * Define a instância do serviço de toast
   * @param instance - Instância do serviço de toast
   */
  setInstance(instance: ToastService): void {
    toastServiceInstance = instance;
  },

  /**
   * Obtém a instância atual do serviço de toast
   * @returns Instância do serviço de toast ou null
   */
  getInstance(): ToastService | null {
    return toastServiceInstance;
  },

  /**
   * Verifica se o toast está disponível
   * @returns true se o toast está disponível
   */
  isAvailable(): boolean {
    return toastServiceInstance !== null;
  },

  /**
   * Reinicia o estado do plugin (útil para testes)
   */
  reset(): void {
    toastServiceInstance = null;
  },
};

// ========== HOOK ==========

/**
 * Hook para usar o toast em componentes Vue
 * @returns Objeto com métodos de toast
 */
export const useToast = (): UseToastReturn => {
  return {
    success: createToastMethod('success'),
    error: createToastMethod('error'),
    warning: createToastMethod('warning'),
    info: createToastMethod('info'),
  };
};

// ========== EXPORTAÇÕES ADICIONAIS ==========

/**
 * Função utilitária para usar toast diretamente
 * @returns Objeto com métodos de toast
 */
export const getToast = (): ToastService => {
  return toastMethods;
};

/**
 * Função para criar um toast com configuração personalizada
 * @param type - Tipo do toast
 * @param title - Título do toast
 * @param message - Mensagem do toast
 * @param duration - Duração em ms
 */
export const showToast = (
  type: keyof ToastService,
  title: string,
  message: string,
  duration?: number
): void => {
  const method = toastMethods[type];
  if (method) {
    method(title, message, duration);
  } else {
    console.warn(`Invalid toast type: ${type}`);
  }
};

// ========== DECLARAÇÃO DE TIPO GLOBAL ==========

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: ToastPlugin;
  }
}

// Exportar tipos
export type { ToastService as ToastServiceType };