import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CartPage from '../views/CartPage.vue'
import SearchResults from '../views/SearchResults.vue'
import FavoritesPage from '../views/FavoritesPage.vue'
import ProductsPage from '../views/ProductsPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import OrdersPage from '../views/OrdersPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsPage
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetail
    },
     {
      path: '/cart',
      name: 'cart',
      component: CartPage
    },
     {
      path: '/search',
      name: 'search',
      component: SearchResults
    },
     {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersPage
    }
  ]
})

export default router