import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'

// Importações das views
import HomePage from '../views/HomePage.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CartPage from '../views/CartPage.vue'
import SearchResults from '../views/SearchResults.vue'
import FavoritesPage from '../views/FavoritesPage.vue'
import ProductsPage from '../views/ProductsPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import OrdersPage from '../views/OrdersPage.vue'
import ProfilePage from '../views/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage,
          meta: {
            title: 'Home - ShopHub',
            requiresAuth: false
          }
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfilePage,
          meta: {
            title: 'Meu Perfil - ShopHub',
            requiresAuth: true
          }
        },
        {
          path: 'products',
          name: 'products',
          component: ProductsPage,
          meta: {
            title: 'Produtos - ShopHub',
            requiresAuth: false
          }
        },
        {
          path: 'product/:id',
          name: 'product-detail',
          component: ProductDetail,
          meta: {
            title: 'Detalhe do Produto - ShopHub',
            requiresAuth: false
          }
        },
        {
          path: 'cart',
          name: 'cart',
          component: CartPage,
          meta: {
            title: 'Carrinho - ShopHub',
            requiresAuth: false
          }
        },
        {
          path: 'search',
          name: 'search',
          component: SearchResults,
          meta: {
            title: 'Busca - ShopHub',
            requiresAuth: false
          }
        },
        {
          path: 'favorites',
          name: 'favorites',
          component: FavoritesPage,
          meta: {
            title: 'Meus Favoritos - ShopHub',
            requiresAuth: true
          }
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersPage,
          meta: {
            title: 'Meus Pedidos - ShopHub',
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginPage,
          meta: {
            title: 'Login - ShopHub',
            requiresAuth: false,
            guestOnly: true
          }
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterPage,
          meta: {
            title: 'Registro - ShopHub',
            requiresAuth: false,
            guestOnly: true
          }
        }
      ]
    },
    // Rota 404 - Não encontrado
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundPage.vue'),
      meta: {
        title: 'Página não encontrada - ShopHub',
        requiresAuth: false
      }
    }
  ]
})

// Guardião de rotas principal
router.beforeEach(async (to, from, next) => {
  // Carregar store de autenticação
  const authStore = useAuthStore()
  
  // Garantir que o usuário está carregado
  if (!authStore.isAuthenticated && !authStore.loading) {
    authStore.loadUser()
  }
  
  // Aguardar um pouco para o carregamento
  if (authStore.loading) {
    // Aguardar até 1 segundo para o carregamento
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth as boolean
  const guestOnly = to.meta.guestOnly as boolean
  
  // Log para debug (remover em produção)
  console.log(`Navegando para: ${to.path}`, {
    isAuthenticated,
    requiresAuth,
    guestOnly,
    token: authStore.getToken() ? 'presente' : 'ausente'
  })
  
  // Atualizar título da página
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // Se a rota requer autenticação e usuário não está logado
  if (requiresAuth && !isAuthenticated) {
    // Salvar a rota que o usuário tentou acessar para redirecionar após login
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Se a rota é apenas para visitantes (login/register) e usuário já está logado
  if (guestOnly && isAuthenticated) {
    // Redirecionar para a página inicial
    next('/')
    return
  }
  
  // Se tudo estiver ok, prosseguir
  next()
})

// Guardião de rotas pós-navegação (para analytics, etc)
router.afterEach((to, from) => {
  // Log de navegação (remover em produção)
  console.log(`Navegação concluída: de ${from.path} para ${to.path}`)
  
  // Scroll para o topo ao mudar de página
  if (to.hash) {
    // Se tem hash, rolar para o elemento específico
    const element = document.querySelector(to.hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    // Caso contrário, rolar para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// Tratamento de erros de navegação
router.onError((error) => {
  console.error('Erro na navegação:', error)
  
  // Tratar erro de carregamento de componente
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    console.warn('Falha ao carregar componente. Tentando recarregar...')
    window.location.reload()
  }
})

export default router