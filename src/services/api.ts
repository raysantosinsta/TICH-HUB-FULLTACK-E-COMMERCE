import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '../stores/auth';

// Configurações da API
const API_BASE_URL = 'https://fakestoreapi.com';

// Flag para evitar múltiplas tentativas de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Processar fila de requisições
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Criar instância do axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token JWT em todas as requisições
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    const token = authStore.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const authStore = useAuthStore();
    const originalRequest = error.config as any;
    
    // Se for erro 401 (Não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Token expirado ou inválido.');
      
      // Se já estiver tentando refresh, adicionar à fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Tentar renovar o token (simulado)
        // Em um cenário real, você chamaria um endpoint de refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // Simular refresh token
          // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          // const newToken = response.data.token;
          
          // Simulação de novo token
          const newToken = btoa(`user:${Date.now()}`);
          
          // Atualizar token no store
          // authStore.updateToken?.(newToken); // Se tiver método updateToken
          localStorage.setItem('auth_token', newToken);
          
          // Processar fila de requisições
          processQueue(null, newToken);
          
          // Repetir a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('No refresh token available');
        }
      } catch (refreshError) {
        // Se falhar ao renovar, fazer logout
        console.log('Falha ao renovar token. Fazendo logout...');
        processQueue(refreshError as Error, null);
        authStore.logout();
        
        // Redirecionar para página de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Se for erro 403 (Proibido - sem permissão)
    if (error.response?.status === 403) {
      console.log('Acesso negado. Você não tem permissão para esta ação.');
      
      // Opcional: redirecionar para página de acesso negado
      if (window.location.pathname !== '/forbidden' && window.location.pathname !== '/login') {
        window.location.href = '/forbidden';
      }
    }
    
    return Promise.reject(error);
  }
);

// Tipos para as respostas da API
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  discount?: number;
}

export interface Category {
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// API Service
export const api = {
  // Produtos
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get('/products');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await axiosInstance.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
      throw error;
    }
  },

  async getAllCategories(): Promise<string[]> {
    try {
      const response = await axiosInstance.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  async getLimitedProducts(limit: number): Promise<Product[]> {
    try {
      const response = await axiosInstance.get(`/products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${limit} produtos:`, error);
      throw error;
    }
  },

  async getProductsSorted(sort: 'asc' | 'desc'): Promise<Product[]> {
    try {
      const response = await axiosInstance.get(`/products?sort=${sort}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produtos ordenados por ${sort}:`, error);
      throw error;
    }
  },

  // Autenticação
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // FakeStoreAPI não tem endpoint de login real
      // Simulando um login que retorna um token
      const mockToken = btoa(`${credentials.username}:${Date.now()}`);
      const mockRefreshToken = btoa(`refresh:${credentials.username}:${Date.now()}`);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validar credenciais simuladas
      if (credentials.username === 'user@test.com' && credentials.password === '123456') {
        return { 
          token: mockToken,
          refreshToken: mockRefreshToken,
          user: {
            id: 1,
            name: 'Usuário Teste',
            email: credentials.username,
            role: 'user'
          }
        };
      }
      
      if (credentials.username === 'admin@test.com' && credentials.password === 'admin123') {
        return { 
          token: mockToken,
          refreshToken: mockRefreshToken,
          user: {
            id: 2,
            name: 'Administrador',
            email: credentials.username,
            role: 'admin'
          }
        };
      }
      
      throw new Error('Credenciais inválidas');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Refresh token (simulado)
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      // Simular refresh token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newToken = btoa(`refreshed:${Date.now()}`);
      
      return {
        token: newToken,
        refreshToken: btoa(`refresh:${Date.now()}`)
      };
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
    }
  },

  // Carrinho
  async getCart(userId: number): Promise<any> {
    try {
      const response = await axiosInstance.get(`/carts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      throw error;
    }
  },

  async addToCart(cartData: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/carts', cartData);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  },

  async updateCart(cartId: number, cartData: any): Promise<any> {
    try {
      const response = await axiosInstance.put(`/carts/${cartId}`, cartData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
      throw error;
    }
  },

  // Usuários
  async getAllUsers(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  async getUserById(id: number): Promise<any> {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  },

  async createUser(userData: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async updateUser(id: number, userData: any): Promise<any> {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      throw error;
    }
  },

  // Upload de imagens (simulado)
  async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        url: URL.createObjectURL(file)
      };
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  }
};

// Helper para tratar erros de forma consistente
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return 'Sessão expirada. Por favor, faça login novamente.';
    }
    if (error.response?.status === 403) {
      return 'Você não tem permissão para realizar esta ação.';
    }
    if (error.response?.status === 404) {
      return 'Recurso não encontrado.';
    }
    if (error.response?.status === 500) {
      return 'Erro no servidor. Tente novamente mais tarde.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Tempo limite excedido. Verifique sua conexão.';
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Erro de rede. Verifique sua conexão com a internet.';
    }
    return error.response?.data?.message || 'Erro na requisição. Tente novamente.';
  }
  return error.message || 'Erro desconhecido.';
};

export default axiosInstance;