import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CartPage from '../views/CartPage.vue'
import SearchResults from '../views/SearchResults.vue'



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
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
    }
  ]
})

export default router