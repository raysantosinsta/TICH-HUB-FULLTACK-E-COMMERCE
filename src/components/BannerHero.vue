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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de navegação (só mostrar se tiver mais de 1 banner) -->
      <template v-if="banners.length > 1">
        <button class="nav-btn prev" @click="prevSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="nav-btn next" @click="nextSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useBannersStore } from '../stores/banners'

const bannersStore = useBannersStore()
const banners = computed(() => bannersStore.banners)

const currentSlide = ref(0)
const loading = ref(true)
let intervalId: number | null = null

const nextSlide = () => {
  // Verificar se há banners antes de tentar acessar length
  if (!banners.value || banners.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % banners.value.length
}

const prevSlide = () => {
  // Verificar se há banners antes de tentar acessar length
  if (!banners.value || banners.value.length === 0) return
  currentSlide.value = currentSlide.value === 0 
    ? banners.value.length - 1 
    : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  // Verificar se o índice é válido
  if (!banners.value || index < 0 || index >= banners.value.length) return
  currentSlide.value = index
}

const startAutoPlay = () => {
  // Só iniciar autoplay se houver mais de 1 banner
  if (banners.value && banners.value.length > 1) {
    intervalId = window.setInterval(() => {
      nextSlide()
    }, 6000)
  }
}

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  // Simular um pequeno delay para garantir que os dados estão carregados
  setTimeout(() => {
    loading.value = false
    if (banners.value && banners.value.length > 0) {
      startAutoPlay()
    }
  }, 100)
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.banner-hero {
  position: relative;
  height: 600px;
  overflow: hidden;
  margin-bottom: 50px;
  border-radius: 20px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, var(--black-primary) 0%, #1a1a2a 100%);
  border-radius: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: var(--gold-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p,
.empty-state p {
  color: var(--white-soft);
  font-size: 1rem;
}

.slideshow-container {
  position: relative;
  width: 100%;
  height: 100%;
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

.slide-bg {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  max-width: 600px;
  animation: fadeInUp 0.8s ease;
}

.text-content {
  color: white;
}

.slide-badge {
  display: inline-block;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.slide-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: fadeInUp 0.8s ease 0.3s both;
}

.slide-subtitle {
  font-size: 1.5rem;
  margin-bottom: 12px;
  opacity: 0.95;
  animation: fadeInUp 0.8s ease 0.4s both;
}

.slide-description {
  font-size: 1rem;
  margin-bottom: 30px;
  opacity: 0.85;
  line-height: 1.6;
  animation: fadeInUp 0.8s ease 0.5s both;
}

.slide-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 12px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease 0.6s both;
}

.slide-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.slide-button svg {
  transition: transform 0.3s ease;
}

.slide-button:hover svg {
  transform: translateX(5px);
}

/* Botões de navegação */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 10;
}

.banner-hero:hover .nav-btn {
  opacity: 1;
}

.nav-btn:hover {
  background: rgba(212, 175, 55, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 30px;
}

.next {
  right: 30px;
}

/* Indicadores */
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
  width: 10px;
  height: 10px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 0;
}

.dot:hover {
  background: rgba(255,255,255,0.8);
  transform: scale(1.2);
}

.dot.active {
  background: var(--gold-primary);
  width: 30px;
  border-radius: 5px;
}

/* Animações */
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

/* Responsividade */
@media (max-width: 1024px) {
  .banner-hero {
    height: 500px;
  }
  
  .slide-title {
    font-size: 2.5rem;
  }
  
  .slide-subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .banner-hero {
    height: 400px;
  }
  
  .slide-content {
    left: 5%;
    right: 5%;
    text-align: center;
  }
  
  .slide-title {
    font-size: 1.8rem;
  }
  
  .slide-subtitle {
    font-size: 1rem;
  }
  
  .slide-description {
    font-size: 0.9rem;
    display: none;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
    opacity: 0.7;
  }
  
  .prev {
    left: 10px;
  }
  
  .next {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .banner-hero {
    height: 350px;
  }
  
  .slide-title {
    font-size: 1.5rem;
  }
  
  .slide-subtitle {
    font-size: 0.9rem;
  }
  
  .slide-button {
    padding: 8px 20px;
    font-size: 0.85rem;
  }
}
</style>