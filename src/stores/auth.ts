import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import authService, { verifyToken } from '../services/auth.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  // ========== ESTADO ==========
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ========== GETTERS ==========

  /** Verifica se o usuário está autenticado */
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  
  /** Papel do usuário (role) */
  const userRole = computed(() => user.value?.role || 'guest');
  
  /** Nome do usuário */
  const userName = computed(() => user.value?.name || '');
  
  /** Email do usuário */
  const userEmail = computed(() => user.value?.email || '');
  
  /** ID do usuário */
  const userId = computed(() => user.value?.id || null);
  
  /** Alias para loading (compatibilidade) */
  const isLoading = computed(() => loading.value);

  // ========== MÉTODOS PRIVADOS (Helpers) ==========

  /**
   * Salva os dados de autenticação no localStorage
   */
  const saveToStorage = (authToken: string, userData: User): void => {
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  /**
   * Limpa os dados de autenticação do localStorage
   */
  const clearStorage = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  /**
   * Dispara um evento customizado
   */
  const dispatchEvent = <T>(eventName: string, detail?: T): void => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  /**
   * Define o estado de autenticação
   */
  const setAuthState = (authToken: string, userData: User): void => {
    token.value = authToken;
    user.value = userData;
    saveToStorage(authToken, userData);
  };

  /**
   * Limpa o estado de autenticação
   */
  const clearAuthState = (): void => {
    token.value = null;
    user.value = null;
    error.value = null;
    clearStorage();
  };

  /**
   * Gerencia erros de forma consistente
   */
  const handleError = (err: unknown, defaultMessage: string): string => {
    console.error(defaultMessage, err);
    error.value = defaultMessage;
    return defaultMessage;
  };

  /**
   * Processa a resposta de autenticação
   */
  const processAuthResponse = (response: {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
  }): { success: boolean; message?: string } => {
    if (response.success && response.token && response.user) {
      setAuthState(response.token, response.user);
      dispatchEvent('user-login', { userId: response.user.id });
      return { success: true };
    }
    
    const errorMsg = response.message || 'Erro na autenticação';
    error.value = errorMsg;
    return { success: false, message: errorMsg };
  };

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Carrega os dados do usuário do localStorage
   */
  const loadUser = (): void => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken;
        user.value = JSON.parse(savedUser);
        
        // Verificar se o token ainda é válido
        const decoded = verifyToken(savedToken);
        if (!decoded) {
          logout();
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        clearAuthState();
      }
    }
  };

  /**
   * Realiza login do usuário
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(email, password);
      return processAuthResponse(response);
    } catch (err) {
      const message = handleError(err, 'Erro ao conectar com o servidor');
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Realiza registro de novo usuário
   */
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.register({ name, email, password });
      return processAuthResponse(response);
    } catch (err) {
      const message = handleError(err, 'Erro ao conectar com o servidor');
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Realiza logout do usuário
   */
  const logout = (): void => {
    const userId = user.value?.id;
    clearAuthState();
    dispatchEvent('user-logout', { userId });
  };

  /**
   * Retorna o token atual
   */
  const getToken = (): string | null => token.value;

  /**
   * Verifica se o token é válido
   */
  const isTokenValid = (): boolean => {
    if (!token.value) return false;
    const decoded = verifyToken(token.value);
    return !!decoded;
  };

  /**
   * Atualiza os dados do usuário
   */
  const updateUser = (updatedUser: Partial<User>): void => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser };
      localStorage.setItem('auth_user', JSON.stringify(user.value));
      dispatchEvent('user-updated', { user: user.value });
    }
  };

  /**
   * Limpa todos os dados do usuário (útil quando a conta é excluída)
   */
  const clearUserData = (): void => {
    const userId = user.value?.id;
    clearAuthState();
    dispatchEvent('user-data-clear', { userId });
  };

  // ========== INICIALIZAÇÃO ==========
  loadUser();

  // ========== RETORNO ==========
  return {
    // Estado
    token,
    user,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    userRole,
    userName,
    userEmail,
    userId,
    isLoading,
    
    // Actions
    loadUser,
    login,
    register,
    logout,
    getToken,
    isTokenValid,
    updateUser,
    clearUserData,
  };
});