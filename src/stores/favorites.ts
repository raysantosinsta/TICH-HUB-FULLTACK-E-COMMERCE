import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import type { Product } from '../types';

export const useFavoritesStore = defineStore('favorites', () => {
  // ========== DEPENDÊNCIAS ==========
  const favorites = ref<Product[]>([]);
  const loading = ref(false);
  const authStore = useAuthStore();

  // ========== CONSTANTES ==========
  const STORAGE_PREFIX = 'favorites_user_';

  // ========== GETTERS ==========

  /** Total de produtos favoritados */
  const totalFavorites = computed(() => favorites.value.length);
  
  /** Verifica se o carrinho está vazio */
  const isEmpty = computed(() => favorites.value.length === 0);

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Obtém a chave do localStorage baseada no usuário
   * @param userId - ID do usuário (opcional)
   */
  const getStorageKey = (userId?: number): string | null => {
    const uid = userId ?? authStore.user?.id;
    return uid ? `${STORAGE_PREFIX}${uid}` : null;
  };

  /**
   * Loga mensagens de debug (apenas em desenvolvimento)
   * @param message - Mensagem a ser logada
   * @param data - Dados opcionais
   */
  const debugLog = (message: string, data?: any): void => {
    if (import.meta.env.DEV) {
      console.log(`[FavoritesStore] ${message}`, data ?? '');
    }
  };

  /**
   * Salva os favoritos no localStorage do usuário atual
   */
  const saveFavorites = (): void => {
    if (!authStore.isAuthenticated) {
      debugLog('Tentativa de salvar favoritos sem usuário autenticado');
      return;
    }

    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    localStorage.setItem(storageKey, JSON.stringify(favorites.value));
    debugLog(`Favoritos salvos para usuário ${authStore.user?.id}`, favorites.value.length);
  };

  /**
   * Carrega os favoritos do localStorage do usuário atual
   */
  const loadFavorites = (): void => {
    if (!authStore.isAuthenticated) {
      favorites.value = [];
      return;
    }

    loading.value = true;
    
    try {
      const storageKey = getStorageKey();
      if (!storageKey) {
        favorites.value = [];
        return;
      }
      
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        favorites.value = JSON.parse(saved);
        debugLog(`Favoritos carregados para usuário ${authStore.user?.id}`, favorites.value.length);
      } else {
        favorites.value = [];
        debugLog(`Nenhum favorito encontrado para usuário ${authStore.user?.id}`);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      favorites.value = [];
    } finally {
      loading.value = false;
    }
  };

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Verifica se um produto está nos favoritos
   * @param productId - ID do produto
   */
  const isFavorite = (productId: number): boolean => {
    return favorites.value.some(item => item.id === productId);
  };

  /**
   * Adiciona um produto aos favoritos
   * @param product - Produto a ser adicionado
   */
  const addToFavorites = (product: Product): boolean => {
    if (!authStore.isAuthenticated) {
      debugLog('Tentativa de adicionar favorito sem usuário autenticado');
      return false;
    }

    if (isFavorite(product.id)) {
      debugLog(`Produto ${product.id} já está nos favoritos`);
      return false;
    }

    favorites.value.push(product);
    saveFavorites();
    debugLog(`Produto ${product.id} adicionado aos favoritos`);
    return true;
  };

  /**
   * Remove um produto dos favoritos
   * @param productId - ID do produto a ser removido
   */
  const removeFromFavorites = (productId: number): boolean => {
    if (!authStore.isAuthenticated) {
      debugLog('Tentativa de remover favorito sem usuário autenticado');
      return false;
    }

    const index = favorites.value.findIndex(item => item.id === productId);
    if (index === -1) {
      debugLog(`Produto ${productId} não encontrado nos favoritos`);
      return false;
    }

    favorites.value.splice(index, 1);
    saveFavorites();
    debugLog(`Produto ${productId} removido dos favoritos`);
    return true;
  };

  /**
   * Alterna o estado de favorito de um produto
   * @param product - Produto a ser alternado
   * @returns true se foi adicionado, false se foi removido
   */
  const toggleFavorite = (product: Product): boolean => {
    if (!authStore.isAuthenticated) {
      debugLog('Tentativa de toggle favorito sem usuário autenticado');
      return false;
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      return false;
    } else {
      addToFavorites(product);
      return true;
    }
  };

  /**
   * Limpa todos os favoritos do usuário atual
   */
  const clearFavorites = (): void => {
    if (!authStore.isAuthenticated) {
      debugLog('Tentativa de limpar favoritos sem usuário autenticado');
      return;
    }

    debugLog('Limpando favoritos', favorites.value.length);
    favorites.value = [];
    saveFavorites();
    debugLog('Favoritos limpos com sucesso');
  };

  /**
   * Limpa os favoritos de um usuário específico do localStorage
   * @param userId - ID do usuário (opcional)
   */
  const clearUserFavorites = (userId?: number): void => {
    const storageKey = getStorageKey(userId);
    if (storageKey) {
      localStorage.removeItem(storageKey);
      debugLog(`Favoritos do usuário ${userId} removidos do localStorage`);
    }
  };

  /**
   * Sincroniza os favoritos com o usuário atual
   */
  const syncWithUser = (): void => {
    if (authStore.isAuthenticated) {
      loadFavorites();
    } else {
      favorites.value = [];
    }
  };

  // ========== INICIALIZAÇÃO ==========
  if (authStore.isAuthenticated) {
    loadFavorites();
  }

  // ========== RETORNO ==========
  return {
    // Estado
    favorites,
    loading,
    
    // Computed
    totalFavorites,
    isEmpty,
    
    // Actions
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    clearUserFavorites,
    syncWithUser,
    isFavorite, // Mantido para compatibilidade
  };
});