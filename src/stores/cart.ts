import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Cart } from '../models/cart.model';
import { useAuthStore } from './auth';
import type { Product } from '../types';

export const useCartStore = defineStore('cart', () => {
  // ========== DEPENDÊNCIAS ==========
  // Forçar o tipo correto com as generics do ref
  const cartInstance = ref<Cart>(new Cart());
  const authStore = useAuthStore();

  // ========== CONSTANTES ==========
  const FREE_SHIPPING_THRESHOLD = 200;
  const DISCOUNT_THRESHOLD = 500;
  const DISCOUNT_RATE = 0.1;
  const DEFAULT_SHIPPING = 15.9;

  // ========== GETTERS ==========

  /** Itens do carrinho */
  const items = computed(() => cartInstance.value.items);
  
  /** Total de itens no carrinho */
  const totalItems = computed(() => cartInstance.value.totalItems);
  
  /** Subtotal (soma dos produtos sem descontos) */
  const subtotal = computed(() => cartInstance.value.subtotal);
  
  /** Desconto total aplicado aos produtos */
  const totalDiscount = computed(() => cartInstance.value.totalDiscount);
  
  /** Total com desconto dos produtos */
  const totalWithDiscount = computed(() => cartInstance.value.total);

  /** Valor do frete (simulado) */
  const shipping = computed(() => {
    return subtotal.value > FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING;
  });

  /** Desconto promocional (simulado) */
  const discount = computed(() => {
    return subtotal.value > DISCOUNT_THRESHOLD ? subtotal.value * DISCOUNT_RATE : 0;
  });

  /** Total final do pedido (com frete e desconto) */
  const total = computed(() => {
    return subtotal.value + shipping.value - discount.value;
  });

  /** Verifica se o carrinho está vazio */
  const isEmpty = computed(() => cartInstance.value.isEmpty);

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Obtém a chave do localStorage baseada no usuário
   */
  const getStorageKey = (): string | null => {
    const userId = authStore.user?.id;
    return userId ? `cart_user_${userId}` : null;
  };

  /**
   * Salva o carrinho no localStorage
   */
  const saveCart = (): void => {
    const storageKey = getStorageKey();
    const cartData = JSON.stringify(cartInstance.value.toJSON());
    
    if (storageKey) {
      localStorage.setItem(storageKey, cartData);
    } else {
      localStorage.setItem('cart_guest', cartData);
    }
  };

  /**
   * Carrega o carrinho do localStorage
   */
  const loadCart = (): void => {
    const storageKey = getStorageKey();
    let savedData: string | null = null;
    
    if (storageKey) {
      savedData = localStorage.getItem(storageKey);
    } else {
      savedData = localStorage.getItem('cart_guest');
    }
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        // Usar as generics para garantir o tipo
        cartInstance.value = Cart.fromJSON(data);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        cartInstance.value = new Cart();
      }
    } else {
      cartInstance.value = new Cart();
    }
  };

  /**
   * Mescla o carrinho do convidado com o carrinho do usuário
   */
  const mergeGuestCartWithUserCart = (userCart: Cart): Cart => {
    const guestCartData = localStorage.getItem('cart_guest');
    
    if (guestCartData) {
      try {
        const guestCart = Cart.fromJSON(JSON.parse(guestCartData));
        userCart.mergeWith(guestCart);
        localStorage.removeItem('cart_guest');
      } catch (error) {
        console.error('Erro ao mesclar carrinho:', error);
      }
    }
    
    return userCart;
  };

  /**
   * Carrega o carrinho do usuário autenticado
   */
  const loadUserCart = (userId: number): void => {
    const userCartKey = `cart_user_${userId}`;
    const savedUserCart = localStorage.getItem(userCartKey);
    
    if (savedUserCart) {
      try {
        const data = JSON.parse(savedUserCart);
        const userCart = Cart.fromJSON(data);
        cartInstance.value = mergeGuestCartWithUserCart(userCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho do usuário:', error);
        cartInstance.value = new Cart();
      }
    } else {
      // Usuário não tinha carrinho, verificar carrinho de convidado
      const guestCart = localStorage.getItem('cart_guest');
      if (guestCart) {
        try {
          cartInstance.value = Cart.fromJSON(JSON.parse(guestCart));
          localStorage.removeItem('cart_guest');
        } catch (error) {
          console.error('Erro ao carregar carrinho de convidado:', error);
          cartInstance.value = new Cart();
        }
      } else {
        cartInstance.value = new Cart();
      }
    }
  };

  /**
   * Carrega o carrinho do convidado
   */
  const loadGuestCart = (): void => {
    const guestCart = localStorage.getItem('cart_guest');
    if (guestCart) {
      try {
        cartInstance.value = Cart.fromJSON(JSON.parse(guestCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho de convidado:', error);
        cartInstance.value = new Cart();
      }
    } else {
      cartInstance.value = new Cart();
    }
  };

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Sincroniza o carrinho com o usuário atual (login/logout)
   */
  const syncWithUser = (): void => {
    if (authStore.isAuthenticated) {
      const userId = authStore.user?.id;
      if (userId) {
        loadUserCart(userId);
      }
    } else {
      loadGuestCart();
    }
    saveCart();
  };

  /**
   * Adiciona um produto ao carrinho
   */
  const addToCart = (product: Product, quantity: number = 1): boolean => {
    cartInstance.value.addItem(product, quantity);
    saveCart();
    return true;
  };

  /**
   * Remove um produto do carrinho
   */
  const removeFromCart = (productId: number): void => {
    cartInstance.value.removeItem(productId);
    saveCart();
  };

  /**
   * Atualiza a quantidade de um produto no carrinho
   */
  const updateQuantity = (productId: number, quantity: number): void => {
    cartInstance.value.updateQuantity(productId, quantity);
    saveCart();
  };

  /**
   * Limpa todo o carrinho
   */
  const clearCart = (): void => {
    cartInstance.value.clearCart();
    saveCart();
  };

  /**
   * Limpa o carrinho do usuário (útil para logout)
   */
  const clearUserCart = (): void => {
    cartInstance.value.clearCart();
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    saveCart();
  };

  /**
   * Retorna o carrinho atual
   */
  const getCurrentCart = (): Cart => {
    return cartInstance.value as Cart; // Forçar o tipo
  };

  // ========== INICIALIZAÇÃO ==========
  loadCart();

  // ========== RETORNO ==========
  return {
    // Estado
    items,
    totalItems,
    subtotal,
    totalDiscount,
    totalWithDiscount,
    shipping,
    discount,
    total,
    isEmpty,
    
    // Actions
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUserCart,
    syncWithUser,
    getCurrentCart,
  };
});