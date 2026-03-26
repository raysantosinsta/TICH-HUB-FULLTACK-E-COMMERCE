<template>
  <div class="cart-page-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="cart-particles">
        <div v-for="i in 40" :key="i" class="cart-particle" :style="getParticleStyle(i)">
          🛍️
        </div>
      </div>
    </div>

    <div class="container-premium">
      <div class="page-header-premium">
        <div class="title-wrapper-premium">
          <div class="title-icon-premium">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            <div class="icon-glow"></div>
          </div>
          <h1 class="page-title-premium">Meu <span class="gold-text">Carrinho</span></h1>
        </div>
      </div>

      <!-- Carrinho Vazio Premium -->
      <div v-if="cartItems.length === 0" class="empty-cart-premium">
        <div class="empty-cart-card-premium">
          <div class="empty-cart-animation">
            <div class="shopping-bag">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              <div class="floating-items">
                <span>🛍️</span>
                <span>🛒</span>
                <span>✨</span>
              </div>
            </div>
          </div>
          <h2 class="empty-title">Seu carrinho está vazio</h2>
          <p class="empty-description">Parece que você ainda não adicionou nenhum produto. Explore nossa coleção e encontre o que você ama!</p>
          <router-link to="/" class="continue-shopping-premium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Explorar produtos
          </router-link>
        </div>
      </div>

      <!-- Carrinho com Produtos Premium -->
      <div v-else class="cart-content-premium">
        <!-- Lista de Produtos -->
        <div class="cart-items-premium">
          <div class="cart-header-premium">
            <span class="product-col-premium">Produto</span>
            <span class="price-col-premium">Preço</span>
            <span class="quantity-col-premium">Quantidade</span>
            <span class="subtotal-col-premium">Subtotal</span>
            <span class="action-col-premium"></span>
          </div>

          <transition-group name="cart-item" tag="div" class="cart-list-premium">
            <div 
              v-for="item in cartItems" 
              :key="item.product.id"
              class="cart-item-premium"
            >
              <div class="product-col-premium">
                <div class="product-info-premium">
                  <div class="product-image-premium" @click="goToProduct(item.product.id)">
                    <div class="image-wrapper-premium">
                      <img :src="item.product.image" :alt="item.product.title">
                      <div class="image-shine"></div>
                    </div>
                  </div>
                  <div class="product-details-premium">
                    <h3 class="product-title-premium" @click="goToProduct(item.product.id)">
                      {{ truncateTitle(item.product.title) }}
                    </h3>
                    <span class="product-category-premium">{{ formatCategory(item.product.category) }}</span>
                    <div class="product-rating" v-if="item.product.rating">
                      <span class="stars">★ {{ item.product.rating.rate }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="price-col-premium">
                <span class="price-premium">{{ formatPrice(item.product.price) }}</span>
              </div>

              <div class="quantity-col-premium">
                <div class="quantity-selector-premium">
                  <button 
                    class="qty-btn-premium" 
                    @click="updateQuantity(item.product.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <span class="qty-value-premium">{{ item.quantity }}</span>
                  <button 
                    class="qty-btn-premium" 
                    @click="updateQuantity(item.product.id, item.quantity + 1)"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="subtotal-col-premium">
                <span class="subtotal-premium">{{ formatPrice(item.product.price * item.quantity) }}</span>
              </div>

              <div class="action-col-premium">
                <button class="remove-btn-premium" @click="removeItem(item.product.id, item.product.title)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span class="tooltip-remove">Remover</span>
                </button>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Resumo do Pedido Premium -->
        <div class="order-summary-premium">
          <div class="summary-header-premium">
            <h3 class="summary-title-premium">Resumo do Pedido</h3>
            <div class="summary-glow"></div>
          </div>
          
          <div class="summary-row-premium">
            <span>Subtotal</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="summary-row-premium">
            <span>Frete</span>
            <span class="shipping-value">{{ shipping === 0 ? 'Grátis' : formatPrice(shipping) }}</span>
          </div>
          
          <div v-if="discount > 0" class="summary-row-premium discount">
            <span>Desconto (10%)</span>
            <span>- {{ formatPrice(discount) }}</span>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="summary-row-premium total">
            <span>Total</span>
            <span class="total-value">{{ formatPrice(total) }}</span>
          </div>
          
          <div class="payment-methods-premium">
            <div class="payment-icons">
              <span>Pix</span>
              <span>Cartão</span>
              <span>Boleto</span>
            </div>
            <p class="secure-payment">🔒 Compra 100% segura</p>
          </div>
          
          <div class="summary-actions-premium">
            <router-link to="/" class="continue-btn-premium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Continuar comprando
            </router-link>
            <button class="checkout-btn-premium" @click="finalizeOrder" :disabled="checkoutLoading">
              <span v-if="checkoutLoading" class="spinner-premium"></span>
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

const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${12 + Math.random() * 15}s`,
    opacity: 0.1 + Math.random() * 0.3
  }
}

const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const formatCategory = (category: string) => {
  const categories: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    "jewelery": "Jóias Exclusivas",
    "electronics": "Tecnologia Premium"
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
    message: `Deseja finalizar a compra no valor total de ${formatPrice(total.value)}?`,
    confirmText: 'Confirmar compra',
    cancelText: 'Cancelar',
    type: 'warning'
  })

  if (!result) return

  checkoutLoading.value = true

  try {
    const orderItems = cartItems.value.map(item => ({
      product: {
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category,
        discount: item.product.discount || 0
      },
      quantity: item.quantity
    }))

    const order = ordersStore.createOrder(
      orderItems,
      subtotal.value,
      shipping.value,
      discount.value,
      total.value
    )

    if (order) {
      cartStore.clearCart()
      toast.success('Pedido finalizado!', `Pedido ${order.id} foi criado com sucesso.`, 4000)
      router.push('/orders')
    } else {
      throw new Error('Erro ao criar pedido')
    }
  } catch (error) {
    console.error('Erro ao finalizar pedido:', error)
    toast.error('Erro', 'Não foi possível finalizar o pedido. Tente novamente.', 4000)
  } finally {
    checkoutLoading.value = false
  }
}

onMounted(() => {
  cartStore.loadCart()
})
</script>

<style scoped>
/* ========== CART PAGE PREMIUM ========== */
.cart-page-premium {
  position: relative;
  min-height: 100vh;
  padding: 60px 0 100px;
  overflow-x: hidden;
}

/* Background Premium */
.bg-premium-advanced {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
  overflow: hidden;
}

.bg-gradient-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0B0B0F 0%, #13131A 100%);
  animation: gradientPulseCart 8s ease-in-out infinite;
}

@keyframes gradientPulseCart {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.light-sweep-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.12) 40%,
    rgba(212, 175, 55, 0.18) 45%,
    rgba(212, 175, 55, 0.22) 50%,
    rgba(212, 175, 55, 0.18) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweepCart 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepCart {
  0% { background-position: -100% 0%; opacity: 0; }
  20% { opacity: 0.5; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  100% { background-position: 200% 0%; opacity: 0; }
}

.glass-overlay-advanced {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.55);
  backdrop-filter: blur(2px);
}

.cart-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cart-particle {
  position: absolute;
  font-size: 14px;
  animation: floatCartParticle linear infinite;
  opacity: 0;
}

@keyframes floatCartParticle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Container Premium */
.container-premium {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}

/* Page Header Premium */
.page-header-premium {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-wrapper-premium {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon-premium {
  position: relative;
  color: var(--gold-primary);
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
  animation: iconPulseCart 1.5s ease-in-out infinite;
}

@keyframes iconPulseCart {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: iconGlowCart 2s ease-in-out infinite;
}

@keyframes iconGlowCart {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.page-title-premium {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-title-premium .gold-text {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Empty Cart Premium */
.empty-cart-premium {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.empty-cart-card-premium {
  max-width: 500px;
  width: 100%;
  padding: 48px 40px;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  text-align: center;
  animation: fadeInUp 0.6s ease;
  transition: all 0.3s ease;
}

.empty-cart-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.empty-cart-animation {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}

.shopping-bag svg {
  color: rgba(245, 240, 230, 0.3);
  animation: floatBag 3s ease-in-out infinite;
}

@keyframes floatBag {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-items {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-items span {
  position: absolute;
  font-size: 20px;
  animation: floatItem 2s ease-in-out infinite;
}

.floating-items span:nth-child(1) {
  top: -20px;
  left: 0;
  animation-delay: 0s;
}

.floating-items span:nth-child(2) {
  top: -30px;
  right: 0;
  animation-delay: 0.3s;
}

.floating-items span:nth-child(3) {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.6s;
}

@keyframes floatItem {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
}

.empty-title {
  color: var(--white-soft);
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.empty-description {
  color: rgba(245, 240, 230, 0.6);
  margin-bottom: 32px;
  line-height: 1.6;
}

.continue-shopping-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.continue-shopping-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Cart Content Premium */
.cart-content-premium {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
  animation: fadeInUp 0.6s ease;
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

/* Cart Items Premium */
.cart-items-premium {
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(15px);
  border-radius: 32px;
  padding: 28px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.cart-header-premium {
  display: grid;
  grid-template-columns: 3fr 1fr 1.2fr 1.2fr 0.5fr;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cart-list-premium {
  display: flex;
  flex-direction: column;
}

.cart-item-premium {
  display: grid;
  grid-template-columns: 3fr 1fr 1.2fr 1.2fr 0.5fr;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
}

.cart-item-premium:hover {
  background: rgba(212, 175, 55, 0.05);
  margin: 0 -28px;
  padding: 24px 28px;
  border-radius: 20px;
}

/* Product Info */
.product-info-premium {
  display: flex;
  gap: 20px;
  align-items: center;
}

.product-image-premium {
  width: 90px;
  height: 90px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.image-wrapper-premium {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.product-image-premium img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-image-premium:hover img {
  transform: scale(1.1);
}

.image-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.product-image-premium:hover .image-shine {
  left: 100%;
}

.product-details-premium {
  flex: 1;
}

.product-title-premium {
  color: var(--white-soft);
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 6px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.product-title-premium:hover {
  color: var(--gold-primary);
}

.product-category-premium {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.5);
  display: block;
  margin-bottom: 4px;
}

.product-rating {
  font-size: 0.7rem;
  color: var(--gold-primary);
}

/* Price & Quantity */
.price-premium,
.subtotal-premium {
  color: var(--gold-primary);
  font-weight: 600;
  font-size: 1rem;
}

.quantity-selector-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(59, 58, 64, 0.4);
  border-radius: 40px;
  padding: 4px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.qty-btn-premium {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold-primary);
}

.qty-btn-premium:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.2);
  transform: scale(1.1);
}

.qty-btn-premium:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value-premium {
  color: var(--white-soft);
  font-weight: 600;
  min-width: 36px;
  text-align: center;
  font-size: 0.95rem;
}

/* Remove Button */
.remove-btn-premium {
  position: relative;
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

.remove-btn-premium:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  transform: scale(1.1);
}

.tooltip-remove {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #ff6b6b;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
}

.remove-btn-premium:hover .tooltip-remove {
  opacity: 1;
  visibility: visible;
  bottom: 120%;
}

/* Order Summary Premium */
.order-summary-premium {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 32px;
  padding: 32px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  position: sticky;
  top: 100px;
  height: fit-content;
  transition: all 0.3s ease;
}

.order-summary-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.summary-header-premium {
  position: relative;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.summary-title-premium {
  color: var(--white-soft);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.summary-glow {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, var(--gold-primary), transparent);
}

.summary-row-premium {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  color: rgba(245, 240, 230, 0.8);
  font-size: 0.95rem;
}

.summary-row-premium.discount {
  color: #4caf50;
}

.summary-divider {
  height: 1px;
  background: rgba(212, 175, 55, 0.15);
  margin: 8px 0;
}

.summary-row-premium.total {
  padding-top: 16px;
  margin-top: 8px;
  font-size: 1.2rem;
  font-weight: 700;
}

.total-value {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 1.3rem;
}

.payment-methods-premium {
  margin: 24px 0;
  padding: 16px;
  background: rgba(212, 175, 55, 0.05);
  border-radius: 20px;
  text-align: center;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.payment-icons span {
  color: var(--gold-primary);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 12px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 20px;
}

.secure-payment {
  color: rgba(245, 240, 230, 0.5);
  font-size: 0.7rem;
  margin: 0;
}

/* Summary Actions */
.summary-actions-premium {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.continue-btn-premium {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: rgba(245, 240, 230, 0.8);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.continue-btn-premium:hover {
  border-color: var(--gold-primary);
  color: var(--gold-primary);
  transform: translateY(-2px);
}

.checkout-btn-premium {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkout-btn-premium:hover:not(:disabled) {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.checkout-btn-premium:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-premium {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--black-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Cart Item Transition */
.cart-item-move,
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.cart-item-leave-active {
  position: absolute;
}

/* Responsividade Premium */
@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }
  
  .cart-content-premium {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .order-summary-premium {
    position: static;
  }
  
  .cart-header-premium {
    display: none;
  }
  
  .cart-item-premium {
    grid-template-columns: 1fr;
    gap: 16px;
    position: relative;
    padding: 20px;
  }
  
  .product-col-premium {
    grid-column: 1 / -1;
  }
  
  .product-info-premium {
    flex-direction: column;
    text-align: center;
  }
  
  .product-image-premium {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
  
  .product-details-premium {
    text-align: center;
  }
  
  .price-col-premium,
  .quantity-col-premium,
  .subtotal-col-premium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }
  
  .price-col-premium::before {
    content: "Preço:";
    color: rgba(245, 240, 230, 0.6);
    font-weight: 500;
  }
  
  .quantity-col-premium::before {
    content: "Quantidade:";
    color: rgba(245, 240, 230, 0.6);
    font-weight: 500;
  }
  
  .subtotal-col-premium::before {
    content: "Subtotal:";
    color: rgba(245, 240, 230, 0.6);
    font-weight: 500;
  }
  
  .action-col-premium {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  
  .quantity-selector-premium {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .cart-page-premium {
    padding: 40px 0 60px;
  }
  
  .container-premium {
    padding: 0 16px;
  }
  
  .page-title-premium {
    font-size: 1.8rem;
  }
  
  .title-wrapper-premium {
    gap: 12px;
  }
  
  .title-icon-premium svg {
    width: 32px;
    height: 32px;
  }
  
  .cart-items-premium {
    padding: 20px;
  }
  
  .empty-cart-card-premium {
    padding: 40px 24px;
    margin: 0 16px;
  }
  
  .empty-title {
    font-size: 1.3rem;
  }
  
  .empty-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title-premium {
    font-size: 1.4rem;
  }
  
  .cart-items-premium {
    padding: 16px;
  }
  
  .product-image-premium {
    width: 100px;
    height: 100px;
  }
  
  .product-title-premium {
    font-size: 0.85rem;
  }
  
  .price-premium,
  .subtotal-premium {
    font-size: 0.9rem;
  }
  
  .qty-value-premium {
    min-width: 30px;
    font-size: 0.85rem;
  }
  
  .qty-btn-premium {
    width: 28px;
    height: 28px;
  }
  
  .order-summary-premium {
    padding: 24px;
  }
  
  .summary-title-premium {
    font-size: 1.1rem;
  }
  
  .total-value {
    font-size: 1.1rem;
  }
  
  .payment-icons {
    gap: 12px;
  }
  
  .payment-icons span {
    font-size: 0.7rem;
    padding: 3px 10px;
  }
}
</style>