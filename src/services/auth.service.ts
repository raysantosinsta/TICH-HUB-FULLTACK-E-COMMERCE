// src/services/auth.service.ts

// Remover o import não utilizado
// import { jwtDecode } from 'jwt-decode'

// Interface do token decodificado
export interface DecodedToken {
  id: number;
  email: string;
  name: string;
  role: string;
  exp?: number;
  iat?: number;
}

// Usuários mockados (simulando um backend)
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
}

const users: User[] = [
  {
    id: 1,
    email: 'user@test.com',
    password: '123456',
    name: 'Usuário Teste',
    role: 'user',
    createdAt: new Date()
  },
  {
    id: 2,
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date()
  }
];

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Função para gerar token JWT simulado (frontend)
const generateToken = (user: User): string => {
  // Criar um token simulado (não é um JWT real, mas serve para demonstração)
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 dias
  };
  
  // Codificar em base64 (simulação)
  return btoa(JSON.stringify(payload));
};

// Função para verificar token (frontend)
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    // Decodificar o token simulado
    const decoded = JSON.parse(atob(token));
    
    // Verificar se o token expirou
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
};

// Função para decodificar token
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Buscar usuário
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }
      
      // Verificar senha
      if (user.password !== password) {
        return {
          success: false,
          message: 'Senha inválida'
        };
      }
      
      // Gerar token
      const token = generateToken(user);
      
      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro ao fazer login. Tente novamente.'
      };
    }
  }
  
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar se usuário já existe
      const existingUser = users.find(u => u.email === data.email);
      
      if (existingUser) {
        return {
          success: false,
          message: 'Email já cadastrado'
        };
      }
      
      // Criar novo usuário
      const newUser: User = {
        id: users.length + 1,
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'user',
        createdAt: new Date()
      };
      
      users.push(newUser);
      
      // Gerar token
      const token = generateToken(newUser);
      
      return {
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      };
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: 'Erro ao criar conta. Tente novamente.'
      };
    }
  }
  
  verifyToken(token: string): DecodedToken | null {
    return verifyToken(token);
  }
  
  decodeToken(token: string): DecodedToken | null {
    return decodeToken(token);
  }
}

export default new AuthService();