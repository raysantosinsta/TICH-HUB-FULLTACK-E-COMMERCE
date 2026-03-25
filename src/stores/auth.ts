import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  // Carregar usuário do localStorage
  const loadUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  // Login simulado
  const login = (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
      // Simular delay de rede
      setTimeout(() => {
        // Credenciais válidas
        const validEmail = 'user@test.com'
        const validPassword = '123456'

        if (email === validEmail && password === validPassword) {
          const loggedUser: User = {
            id: 1,
            name: 'Usuário Teste',
            email: email
          }
          user.value = loggedUser
          localStorage.setItem('user', JSON.stringify(loggedUser))
          resolve({ success: true })
        } else {
          resolve({ 
            success: false, 
            message: 'Email ou senha inválidos. Tente user@test.com / 123456' 
          })
        }
      }, 800)
    })
  }

  // Logout
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  // Registrar novo usuário (simulado)
  const register = (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular registro
        if (email && password && name) {
          const newUser: User = {
            id: Date.now(),
            name: name,
            email: email
          }
          user.value = newUser
          localStorage.setItem('user', JSON.stringify(newUser))
          resolve({ success: true })
        } else {
          resolve({ success: false, message: 'Preencha todos os campos' })
        }
      }, 800)
    })
  }

  return {
    user,
    isAuthenticated,
    loadUser,
    login,
    logout,
    register
  }
})