<template>
  <div class="product-detail-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">Home</router-link>
        <span class="separator">›</span>
        <span class="current">{{ truncateTitle(product?.title || '', 40) }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="loading-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-info">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>

      <!-- Product Content -->
      <div v-else-if="product" class="product-content">
        <!-- Seção Principal - Imagem e Info -->
        <div class="product-main">
          <!-- Imagem do Produto -->
          <div class="product-image-section">
            <div class="main-image-container">
              <img 
                :src="product.image" 
                :alt="product.title"
                class="main-image"
              >
            </div>
          </div>

          <!-- Informações do Produto -->
          <div class="product-info-section">
            <span class="category-badge">{{ formatCategory(product.category) }}</span>
            <h1 class="product-title">{{ product.title }}</h1>
            
            <!-- Avaliação -->
            <div class="rating-section">
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ 
                  filled: i <= Math.floor(product.rating.rate),
                  half: i === Math.ceil(product.rating.rate) && product.rating.rate % 1 >= 0.5 
                }">
                  {{ i <= Math.floor(product.rating.rate) ? '★' : (i === Math.ceil(product.rating.rate) && product.rating.rate % 1 >= 0.5 ? '½' : '☆') }}
                </span>
              </div>
              <span class="rating-value">{{ product.rating.rate }} de 5</span>
              <span class="reviews-count">({{ product.rating.count }} avaliações)</span>
            </div>

            <!-- Preço -->
            <div class="price-section">
              <div class="price">R$ {{ formatPrice(product.price) }}</div>
              <div class="installment">ou 12x de R$ {{ formatPrice(product.price / 12) }} sem juros</div>
              <div class="stock-info">
                <span class="stock-badge">✓ Em estoque</span>
              </div>
            </div>

            <!-- Descrição Curta -->
            <p class="short-description">{{ truncateDescription(product.description, 180) }}</p>

            <!-- Botões de Ação -->
            <div class="action-buttons">
              <button class="btn-cart" @click="addToCart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z" stroke="currentColor" fill="none" stroke-width="1.5"/>
                </svg>
                Adicionar ao Carrinho
              </button>
              <button class="btn-buy" @click="buyNow">
                Comprar Agora
              </button>
            </div>

            <!-- Benefícios -->
            <div class="benefits">
              <div class="benefit-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
                </svg>
                <span>Frete Grátis para todo Brasil</span>
              </div>
              <div class="benefit-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12V8H4V12M20 12L12 16L4 12M20 12V18H4V12" stroke="currentColor" fill="none" stroke-width="1.5"/>
                </svg>
                <span>Garantia de 30 dias</span>
              </div>
              <div class="benefit-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6v6l4 2" stroke="currentColor" fill="none" stroke-width="1.5"/>
                </svg>
                <span>Entrega rápida em até 5 dias</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Descrição Completa e Especificações -->
        <div class="product-details">
          <div class="tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'description' }"
              @click="activeTab = 'description'"
            >
              Descrição
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'specs' }"
              @click="activeTab = 'specs'"
            >
              Especificações
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'shipping' }"
              @click="activeTab = 'shipping'"
            >
              Entrega e Garantia
            </button>
          </div>

          <div class="tab-content">
            <!-- Descrição -->
            <div v-show="activeTab === 'description'" class="description-content">
              <h3>Sobre o produto</h3>
              <p>{{ product.description }}</p>
              
              <h3>Características principais</h3>
              <ul class="features-list">
                <li>✓ Produto original com garantia de fábrica</li>
                <li>✓ Alta qualidade e durabilidade comprovada</li>
                <li>✓ Design moderno e elegante</li>
                <li>✓ Entrega segura e embalagem protegida</li>
                <li>✓ Satisfação garantida ou seu dinheiro de volta</li>
              </ul>
            </div>

            <!-- Especificações -->
            <div v-show="activeTab === 'specs'" class="specs-content">
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="spec-label">Categoria</span>
                  <span class="spec-value">{{ formatCategory(product.category) }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">SKU</span>
                  <span class="spec-value">PROD-{{ product.id.toString().padStart(6, '0') }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Avaliação</span>
                  <span class="spec-value">{{ product.rating.rate }} / 5.0</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Total de avaliações</span>
                  <span class="spec-value">{{ product.rating.count }} clientes</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Peso aproximado</span>
                  <span class="spec-value">{{ (Math.random() * 2 + 0.5).toFixed(1) }} kg</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Dimensões</span>
                  <span class="spec-value">{{ Math.floor(Math.random() * 30 + 10) }} x {{ Math.floor(Math.random() * 20 + 10) }} x {{ Math.floor(Math.random() * 10 + 5) }} cm</span>
                </div>
              </div>
            </div>

            <!-- Entrega e Garantia -->
            <div v-show="activeTab === 'shipping'" class="shipping-content">
              <h4>📦 Política de Entrega</h4>
              <p>Entregamos para todo Brasil. Prazo estimado de 3 a 7 dias úteis para capitais e regiões metropolitanas, e 7 a 15 dias úteis para demais localidades.</p>
              <p>O frete é gratuito para todo o território nacional!</p>
              
              <h4>🛡️ Garantia</h4>
              <p>Garantia de 30 dias contra defeitos de fabricação. Em caso de qualquer problema, oferecemos troca ou reembolso integral.</p>
              
              <h4>🔄 Troca e Devolução</h4>
              <p>Você tem até 7 dias após o recebimento para desistir da compra. Para trocas por arrependimento, o produto deve estar em perfeitas condições, na embalagem original.</p>
            </div>
          </div>
        </div>

        <!-- Produtos Relacionados -->
        <div class="related-products" v-if="relatedProducts.length > 0">
          <h2 class="section-title">Você também pode gostar</h2>
          <div class="products-grid">
            <div 
              v-for="related in relatedProducts" 
              :key="related.id"
              class="product-card"
              @click="goToProduct(related.id)"
            >
              <div class="card-image">
                <img :src="related.image" :alt="related.title">
              </div>
              <div class="card-info">
                <h3 class="card-title">{{ truncateTitle(related.title, 50) }}</h3>
                <div class="card-price">R$ {{ formatPrice(related.price) }}</div>
                <button class="card-btn">Ver detalhes</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="error-state">
        <div class="error-content">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#D4AF37" stroke-width="1.5"/>
          </svg>
          <h2>Produto não encontrado</h2>
          <p>O produto que você está procurando não existe ou foi removido.</p>
          <router-link to="/" class="back-home">Voltar para home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useToast } from '../plugins/toast'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()
const cartStore = useCartStore()
const toast = useToast()

const product = ref<Product | null>(null)
const loading = ref(true)
const activeTab = ref('description')

const relatedProducts = computed(() => {
  if (!product.value) return []
  return store.products
    .filter(p => p.id !== product.value?.id && p.category === product.value?.category)
    .slice(0, 4)
})

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

const truncateTitle = (title: string, length: number = 60) => {
  if (title.length > length) {
    return title.substring(0, length - 3) + '...'
  }
  return title
}

const truncateDescription = (description: string, length: number = 200) => {
  if (description.length > length) {
    return description.substring(0, length - 3) + '...'
  }
  return description
}

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, 1)
    toast.success(
      'Produto adicionado!', 
      `${product.value.title.substring(0, 50)}${product.value.title.length > 50 ? '...' : ''} foi adicionado ao carrinho.`,
      3000
    )
  }
}

const buyNow = () => {
  if (product.value) {
    cartStore.addToCart(product.value, 1)
    toast.success(
      'Compra iniciada!', 
      `${product.value.title.substring(0, 50)}${product.value.title.length > 50 ? '...' : ''} foi adicionado ao carrinho. Redirecionando...`,
      2000
    )
    setTimeout(() => {
      router.push('/cart')
    }, 1500)
  }
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  const id = Number(route.params.id)
  
  if (store.products.length === 0) {
    await store.fetchProducts()
  }
  
  product.value = store.getProductById(id) || null
  loading.value = false
  
  if (!product.value) {
    toast.error(
      'Produto não encontrado', 
      'O produto que você procura não existe ou foi removido.',
      4000
    )
  }
})
</script>

<style scoped>
.product-detail-page {
  position: relative;
  min-height: 100vh;
  padding: 40px 0 80px;
}

/* Background Premium */
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

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
  font-size: 0.875rem;
  color: rgba(245, 240, 230, 0.6);
}

.breadcrumb a {
  color: rgba(245, 240, 230, 0.8);
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: var(--gold-primary);
}

.breadcrumb .separator {
  color: rgba(245, 240, 230, 0.4);
}

.breadcrumb .current {
  color: var(--gold-primary);
}

/* Loading Skeleton */
.loading-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  animation: fadeIn 0.5s ease;
}

.skeleton-image {
  height: 500px;
  background: linear-gradient(90deg, var(--gray-dark) 25%, #4a4a52 50%, var(--gray-dark) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 20px;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-line {
  height: 30px;
  background: linear-gradient(90deg, var(--gray-dark) 25%, #4a4a52 50%, var(--gray-dark) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Product Main */
.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
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

/* Product Image */
.product-image-section {
  position: sticky;
  top: 100px;
}

.main-image-container {
  background: rgba(59, 58, 64, 0.3);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

/* Product Info */
.product-info-section {
  animation: fadeInUp 0.6s ease 0.2s both;
}

.category-badge {
  display: inline-block;
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 16px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--white-soft);
  margin-bottom: 20px;
  line-height: 1.3;
}

/* Rating */
.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stars {
  display: flex;
  gap: 4px;
  color: var(--gold-primary);
  font-size: 1.1rem;
}

.rating-value, .reviews-count {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.9rem;
}

/* Price */
.price-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--gold-primary);
  margin-bottom: 8px;
}

.installment {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.stock-badge {
  display: inline-block;
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold-primary);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

/* Description */
.short-description {
  color: rgba(245, 240, 230, 0.8);
  line-height: 1.6;
  margin-bottom: 30px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.btn-cart, .btn-buy {
  flex: 1;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cart {
  background: transparent;
  border: 2px solid var(--gold-primary);
  color: var(--gold-primary);
}

.btn-cart:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.btn-buy {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border: none;
  color: var(--black-primary);
}

.btn-buy:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Benefits */
.benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(245, 240, 230, 0.8);
  font-size: 0.9rem;
}

.benefit-item svg {
  color: var(--gold-primary);
}

/* Product Details Tabs */
.product-details {
  margin-bottom: 80px;
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 30px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(245, 240, 230, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn:hover {
  color: var(--gold-primary);
}

.tab-btn.active {
  color: var(--gold-primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gold-primary);
}

.tab-content {
  color: rgba(245, 240, 230, 0.8);
  line-height: 1.6;
}

.tab-content h3, .tab-content h4 {
  color: var(--gold-primary);
  margin-bottom: 16px;
  margin-top: 24px;
}

.tab-content h3:first-child, .tab-content h4:first-child {
  margin-top: 0;
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 8px 0;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 8px;
}

.spec-label {
  font-weight: 600;
  color: var(--gold-primary);
}

.spec-value {
  color: rgba(245, 240, 230, 0.8);
}

/* Related Products */
.related-products {
  margin-top: 60px;
}

.section-title {
  font-size: 1.8rem;
  color: var(--white-soft);
  margin-bottom: 32px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.product-card {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: var(--gold-primary);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
}

.card-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(59, 58, 64, 0.3);
}

.card-image img {
  max-width: 100%;
  max-height: 160px;
  object-fit: contain;
}

.card-info {
  padding: 16px;
}

.card-title {
  font-size: 0.9rem;
  color: var(--white-soft);
  margin-bottom: 8px;
  min-height: 45px;
}

.card-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--gold-primary);
  margin-bottom: 12px;
}

.card-btn {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.card-btn:hover {
  background: var(--gold-primary);
  color: var(--black-primary);
}

/* Error State */
.error-state {
  text-align: center;
  padding: 80px 20px;
}

.error-content svg {
  margin-bottom: 24px;
}

.error-state h2 {
  color: var(--white-soft);
  margin-bottom: 16px;
}

.error-state p {
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 24px;
}

.back-home {
  display: inline-block;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

/* Responsividade */
@media (max-width: 968px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .product-image-section {
    position: relative;
    top: 0;
  }

  .main-image-container {
    padding: 30px;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .price {
    font-size: 2rem;
  }

  .tabs {
    overflow-x: auto;
  }

  .tab-btn {
    white-space: nowrap;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .product-details {
    padding: 20px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>