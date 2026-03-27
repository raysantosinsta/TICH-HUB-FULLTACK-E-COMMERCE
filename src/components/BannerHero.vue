<template>
  <div class="banner-hero">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando banners...</p>
    </div>

    <!-- Slideshow -->
    <div v-else-if="banners.length > 0" class="slideshow-container">
      <div 
        v-for="(banner, index) in banners" 
        :key="banner.id"
        class="slide"
        :class="{ active: currentSlide === index }"
      >
        <div class="slide-bg" :style="{ backgroundImage: `url(${banner.image})` }">
          <div class="bg-overlay"></div>
          <div class="slide-content">
            <div class="text-content">
              <span class="slide-badge" v-if="banner.discount">
                🔥 {{ banner.discount }}% OFF
              </span>
              <h2 class="slide-title">{{ banner.title }}</h2>
              <p class="slide-subtitle">{{ banner.subtitle }}</p>
              <p class="slide-description">{{ banner.description }}</p>
              <router-link :to="banner.buttonLink" class="slide-button">
                {{ banner.buttonText }}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de navegação (só mostrar se tiver mais de 1 banner) -->
      <template v-if="banners.length > 1">
        <button class="nav-btn prev" @click="prevSlide" aria-label="Slide anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="nav-btn next" @click="nextSlide" aria-label="Próximo slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </template>

      <!-- Indicadores -->
      <div class="dots" v-if="banners.length > 1">
        <button 
          v-for="(banner, index) in banners" 
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Ir para slide ${index + 1}`"
        ></button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>Nenhum banner disponível</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useBannersStore } from '../stores/banners'

const bannersStore = useBannersStore()
const banners = computed(() => bannersStore.banners)

const currentSlide = ref(0)
const loading = ref(true)
let intervalId: number | null = null
let touchStartX = 0
let touchEndX = 0

const nextSlide = () => {
  if (!banners.value?.length) return
  currentSlide.value = (currentSlide.value + 1) % banners.value.length
}

const prevSlide = () => {
  if (!banners.value?.length) return
  currentSlide.value = currentSlide.value === 0 
    ? banners.value.length - 1 
    : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  if (!banners.value?.length) return
  if (index >= 0 && index < banners.value.length) {
    currentSlide.value = index
    resetAutoPlay()
  }
}

const startAutoPlay = () => {
  if (banners.value?.length > 1 && !intervalId) {
    intervalId = window.setInterval(() => {
      nextSlide()
    }, 5000) // Reduzido para 5s para melhor engajamento mobile
  }
}

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  startAutoPlay()
}

// Touch events para mobile
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].clientX
  const swipeThreshold = 50
  
  if (touchEndX < touchStartX - swipeThreshold) {
    nextSlide()
    resetAutoPlay()
  } else if (touchEndX > touchStartX + swipeThreshold) {
    prevSlide()
    resetAutoPlay()
  }
}

onMounted(() => {
  // Simular carregamento e garantir que os dados estão prontos
  setTimeout(() => {
    loading.value = false
    if (banners.value?.length > 0) {
      startAutoPlay()
    }
  }, 100)
  
  // Adicionar listeners de touch para swipe
  const container = document.querySelector('.slideshow-container')
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
  }
})

onUnmounted(() => {
  stopAutoPlay()
  const container = document.querySelector('.slideshow-container')
  if (container) {
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchend', handleTouchEnd)
  }
})

// Watch para resetar autoplay se banners mudarem
watch(() => banners.value?.length, (newLen) => {
  if (newLen && newLen > 0 && !loading.value) {
    resetAutoPlay()
  }
})
</script>

<style scoped>
/* Mobile First - Base Styles */
.banner-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 560px;
  min-height: 480px;
  overflow: hidden;
  margin: 0;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2a 100%);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2a 100%);
}

.spinner {
  width: 44px;
  height: 44px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: var(--gold-primary, #d4af37);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p,
.empty-state p {
  color: #ffffffcc;
  font-size: 0.875rem;
  margin: 0;
}

.slideshow-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  visibility: hidden;
  will-change: opacity;
}

.slide.active {
  opacity: 1;
  visibility: visible;
}

.slide-bg {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 100%);
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 20px 40px;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%);
  animation: fadeInUp 0.5s ease;
}

.text-content {
  color: white;
  text-align: center;
  max-width: 100%;
}

.slide-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%);
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  animation: fadeInUp 0.5s ease 0.1s both;
}

.slide-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 8px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  animation: fadeInUp 0.5s ease 0.2s both;
}

.slide-subtitle {
  font-size: 1rem;
  margin: 0 0 8px;
  opacity: 0.92;
  font-weight: 500;
  animation: fadeInUp 0.5s ease 0.3s both;
}

.slide-description {
  font-size: 0.875rem;
  margin: 0 0 24px;
  opacity: 0.8;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  animation: fadeInUp 0.5s ease 0.4s both;
}

.slide-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--gold-primary, #d4af37) 0%, #b58f2a 100%);
  color: #0a0a0f;
  padding: 14px 28px;
  min-width: 160px;
  border-radius: 48px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.25s ease;
  cursor: pointer;
  border: none;
  animation: fadeInUp 0.5s ease 0.5s both;
  /* Touch target minimum 44px */
  min-height: 48px;
}

.slide-button:active {
  transform: scale(0.96);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.slide-button svg {
  transition: transform 0.25s ease;
  width: 18px;
  height: 18px;
}

/* Navegação mobile otimizada */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  opacity: 0.6;
  touch-action: manipulation;
}

.nav-btn:active {
  opacity: 1;
  transform: translateY(-50%) scale(0.95);
  background: rgba(212, 175, 55, 0.9);
}

.prev {
  left: 12px;
}

.next {
  right: 12px;
}

/* Dots indicadores - touch friendly */
.dots {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  z-index: 20;
  padding: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  padding: 0;
  touch-action: manipulation;
  /* Touch target enlargement via padding */
  padding: 8px;
  margin: -8px;
  background-clip: content-box;
}

.dot.active {
  background: var(--gold-primary, #d4af37);
  width: 28px;
  border-radius: 6px;
}

/* Animações suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet e acima (ajustes responsivos) */
@media (min-width: 640px) {
  .banner-hero {
    max-height: 520px;
    min-height: 520px;
  }
  
  .slide-content {
    padding: 40px 32px;
    text-align: left;
    background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%);
  }
  
  .text-content {
    text-align: left;
    max-width: 70%;
  }
  
  .slide-title {
    font-size: 2.25rem;
  }
  
  .slide-subtitle {
    font-size: 1.125rem;
  }
  
  .slide-description {
    font-size: 0.9375rem;
    display: block;
  }
  
  .nav-btn {
    opacity: 0;
    width: 48px;
    height: 48px;
  }
  
  .banner-hero:hover .nav-btn {
    opacity: 0.7;
  }
  
  .nav-btn:hover {
    opacity: 1;
    background: rgba(212, 175, 55, 0.9);
    transform: translateY(-50%) scale(1.05);
  }
  
  .prev {
    left: 20px;
  }
  
  .next {
    right: 20px;
  }
  
  .dots {
    bottom: 24px;
    gap: 10px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
  }
  
  .dot.active {
    width: 32px;
  }
}

@media (min-width: 1024px) {
  .banner-hero {
    max-height: 600px;
    min-height: 560px;
  }
  
  .slide-content {
    padding: 48px 60px;
  }
  
  .text-content {
    max-width: 55%;
  }
  
  .slide-title {
    font-size: 3rem;
    margin-bottom: 12px;
  }
  
  .slide-subtitle {
    font-size: 1.25rem;
  }
  
  .slide-description {
    font-size: 1rem;
    margin-bottom: 32px;
  }
  
  .slide-button {
    padding: 14px 36px;
    font-size: 1rem;
  }
  
  .slide-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
  }
  
  .slide-button:hover svg {
    transform: translateX(4px);
  }
}

/* Prevenção de overflow e scroll desnecessário */
@media (max-width: 639px) {
  .banner-hero {
    height: auto;
    min-height: 480px;
  }
  
  .slide-description {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  
  /* Remove scrollbars desnecessárias */
  .slideshow-container,
  .slide-bg {
    overflow: hidden;
  }
}

/* Performance improvements */
.slide-bg {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.slide {
  will-change: opacity;
}

/* Melhor feedback visual para estados interativos */
.slide-button,
.nav-btn,
.dot {
  transition: transform 0.15s ease, background 0.2s ease, opacity 0.2s ease;
}

.slide-button:focus-visible,
.nav-btn:focus-visible,
.dot:focus-visible {
  outline: 2px solid var(--gold-primary, #d4af37);
  outline-offset: 2px;
}

/* Acessibilidade: reduzir movimento se preferido */
@media (prefers-reduced-motion: reduce) {
  .slide,
  .slide-content,
  .slide-badge,
  .slide-title,
  .slide-subtitle,
  .slide-description,
  .slide-button {
    animation: none;
    transition: none;
  }
  
  .spinner {
    animation: none;
  }
}
</style>