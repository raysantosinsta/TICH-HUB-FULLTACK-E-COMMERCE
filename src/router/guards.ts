import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'

// Tipos para os metadados das rotas
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    guestOnly?: boolean
    role?: string | string[]
  }
}

// Guard de Autenticação com feedback visual
export function authenticatedGuard(router: Router) {
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()
    
    // Aguardar carregamento inicial se necessário
    if (authStore.loading) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const isAuthenticated = authStore.isAuthenticated
    
    // Verificar se a rota requer autenticação
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Mostrar toast de aviso
      const toast = useToast()
      toast.warning(
        'Acesso restrito',
        `Você precisa estar logado para acessar ${to.meta.title || 'esta página'}. Faça login para continuar.`,
        4000
      )
      
      // Salvar a rota para redirecionar após login
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Verificar se é rota apenas para visitantes (login/register)
    if (to.meta.guestOnly && isAuthenticated) {
      const toast = useToast()
      toast.info(
        'Você já está logado',
        'Você já está autenticado. Redirecionando para a página inicial.',
        3000
      )
      next('/')
      return
    }
    
    next()
  })
}

// Guard de Autorização (baseado em roles) com feedback visual
export function authorizedGuard(router: Router) {
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()
    const userRole = authStore.userRole
    const toast = useToast()
    
    // Verificar se a rota tem role específica
    if (to.meta.role) {
      const requiredRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
      
      if (!requiredRoles.includes(userRole)) {
        toast.error(
          'Acesso negado',
          'Você não tem permissão para acessar esta página. Apenas administradores podem acessar.',
          4000
        )
        next('/')
        return
      }
    }
    
    next()
  })
}

// Guard de Log (para debug)
export function loggerGuard(router: Router) {
  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (import.meta.env.DEV) {
      console.log(`🔄 Navegando de ${from.path} para ${to.path}`)
      console.log(`📋 Meta:`, to.meta)
    }
    next()
  })
}

// Guard de Título da Página
export function titleGuard(router: Router) {
  router.afterEach((to: RouteLocationNormalized) => {
    if (to.meta.title) {
      document.title = to.meta.title as string
    }
  })
}

// Guard de Scroll (manter posição)
export function scrollGuard(router: Router) {
  router.afterEach((to: RouteLocationNormalized) => {
    if (to.hash) {
      const element = document.querySelector(to.hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

// Combinar todos os guards
export function setupRouterGuards(router: Router) {
  // Ordem importante: logger -> authenticated -> authorized -> title -> scroll
  if (import.meta.env.DEV) {
    loggerGuard(router)
  }
  authenticatedGuard(router)
  authorizedGuard(router)
  titleGuard(router)
  scrollGuard(router)
}