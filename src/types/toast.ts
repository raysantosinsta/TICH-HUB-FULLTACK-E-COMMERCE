// src/plugins/toast.ts

import { ref } from 'vue';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration: number;
  closing?: boolean;
  group?: string;
}

export interface ToastServiceMethods {
  add: (toast: Omit<ToastItem, 'id'> & { group?: string }) => string;
  remove: (id: string) => void;
  removeGroup: (group: string) => void;
  removeAllGroups: () => void;
  success: (title: string, message: string, duration?: number, group?: string) => string;
  error: (title: string, message: string, duration?: number, group?: string) => string;
  warning: (title: string, message: string, duration?: number, group?: string) => string;
  info: (title: string, message: string, duration?: number, group?: string) => string;
}

// Tipo para o parâmetro do método add
type AddToastParams = {
  type: ToastItem['type'];
  title: string;
  message: string;
  duration?: number;
  group?: string;
};

class ToastService implements ToastServiceMethods {
  private toasts = ref<ToastItem[]>([]);
  private nextId = 0;

  add(toast: AddToastParams): string {
    const id = `${Date.now()}-${this.nextId++}`;
    const newToast: ToastItem = {
      id,
      type: toast.type,
      title: toast.title,
      message: toast.message,
      duration: toast.duration ?? 3000, // Usar nullish coalescing para garantir valor
      group: toast.group,
    };
    
    this.toasts.value.push(newToast);
    
    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
    
    return id;
  }

  remove(id: string): void {
    const index = this.toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      // Marcar como fechando antes de remover
      const toast = this.toasts.value[index];
      toast.closing = true;
      
      // Atualizar o array para refletir a mudança
      this.toasts.value = [...this.toasts.value];
      
      setTimeout(() => {
        this.toasts.value = this.toasts.value.filter(t => t.id !== id);
      }, 300);
    }
  }

  removeGroup(group: string): void {
    this.toasts.value = this.toasts.value.filter(t => t.group !== group);
  }

  removeAllGroups(): void {
    this.toasts.value = [];
  }

  success(title: string, message: string, duration?: number, group?: string): string {
    return this.add({ type: 'success', title, message, duration, group });
  }

  error(title: string, message: string, duration?: number, group?: string): string {
    return this.add({ type: 'error', title, message, duration, group });
  }

  warning(title: string, message: string, duration?: number, group?: string): string {
    return this.add({ type: 'warning', title, message, duration, group });
  }

  info(title: string, message: string, duration?: number, group?: string): string {
    return this.add({ type: 'info', title, message, duration, group });
  }

  getToasts() {
    return this.toasts;
  }
}

// Criar uma única instância para toda a aplicação
const toastService = new ToastService();

// Exportar a instância padrão
export const toast = toastService;

// Hook para uso em componentes
export const useToast = () => {
  return {
    success: toastService.success.bind(toastService),
    error: toastService.error.bind(toastService),
    warning: toastService.warning.bind(toastService),
    info: toastService.info.bind(toastService),
    add: toastService.add.bind(toastService),
    remove: toastService.remove.bind(toastService),
    removeGroup: toastService.removeGroup.bind(toastService),
    removeAllGroups: toastService.removeAllGroups.bind(toastService),
    getToasts: toastService.getToasts.bind(toastService),
  };
};

// Exportar também a classe para casos de uso avançado
export { ToastService };

// Exportação padrão para compatibilidade
export default toast;