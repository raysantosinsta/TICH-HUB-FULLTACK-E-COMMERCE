<template>
  <div class="hero-banner">
    <!-- Background Premium com Luz Animada -->
    <div class="animated-bg">
      <div class="bg-gradient"></div>
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
      <div class="highlight-dots">
        <div v-for="i in 20" :key="i" class="dot-highlight" :style="getDotStyle(i)"></div>
      </div>
    </div>

    <!-- Slideshow Container -->
    <div class="slideshow-container">
      <div 
        v-for="(product, index) in featuredProducts" 
        :key="product.id"
        class="slide"
        :class="{ active: currentSlide === index }"
      >
        <div class="slide-content">
          <!-- Lado Esquerdo - Texto Dinâmico -->
          <div class="slide-text">
            <div class="text-content">
              <span class="slide-badge">{{ formatCategory(product.category) }}</span>
              <h2 class="slide-title">{{ truncateTitle(product.title) }}</h2>
              <p class="slide-description">{{ truncateDescription(product.description) }}</p>
              <div class="slide-price">
                <span class="price">R$ {{ formatPrice(product.price) }}</span>
                <span class="price-installment">ou 10x de R$ {{ formatPrice(product.price / 10) }}</span>
              </div>
              <div class="slide-rating">
                <span class="stars">{{ getStarRating(product.rating.rate) }}</span>
                <span class="rating-count">({{ product.rating.count }} avaliações)</span>
              </div>
              <button class="slide-button" @click="goToProduct(product.id)">
                Ver Produto
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Lado Direito - Imagem do Produto -->
          <div class="slide-image">
            <div class="image-container">
              <img :src="product.image" :alt="product.title">
              <div class="image-glow"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de navegação -->
      <button class="nav-btn prev" @click="prevSlide" aria-label="Slide anterior">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#F5F0E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="nav-btn next" @click="nextSlide" aria-label="Próximo slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="#F5F0E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Indicadores (dots) -->
      <div class="dots">
        <button 
          v-for="(product, index) in featuredProducts" 
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Ir para slide ${index + 1}`"
        >
          <span class="dot-label">{{ index + 1 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'

const router = useRouter()
const store = useProductsStore()
const currentSlide = ref(0)
let intervalId: number | null = null

// Pegar apenas os 4 primeiros produtos
const featuredProducts = computed(() => store.products.slice(0, 4))

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
  if (title.length > 60) {
    return title.substring(0, 57) + '...'
  }
  return title
}

const truncateDescription = (description: string) => {
  if (description.length > 120) {
    return description.substring(0, 117) + '...'
  }
  return description
}

const getStarRating = (rate: number) => {
  const fullStars = Math.floor(rate)
  const hasHalfStar = rate % 1 >= 0.5
  let stars = ''
  for (let i = 0; i < fullStars; i++) stars += '★'
  if (hasHalfStar) stars += '½'
  for (let i = 0; i < 5 - Math.ceil(rate); i++) stars += '☆'
  return stars
}

const getDotStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 8}s`,
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`
  }
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const nextSlide = () => {
  if (featuredProducts.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % featuredProducts.value.length
}

const prevSlide = () => {
  if (featuredProducts.value.length === 0) return
  currentSlide.value = currentSlide.value === 0 
    ? featuredProducts.value.length - 1 
    : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Auto-play do slideshow
const startAutoPlay = () => {
  intervalId = window.setInterval(() => {
    nextSlide()
  }, 6000)
}

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
/* ========== VARIÁVEIS DE COR ========== */
:root {
  --black-primary: #0B0B0F;
  --gold-primary: #D4AF37;
  --white-soft: #F5F0E6;
  --gray-dark: #3B3A40;
}

.hero-banner {
  position: relative;
  height: 650px;
  overflow: hidden;
  margin-bottom: 50px;
}

/* ========== BACKGROUND PREMIUM COM LUZ ANIMADA ========== */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--black-primary);
}

.bg-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, var(--black-primary) 0%, #1a1a2a 100%);
}

.light-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.15) 40%,
    rgba(212, 175, 55, 0.2) 45%,
    rgba(212, 175, 55, 0.25) 50%,
    rgba(212, 175, 55, 0.2) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  background-position: 0% 0%;
  animation: lightSweep 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  pointer-events: none;
  filter: blur(25px);
}

@keyframes lightSweep {
  0% {
    background-position: -100% 0%;
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  20% {
    opacity: 0.8;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    background-position: 200% 0%;
    opacity: 0;
  }
}

.glass-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.4);
  backdrop-filter: blur(2px);
  pointer-events: none;
}

.highlight-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.dot-highlight {
  position: absolute;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, rgba(212, 175, 55, 0) 70%);
  border-radius: 50%;
  animation: pulseDot 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulseDot {
  0%, 100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.4;
    transform: scale(1);
  }
}

/* ========== SLIDESHOW CONTAINER ========== */
.slideshow-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  visibility: hidden;
}

.slide.active {
  opacity: 1;
  visibility: visible;
}

.slide-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1300px;
  margin: 0 auto;
  padding: 60px 40px;
  height: 100%;
  gap: 60px;
}

.slide-text {
  flex: 1;
  color: var(--white-soft);
  animation: slideInLeft 0.6s ease;
  backdrop-filter: blur(20px);
  background: rgba(11, 11, 15, 0.5);
  border-radius: 30px;
  padding: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.slide-text:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

.text-content {
  max-width: 550px;
}

.slide-badge {
  display: inline-block;
  background: rgba(212, 175, 55, 0.15);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--gold-primary);
}

.slide-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  line-height: 1.3;
  font-weight: 700;
  color: var(--white-soft);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slide-description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
  opacity: 0.9;
  color: rgba(245, 240, 230, 0.9);
}

.slide-price {
  margin-bottom: 20px;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: var(--gold-primary);
  display: block;
  margin-bottom: 5px;
}

.price-installment {
  font-size: 0.9rem;
  opacity: 0.8;
  color: rgba(245, 240, 230, 0.7);
}

.slide-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.stars {
  color: var(--gold-primary);
  letter-spacing: 2px;
  font-size: 1.1rem;
}

.rating-count {
  font-size: 0.9rem;
  opacity: 0.8;
  color: rgba(245, 240, 230, 0.7);
}

.slide-button {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.slide-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
  background: linear-gradient(135deg, #e6bc3e 0%, #c49b2e 100%);
}

.slide-button svg {
  transition: transform 0.3s ease;
}

.slide-button:hover svg {
  transform: translateX(5px);
}

.slide-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideInRight 0.6s ease;
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container img {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5));
  transition: transform 0.5s ease;
  position: relative;
  z-index: 2;
}

.image-container:hover img {
  transform: scale(1.05);
}

.image-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0) 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.image-container:hover .image-glow {
  opacity: 1;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  color: var(--white-soft);
  border: 1px solid rgba(212, 175, 55, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.hero-banner:hover .nav-btn {
  opacity: 1;
}

.nav-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--gold-primary);
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 30px;
}

.next {
  right: 30px;
}

.dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.dot {
  width: 40px;
  height: 4px;
  background: rgba(245, 240, 230, 0.3);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.dot:hover {
  background: rgba(212, 175, 55, 0.5);
}

.dot.active {
  background: var(--gold-primary);
  width: 40px;
}

.dot.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  animation: progressBar 6s linear;
}

@keyframes progressBar {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.dot-label {
  display: none;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 968px) {
  .hero-banner {
    height: auto;
    min-height: 550px;
  }

  .slide-content {
    flex-direction: column;
    text-align: center;
    padding: 40px 30px;
    gap: 30px;
  }

  .slide-text {
    text-align: center;
    order: 2;
    padding: 30px;
  }

  .text-content {
    max-width: 100%;
  }

  .slide-image {
    order: 1;
  }

  .slide-rating {
    justify-content: center;
  }

  .slide-button {
    justify-content: center;
  }

  .image-container img {
    max-width: 280px;
  }

  .slide-title {
    font-size: 1.8rem;
  }

  .nav-btn {
    opacity: 0.7;
    width: 40px;
    height: 40px;
  }

  .prev {
    left: 15px;
  }

  .next {
    right: 15px;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    min-height: 500px;
  }

  .slide-title {
    font-size: 1.5rem;
  }

  .slide-description {
    font-size: 0.9rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .slide-button {
    padding: 12px 24px;
    font-size: 0.9rem;
  }

  .image-container img {
    max-width: 250px;
  }

  .dots {
    bottom: 20px;
  }

  .dot {
    width: 30px;
    height: 3px;
  }

  .dot.active {
    width: 30px;
  }
}
</style>