import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Order } from "../models/order.model";
import { useAuthStore } from "./auth";

export const useOrdersStore = defineStore("orders", () => {
  const orders = ref<Order[]>([]);
  const authStore = useAuthStore();

  // Obter chave do localStorage baseada no usuário
  const getStorageKey = () => {
    const userId = authStore.user?.id;
    if (!userId) return null;
    return `orders_user_${userId}`;
  };

  // Carregar pedidos do localStorage do usuário
  const loadOrders = () => {
    const storageKey = getStorageKey();
    if (!storageKey) {
      orders.value = [];
      return;
    }

    const savedOrders = localStorage.getItem(storageKey);
    if (savedOrders) {
      const data = JSON.parse(savedOrders);
      orders.value = data.map((orderData: any) => Order.fromJSON(orderData));
      orders.value.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else {
      orders.value = [];
    }
  };

  // Salvar pedidos no localStorage do usuário
  const saveOrders = () => {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(orders.value.map(o => o.toJSON())));
  };

  // Criar novo pedido
  const createOrder = (
    cartItems: { product: any; quantity: number }[],
    subtotal: number,
    shipping: number,
    discount: number,
    total: number
  ): Order | null => {
    // Verificar se usuário está logado
    if (!authStore.isAuthenticated) {
      console.warn("Tentativa de criar pedido sem usuário logado");
      return null;
    }

    // Criar pedido usando a classe Order
    const newOrder = Order.createFromCart(
      cartItems,
      subtotal,
      shipping,
      discount,
      total,
      authStore.user?.id
    );

    orders.value.unshift(newOrder); // Adicionar no início do array
    saveOrders();
    return newOrder;
  };

  // Atualizar status do pedido
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.value.find((o) => o.id === orderId);
    if (order) {
      order.updateStatus(status);
      saveOrders();
    }
  };

  // Obter pedido por ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.value.find((o) => o.id === orderId);
  };

  // Limpar pedidos do usuário (útil para logout)
  const clearOrders = () => {
    orders.value = [];
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  // Sincronizar com o usuário atual
  const syncWithUser = () => {
    if (authStore.isAuthenticated) {
      loadOrders();
    } else {
      orders.value = [];
    }
  };

  // Contagem de pedidos
  const totalOrders = computed(() => orders.value.length);

  // Status do pedido para exibição (mantido para compatibilidade)
  const getStatusBadge = (status: Order['status']) => {
    const order = new Order('', new Date(), status, 0, 0, 0, 0, []);
    return {
      text: order.getStatusText(),
      color: order.getStatusColor(),
      bg: order.getStatusBg()
    };
  };

  // Formatar data (mantido para compatibilidade)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    orders,
    totalOrders,
    loadOrders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getStatusBadge,
    formatDate,
    clearOrders,
    syncWithUser,
  };
});