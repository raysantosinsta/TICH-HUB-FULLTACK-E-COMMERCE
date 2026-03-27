import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Order } from "../models/order.model";
import { useAuthStore } from "./auth";

export const useOrdersStore = defineStore("orders", () => {
  // ========== DEPENDÊNCIAS ==========
  const orders = ref<Order[]>([]);
  const authStore = useAuthStore();

  // ========== CONSTANTES ==========
  const STORAGE_PREFIX = "orders_user_";

  // ========== GETTERS ==========

  /** Total de pedidos */
  const totalOrders = computed(() => orders.value.length);
  
  /** Pedidos mais recentes primeiro */
  const recentOrders = computed(() => {
    return [...orders.value].sort((a, b) => b.date.getTime() - a.date.getTime());
  });
  
  /** Pedidos pendentes */
  const pendingOrders = computed(() => {
    return orders.value.filter(order => order.status === "pending");
  });
  
  /** Pedidos em andamento */
  const inProgressOrders = computed(() => {
    return orders.value.filter(order => order.isInProgress);
  });
  
  /** Pedidos entregues */
  const deliveredOrders = computed(() => {
    return orders.value.filter(order => order.isDelivered);
  });
  
  /** Pedidos cancelados */
  const cancelledOrders = computed(() => {
    return orders.value.filter(order => order.status === "cancelled");
  });

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Obtém a chave do localStorage baseada no usuário
   * @returns Chave do localStorage ou null
   */
  const getStorageKey = (): string | null => {
    const userId = authStore.user?.id;
    return userId ? `${STORAGE_PREFIX}${userId}` : null;
  };

  /**
   * Loga mensagens de debug (apenas em desenvolvimento)
   * @param message - Mensagem a ser logada
   * @param data - Dados opcionais
   */
  const debugLog = (message: string, data?: any): void => {
    if (import.meta.env.DEV) {
      console.log(`[OrdersStore] ${message}`, data ?? "");
    }
  };

  /**
   * Salva os pedidos no localStorage do usuário
   */
  const saveOrders = (): void => {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    const ordersData = orders.value.map(order => order.toJSON());
    localStorage.setItem(storageKey, JSON.stringify(ordersData));
    debugLog("Pedidos salvos", orders.value.length);
  };

  /**
   * Carrega os pedidos do localStorage do usuário
   */
  const loadOrders = (): void => {
    const storageKey = getStorageKey();
    
    if (!storageKey) {
      orders.value = [];
      return;
    }

    const savedOrders = localStorage.getItem(storageKey);
    
    if (savedOrders) {
      try {
        const data = JSON.parse(savedOrders);
        orders.value = data.map((orderData: any) => Order.fromJSON(orderData));
        orders.value.sort((a, b) => b.date.getTime() - a.date.getTime());
        debugLog("Pedidos carregados", orders.value.length);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        orders.value = [];
      }
    } else {
      orders.value = [];
      debugLog("Nenhum pedido encontrado");
    }
  };

  // ========== MÉTODOS PÚBLICOS ==========


/**
 * Cria um novo pedido a partir do carrinho
 * @param cartItems - Itens do carrinho
 * @param subtotal - Subtotal do pedido
 * @param shipping - Valor do frete
 * @param discount - Desconto aplicado
 * @param total - Total do pedido
 * @returns Pedido criado ou null
 */
const createOrder = (
  cartItems: { product: any; quantity: number }[],
  subtotal: number,
  shipping: number,
  discount: number,
  total: number
): Order | null => {
  if (!authStore.isAuthenticated) {
    debugLog("Tentativa de criar pedido sem usuário logado");
    return null;
  }

  // Ensure userId is a number
  const userId = authStore.user?.id;
  const numericUserId = userId ? Number(userId) : undefined;
  
  const newOrder = Order.createFromCart(
    cartItems,
    subtotal,
    shipping,
    discount,
    total,
    numericUserId
  );

  orders.value.unshift(newOrder);
  saveOrders();
  debugLog("Novo pedido criado", newOrder.id);
  
  return newOrder;
};

  /**
   * Atualiza o status de um pedido
   * @param orderId - ID do pedido
   * @param status - Novo status
   */
  const updateOrderStatus = (orderId: string, status: Order["status"]): boolean => {
    const order = orders.value.find((o) => o.id === orderId);
    
    if (order) {
      order.updateStatus(status);
      saveOrders();
      debugLog(`Pedido ${orderId} atualizado para status`, status);
      return true;
    }
    
    debugLog(`Pedido ${orderId} não encontrado`);
    return false;
  };

  /**
   * Busca um pedido pelo ID
   * @param orderId - ID do pedido
   */
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.value.find((o) => o.id === orderId) as Order;
  };

  /**
   * Busca pedidos por status
   * @param status - Status do pedido
   */
  const getOrdersByStatus = (status: Order["status"]): Order[] => {
    return orders.value.filter(order => order.status === status) as Order[];
  };

  /**
   * Remove um pedido pelo ID
   * @param orderId - ID do pedido
   */
  const removeOrder = (orderId: string): boolean => {
    const index = orders.value.findIndex((o) => o.id === orderId);
    
    if (index !== -1) {
      orders.value.splice(index, 1);
      saveOrders();
      debugLog(`Pedido ${orderId} removido`);
      return true;
    }
    
    return false;
  };

  /**
   * Limpa todos os pedidos do usuário atual
   */
  const clearOrders = (): void => {
    orders.value = [];
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
      debugLog("Todos os pedidos removidos");
    }
  };

  /**
   * Sincroniza os pedidos com o usuário atual (login/logout)
   */
  const syncWithUser = (): void => {
    if (authStore.isAuthenticated) {
      loadOrders();
    } else {
      orders.value = [];
    }
    debugLog("Sincronizado com usuário", authStore.isAuthenticated);
  };

  // ========== MÉTODOS DE COMPATIBILIDADE ==========

  /**
   * Retorna o badge de status para exibição (mantido para compatibilidade)
   * @param status - Status do pedido
   */
  const getStatusBadge = (status: Order["status"]) => {
    // Criar um objeto temporário para usar os métodos da classe
    const tempOrder = new Order("", new Date(), status, 0, 0, 0, 0, []);
    return {
      text: tempOrder.statusText,
      color: tempOrder.statusColor,
      bg: tempOrder.statusBg,
    };
  };

  /**
   * Formata uma data para exibição (mantido para compatibilidade)
   * @param dateString - String da data
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ========== INICIALIZAÇÃO ==========
  if (authStore.isAuthenticated) {
    loadOrders();
  }

  // ========== RETORNO ==========
  return {
    // Estado
    orders,
    
    // Getters
    totalOrders,
    recentOrders,
    pendingOrders,
    inProgressOrders,
    deliveredOrders,
    cancelledOrders,
    
    // Actions
    loadOrders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    removeOrder,
    clearOrders,
    syncWithUser,
    
    // Métodos de compatibilidade
    getStatusBadge,
    formatDate,
  };
});