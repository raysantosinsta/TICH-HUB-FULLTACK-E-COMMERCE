import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { setupRouterGuards } from "./guards";

// Importações das views
import HomePage from "../views/HomePage.vue";
import ProductDetail from "../views/ProductDetail.vue";
import CartPage from "../views/CartPage.vue";
import SearchResults from "../views/SearchResults.vue";
import FavoritesPage from "../views/FavoritesPage.vue";
import ProductsPage from "../views/ProductsPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import OrdersPage from "../views/OrdersPage.vue";
import ProfilePage from "../views/ProfilePage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomePage,
          meta: {
            title: "Home - ShopHub",
            requiresAuth: false,
          },
        },
        {
          path: "profile",
          name: "profile",
          component: ProfilePage,
          meta: {
            title: "Meu Perfil - ShopHub",
            requiresAuth: true,
          },
        },
        {
          path: "products",
          name: "products",
          component: ProductsPage,
          meta: {
            title: "Produtos - ShopHub",
            requiresAuth: false,
          },
        },
        {
          path: "product/:id",
          name: "product-detail",
          component: ProductDetail,
          meta: {
            title: "Detalhe do Produto - ShopHub",
            requiresAuth: false,
          },
        },
        {
          path: "cart",
          name: "cart",
          component: CartPage,
          meta: {
            title: "Carrinho - ShopHub",
            requiresAuth: false,
          },
        },
        {
          path: "search",
          name: "search",
          component: SearchResults,
          // Remova as props para evitar conflitos
          meta: {
            title: "Busca - ShopHub",
            requiresAuth: false,
          },
        },
        {
          path: "favorites",
          name: "favorites",
          component: FavoritesPage,
          meta: {
            title: "Meus Favoritos - ShopHub",
            requiresAuth: true,
          },
        },
        {
          path: "orders",
          name: "orders",
          component: OrdersPage,
          meta: {
            title: "Meus Pedidos - ShopHub",
            requiresAuth: true,
          },
        },
        // Exemplo de rota com role específica (apenas admin)
        {
          path: "admin",
          name: "admin",
          component: () => import("../views/admin/DashboardView.vue"),
          meta: {
            title: "Admin - ShopHub",
            requiresAuth: true,
            role: "admin",
          },
        },
      ],
    },
    {
      path: "/",
      component: AuthLayout,
      children: [
        {
          path: "login",
          name: "login",
          component: LoginPage,
          meta: {
            title: "Login - ShopHub",
            requiresAuth: false,
            guestOnly: true,
          },
        },
        {
          path: "register",
          name: "register",
          component: RegisterPage,
          meta: {
            title: "Registro - ShopHub",
            requiresAuth: false,
            guestOnly: true,
          },
        },
      ],
    },
    // Rota 404 - Não encontrado
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundPage.vue"),
      meta: {
        title: "Página não encontrada - ShopHub",
        requiresAuth: false,
      },
    },
  ],
});

// Configurar todos os guards
setupRouterGuards(router);

// Tratamento de erros de navegação
router.onError((error) => {
  console.error("Erro na navegação:", error);

  if (error.message.includes("Failed to fetch dynamically imported module")) {
    console.warn("Falha ao carregar componente. Tentando recarregar...");
    window.location.reload();
  }
});

export default router;
