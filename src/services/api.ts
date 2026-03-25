import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '../stores/auth';

// Configurações da API
const API_BASE_URL = 'https://fakestoreapi.com';

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
    
    // Se for erro 401 (Não autorizado), fazer logout
    if (error.response?.status === 401) {
      console.log('Token expirado ou inválido. Fazendo logout...');
      authStore.logout();
      
      // Redirecionar para página de login se não estiver nela
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
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

  // Autenticação (simulada com FakeStoreAPI)
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // FakeStoreAPI não tem endpoint de login real
      // Simulando um login que retorna um token
      const mockToken = btoa(`${credentials.username}:${Date.now()}`);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validar credenciais simuladas
      if (credentials.username === 'user@test.com' && credentials.password === '123456') {
        return { token: mockToken };
      }
      
      throw new Error('Credenciais inválidas');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Carrinho (simulado)
  async getCart(userId: number): Promise<any> {
    try {
      // FakeStoreAPI tem endpoint de carrinho
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

  // Método para fazer upload de imagens (simulado)
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
    return error.response?.data?.message || 'Erro na requisição. Tente novamente.';
  }
  return error.message || 'Erro desconhecido.';
};

export default axiosInstance;