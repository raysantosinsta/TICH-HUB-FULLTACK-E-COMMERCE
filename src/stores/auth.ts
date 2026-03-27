import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '../lib/supabase'

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {

  // ========== ESTADO ==========
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  // ========== GETTERS ==========

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || 'guest')
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userId = computed(() => user.value?.id || null)
  const isLoading = computed(() => loading.value)

  // ========== HELPERS ==========

  const dispatchEvent = <T>(eventName: string, detail?: T): void => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }))
  }

  const clearAuthState = (): void => {
    user.value = null
    error.value = null
  }

  // ========== MÉTODOS ==========

  /**
   * Carregar usuário
   */
  const loadUser = async (): Promise<void> => {

    try {

      const { data } = await supabase.auth.getSession()

      const session = data.session

      if (session?.user) {

        user.value = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Usuário',
          role: session.user.user_metadata?.role || 'user'
        }

      } else {

        user.value = null

      }

    } catch (err) {

      console.error('Erro ao carregar usuário:', err)
      clearAuthState()

    } finally {

      loading.value = false

    }

  }

  /**
   * Inicializar auth
   */
  const init = async () => {

    await loadUser()

    supabase.auth.onAuthStateChange((_event, session) => {

      if (session?.user) {

        user.value = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Usuário',
          role: session.user.user_metadata?.role || 'user'
        }

      } else {

        user.value = null

      }

    })

  }

  /**
   * Login
   */
  const login = async (email: string, password: string) => {

    loading.value = true
    error.value = null

    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      await loadUser()

      dispatchEvent('user-login', {
        userId: data.user?.id
      })

      return { success: true }

    } catch (err: any) {

      const message = err.message || 'Erro ao fazer login'
      error.value = message

      return {
        success: false,
        message
      }

    } finally {

      loading.value = false

    }

  }

  /**
   * Registro
   */
  const register = async (
    name: string,
    email: string,
    password: string
  ) => {

    loading.value = true
    error.value = null

    try {

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user'
          }
        }
      })

      if (error) throw error

      await loadUser()

      dispatchEvent('user-login', {
        userId: data.user?.id
      })

      return { success: true }

    } catch (err: any) {

      const message = err.message || 'Erro ao registrar'

      error.value = message

      return {
        success: false,
        message
      }

    } finally {

      loading.value = false

    }

  }

  /**
   * Logout
   */
  const logout = async () => {

  const userId = user.value?.id

  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Erro ao sair:', error)
  }

  clearAuthState()

  dispatchEvent('user-logout', { userId })

}


  /**
   * Atualizar usuário
   */
  const updateUser = async (updatedUser: Partial<User>) => {

    if (!user.value) return

    await supabase.auth.updateUser({
      data: updatedUser
    })

    user.value = {
      ...user.value,
      ...updatedUser
    }

    dispatchEvent('user-updated', {
      user: user.value
    })

  }

  /**
   * Limpar dados
   */
  const clearUserData = () => {
   clearAuthState()
  }

  return {

    user,
    loading,
    error,

    isAuthenticated,
    userRole,
    userName,
    userEmail,
    userId,
    isLoading,

    init,
    loadUser,
    login,
    register,
    logout,
    updateUser,
    clearUserData

  }

})
