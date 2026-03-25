<template>
  <div class="cart-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <h1 class="page-title">Meu Carrinho</h1>

      <!-- Carrinho Vazio -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <div class="empty-cart-icon">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="#D4AF37" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <h2>Seu carrinho está vazio</h2>
          <p>Parece que você ainda não adicionou nenhum produto ao carrinho.</p>
          <router-link to="/" class="continue-shopping-btn">Ver produtos</router-link>
        </div>
      </div>

      <!-- Carrinho com Produtos -->
      <div v-else class="cart-content">
        <!-- Lista de Produtos -->
        <div class="cart-items">
          <div class="cart-header">
            <span class="product-col">Produto</span>
            <span class="price-col">Preço</span>
            <span class="quantity-col">Quantidade</span>
            <span class="subtotal-col">Subtotal</span>
            <span class="action-col"></span>
          </div>

          <div 
            v-for="item in cartItems" 
            :key="item.product.id"
            class="cart-item"
          >
            <div class="product-col">
              <div class="product-info">
                <div class="product-image" @click="goToProduct(item.product.id)">
                  <img :src="item.product.image" :alt="item.product.title">
                </div>
                <div class="product-details">
                  <h3 class="product-title" @click="goToProduct(item.product.id)">
                    {{ truncateTitle(item.product.title) }}
                  </h3>
                  <span class="product-category">{{ formatCategory(item.product.category) }}</span>
                </div>
              </div>
            </div>

            <div class="price-col">
              <span class="price">R$ {{ formatPrice(item.product.price) }}</span>
            </div>

            <div class="quantity-col">
              <div class="quantity-selector">
                <button 
                  class="qty-btn" 
                  @click="updateQuantity(item.product.id, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button 
                  class="qty-btn" 
                  @click="updateQuantity(item.product.id, item.quantity + 1)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="subtotal-col">
              <span class="subtotal">R$ {{ formatPrice(item.product.price * item.quantity) }}</span>
            </div>

            <div class="action-col">
              <button class="remove-btn" @click="removeItem(item.product.id, item.product.title)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumo do Pedido -->
        <div class="order-summary">
          <h3 class="summary-title">Resumo do Pedido</h3>
          
          <div class="summary-row">
            <span>Subtotal</span>
            <span>R$ {{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="summary-row">
            <span>Frete</span>
            <span>{{ shipping === 0 ? 'Grátis' : `R$ ${formatPrice(shipping)}` }}</span>
          </div>
          
          <div v-if="discount > 0" class="summary-row discount">
            <span>Desconto (10%)</span>
            <span>- R$ {{ formatPrice(discount) }}</span>
          </div>
          
          <div class="summary-row total">
            <span>Total</span>
            <span>R$ {{ formatPrice(total) }}</span>
          </div>
          
          <div class="summary-actions">
            <router-link to="/" class="continue-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Continuar comprando
            </router-link>
            <button class="checkout-btn" @click="finalizeOrder" :disabled="checkoutLoading">
              <span v-if="checkoutLoading" class="spinner-small"></span>
              <span v-else>Finalizar compra</span>
              <svg v-if="!checkoutLoading" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'
import { useConfirm } from '../plugins/confirm'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const toast = useToast()
const { confirm } = useConfirm()

const checkoutLoading = ref(false)

const cartItems = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)
const shipping = computed(() => cartStore.shipping)
const discount = computed(() => cartStore.discount)
const total = computed(() => cartStore.total)

const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',')
}

const formatCategory = (category: string) => {
  const categories: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    "jewelery": "Jóias",
    "electronics": "Eletrônicos"
  }
  return categories[category] || category
}

const truncateTitle = (title: string) => {
  return title.length > 50 ? title.substring(0, 47) + '...' : title
}

const updateQuantity = (productId: number, quantity: number) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeItem = (productId: number, productTitle: string) => {
  cartStore.removeFromCart(productId)
  toast.success('Item removido', `${productTitle} foi removido do carrinho.`, 3000)
}

const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`)
}

const finalizeOrder = async () => {
  if (!authStore.isAuthenticated) {
    const result = await confirm({
      title: 'Login necessário',
      message: 'Você precisa estar logado para finalizar a compra. Deseja fazer login agora?',
      confirmText: 'Fazer login',
      cancelText: 'Cancelar',
      type: 'info'
    })
    
    if (result) {
      router.push('/login')
    }
    return
  }

  if (cartItems.value.length === 0) {
    toast.warning('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar.', 3000)
    return
  }

  const result = await confirm({
    title: 'Finalizar compra',
    message: `Deseja finalizar a compra no valor total de R$ ${formatPrice(total.value)}?`,
    confirmText: 'Confirmar compra',
    cancelText: 'Cancelar',
    type: 'warning'
  })

  if (result) {
    checkoutLoading.value = true

    // Simular processamento
    setTimeout(() => {
      // Criar itens do pedido
      const orderItems = cartItems.value.map(item => ({
        id: item.product.id,
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        category: item.product.category
      }))

      // Criar pedido
      const order = ordersStore.createOrder(
        orderItems,
        subtotal.value,
        shipping.value,
        discount.value,
        total.value
      )

      // Limpar carrinho
      cartStore.clearCart()

      checkoutLoading.value = false

      toast.success(
        'Pedido finalizado!',
        `Pedido ${order.id} foi criado com sucesso.`,
        4000
      )

      // Redirecionar para página de pedidos
      router.push('/orders')
    }, 1500)
  }
}

onMounted(() => {
  cartStore.loadCart()
})
</script>

<style scoped>
/* Seus estilos existentes do carrinho... */
.cart-page {
  position: relative;
  min-height: 100vh;
  padding: 40px 0 80px;
}

.bg-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
}

.light-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.1) 40%,
    rgba(212, 175, 55, 0.15) 45%,
    rgba(212, 175, 55, 0.2) 50%,
    rgba(212, 175, 55, 0.15) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweep 15s ease-in-out infinite;
}

@keyframes lightSweep {
  0% { background-position: -100% 0%; opacity: 0; }
  20% { opacity: 0.5; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  100% { background-position: 200% 0%; opacity: 0; }
}

.glass-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(2px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 2rem;
  color: var(--white-soft);
  margin-bottom: 32px;
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  text-align: center;
}

.empty-cart-content {
  animation: fadeInUp 0.5s ease;
}

.empty-cart-icon {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-cart h2 {
  color: var(--white-soft);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.empty-cart p {
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 24px;
}

.continue-shopping-btn {
  display: inline-block;
  padding: 12px 32px;
  background: var(--gold-primary);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.continue-shopping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

.cart-items {
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.cart-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1.2fr 1.2fr 0.5fr;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1.2fr 1.2fr 0.5fr;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: rgba(212, 175, 55, 0.05);
  margin: 0 -24px;
  padding: 20px 24px;
  border-radius: 12px;
}

.product-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.product-image {
  width: 80px;
  height: 80px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
  transition: transform 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.1);
}

.product-title {
  color: var(--white-soft);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.product-title:hover {
  color: var(--gold-primary);
}

.product-category {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
}

.price-col .price,
.subtotal-col .subtotal {
  color: var(--gold-primary);
  font-weight: 500;
}

.quantity-selector {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 30px;
  padding: 4px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-primary);
}

.qty-btn:hover:not(:disabled) {
  background: var(--gold-primary);
  color: var(--black-primary);
  border-color: var(--gold-primary);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  color: var(--white-soft);
  font-weight: 500;
  min-width: 32px;
  text-align: center;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(245, 240, 230, 0.4);
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  transform: scale(1.1);
}

.order-summary {
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  position: sticky;
  top: 100px;
  height: fit-content;
}

.summary-title {
  color: var(--white-soft);
  font-size: 1.3rem;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  color: rgba(245, 240, 230, 0.8);
}

.summary-row.discount {
  color: #4caf50;
}

.summary-row.total {
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--gold-primary);
}

.summary-actions {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.continue-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--white-soft);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--black-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .order-summary {
    position: static;
  }

  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 16px;
    position: relative;
    padding: 20px;
  }

  .product-col {
    grid-column: 1 / -1;
  }

  .product-info {
    flex-direction: column;
    text-align: center;
  }

  .product-image {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }

  .product-details {
    text-align: center;
  }

  .price-col, .quantity-col, .subtotal-col {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  .price-col::before {
    content: "Preço:";
    color: rgba(245, 240, 230, 0.6);
  }

  .quantity-col::before {
    content: "Quantidade:";
    color: rgba(245, 240, 230, 0.6);
  }

  .subtotal-col::before {
    content: "Subtotal:";
    color: rgba(245, 240, 230, 0.6);
  }

  .action-col {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .cart-items {
    padding: 16px;
  }
}
</style>