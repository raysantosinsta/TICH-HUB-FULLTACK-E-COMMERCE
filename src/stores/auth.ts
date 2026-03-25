import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService, { type LoginResponse, type RegisterData, verifyToken } from '../services/auth.service'

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'guest')
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const isLoading = computed(() => loading.value)

  // Carregar usuário do localStorage
  const loadUser = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      // Verificar se o token ainda é válido
      const decoded = verifyToken(savedToken)
      if (!decoded) {
        logout()
      }
    }
  }

  // Login
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(email, password)
      
      if (response.success && response.token && response.user) {
        token.value = response.token
        user.value = response.user
        
        // Salvar no localStorage
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return { success: true }
      } else {
        error.value = response.message || 'Email ou senha inválidos'
        return { success: false, message: error.value }
      }
    } catch (err) {
      console.error('Erro no login:', err)
      error.value = 'Erro ao conectar com o servidor'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Registro
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.register({ name, email, password })
      
      if (response.success && response.token && response.user) {
        token.value = response.token
        user.value = response.user
        
        // Salvar no localStorage
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return { success: true }
      } else {
        error.value = response.message || 'Erro ao criar conta'
        return { success: false, message: error.value }
      }
    } catch (err) {
      console.error('Erro no registro:', err)
      error.value = 'Erro ao conectar com o servidor'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Logout - limpar dados do usuário
  const logout = () => {
    // Salvar o ID do usuário antes de limpar
    const userId = user.value?.id
    
    // Limpar estado
    token.value = null
    user.value = null
    error.value = null
    
    // Limpar localStorage de autenticação
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    
    // Disparar evento de logout para outros stores limparem seus dados
    window.dispatchEvent(new CustomEvent('user-logout', { detail: { userId } }))
  }

  // Obter token atual
  const getToken = () => token.value

  // Verificar se o token é válido
  const isTokenValid = (): boolean => {
    if (!token.value) return false
    const decoded = verifyToken(token.value)
    return !!decoded
  }

  // Atualizar dados do usuário
  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    }
  }

  // Carregar usuário ao iniciar
  loadUser()

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
    isLoading,
    
    // Actions
    loadUser,
    login,
    register,
    logout,
    getToken,
    isTokenValid,
    updateUser
  }
})