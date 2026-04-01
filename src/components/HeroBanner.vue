<template>
  <div class="hero-banner-premium">
    <!-- Background Premium com Luz Animada e Partículas -->
    <div class="animated-bg-premium">
      <div class="bg-gradient-premium"></div>
      <div class="light-sweep-premium"></div>
      <div class="glass-overlay-premium"></div>
      <div class="particle-field">
        <div
          v-for="i in 50"
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        ></div>
      </div>
      <div class="gold-dust">
        <div
          v-for="i in 30"
          :key="i"
          class="dust-particle"
          :style="getDustStyle(i)"
        ></div>
      </div>
    </div>

    <!-- Slideshow Container -->
    <div class="slideshow-container-premium">
      <div
        v-for="(product, index) in featuredProducts"
        :key="product.id"
        class="slide-premium"
        :class="{ active: currentSlide === index }"
      >
        <div class="slide-content-premium">
          <!-- Lado Esquerdo - Texto Dinâmico com Glassmorphism -->
          <div class="slide-text-premium">
            <div class="text-content-premium">
              <div class="badge-wrapper">
                <span class="slide-badge-premium">{{
                  getCategoryName(product)
                }}</span>
                <div class="badge-glow"></div>
              </div>
              <h2 class="slide-title-premium">
                {{ truncateTitle(product.title) }}
              </h2>
              <!-- Descrição removida conforme solicitado -->
              <div class="slide-price-premium">
                <span class="price-premium">{{
                  formatPrice(product.price)
                }}</span>
                <span class="price-installment-premium"
                  >ou 12x de {{ formatPrice(product.price / 12) }}</span
                >
              </div>
              <!-- Rating removido pois não existe na API -->
              <button
                class="slide-button-premium"
                @click="goToProduct(product.id)"
              >
                <span>Ver Produto</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Lado Direito - Imagem do Produto com Efeito 3D -->
          <div class="slide-image-premium">
            <div class="image-container-premium">
              <div class="image-wrapper">
                <img :src="getProductImage(product)" :alt="product.title" />
                <div class="image-reflection"></div>
              </div>
              <div class="image-glow-premium"></div>
              <div class="image-shine"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de navegação premium -->
      <button
        class="nav-btn-premium prev-premium"
        @click="prevSlide"
        aria-label="Slide anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <button
        class="nav-btn-premium next-premium"
        @click="nextSlide"
        aria-label="Próximo slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- Indicadores premium -->
      <div class="dots-premium">
        <button
          v-for="(product, index) in featuredProducts"
          :key="index"
          class="dot-premium"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Ir para slide ${index + 1}`"
        >
          <span class="dot-progress"></span>
        </button>
      </div>

      <!-- Indicador de slide atual -->
      <div class="slide-counter">
        <span class="current">{{ currentSlide + 1 }}</span>
        <span class="separator">/</span>
        <span class="total">{{ featuredProducts.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductsStore } from "../stores/products";

const router = useRouter();
const store = useProductsStore();
const currentSlide = ref(0);
let intervalId: number | null = null;
let autoPlayTimeout: number | null = null;

// Pegar apenas os 4 primeiros produtos
const featuredProducts = computed(() => store.products.slice(0, 4));

// Função para obter imagem do produto
const getProductImage = (product: any) => {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  if (product.image) {
    return product.image;
  }
  return "/placeholder-image.jpg";
};

// Função para obter nome da categoria
const getCategoryName = (product: any) => {
  if (!product.category) return "Produto";

  // Se category for objeto
  if (typeof product.category === "object" && product.category.name) {
    return formatCategory(product.category.name);
  }

  // Se category for string
  if (typeof product.category === "string") {
    return formatCategory(product.category);
  }

  return "Produto";
};

const formatPrice = (price: number) => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

const formatCategory = (category: string) => {
  const categories: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    jewelery: "Jóias Exclusivas",
    electronics: "Tecnologia",
    furniture: "Móveis",
    shoes: "Calçados",
    miscellaneous: "Diversos",
    clothes: "Roupas",
  };
  return categories[category?.toLowerCase()] || category || "Produto";
};

const truncateTitle = (title: string) => {
  if (!title) return "";
  if (title.length > 60) {
    return title.substring(0, 57) + "...";
  }
  return title;
};

const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${10 + Math.random() * 15}s`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
    opacity: 0.1 + Math.random() * 0.3,
  };
};

const getDustStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 20}s`,
    animationDuration: `${15 + Math.random() * 20}s`,
    width: `${1 + Math.random() * 2}px`,
    height: `${1 + Math.random() * 2}px`,
  };
};

const goToProduct = (id: number) => {
  router.push(`/product/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const nextSlide = () => {
  if (featuredProducts.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % featuredProducts.value.length;
  resetAutoPlay();
};

const prevSlide = () => {
  if (featuredProducts.value.length === 0) return;
  currentSlide.value =
    currentSlide.value === 0
      ? featuredProducts.value.length - 1
      : currentSlide.value - 1;
  resetAutoPlay();
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
  resetAutoPlay();
};

const resetAutoPlay = () => {
  if (autoPlayTimeout) {
    clearTimeout(autoPlayTimeout);
  }
  autoPlayTimeout = window.setTimeout(() => {
    startAutoPlay();
  }, 10000);
};

// Auto-play do slideshow
const startAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = window.setInterval(() => {
    nextSlide();
  }, 8000);
};

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (autoPlayTimeout) {
    clearTimeout(autoPlayTimeout);
    autoPlayTimeout = null;
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
/* ========== HERO BANNER PREMIUM ========== */
.hero-banner-premium {
  position: relative;
  width: 100%;
  min-height: 100vh;
  max-height: 800px;
  overflow: hidden;
  margin: 0;
  background: var(--black-primary);
}

/* ========== BACKGROUND PREMIUM AVANÇADO ========== */
.animated-bg-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--black-primary);
}

.bg-gradient-premium {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      circle at 20% 40%,
      rgba(212, 175, 55, 0.12) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(212, 175, 55, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 90%,
      rgba(212, 175, 55, 0.05) 0%,
      transparent 60%
    ),
    linear-gradient(135deg, var(--black-primary) 0%, #0f0f14 50%, #1a1a24 100%);
  animation: gradientShift 15s ease-in-out infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.light-sweep-premium {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 30%,
    rgba(212, 175, 55, 0.2) 35%,
    rgba(212, 175, 55, 0.3) 40%,
    rgba(212, 175, 55, 0.35) 45%,
    rgba(212, 175, 55, 0.4) 50%,
    rgba(212, 175, 55, 0.35) 55%,
    rgba(212, 175, 55, 0.25) 60%,
    rgba(212, 175, 55, 0.15) 65%,
    transparent 70%,
    transparent 100%
  );
  background-size: 200% 100%;
  background-position: 0% 0%;
  animation: lightSweepPremium 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  pointer-events: none;
  filter: blur(30px);
}

@keyframes lightSweepPremium {
  0% {
    background-position: -100% 0%;
    opacity: 0;
  }
  15% {
    opacity: 0.6;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  85% {
    opacity: 0.6;
  }
  100% {
    background-position: 200% 0%;
    opacity: 0;
  }
}

.glass-overlay-premium {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(3px);
  pointer-events: none;
}

/* Partículas animadas */
.particle-field {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.6) 0%,
    rgba(212, 175, 55, 0) 80%
  );
  border-radius: 50%;
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% {
    transform: translateY(100vh) translateX(-10px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) translateX(10px) rotate(360deg);
    opacity: 0;
  }
}

/* Poeira dourada */
.gold-dust {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.dust-particle {
  position: absolute;
  background: var(--gold-primary);
  border-radius: 50%;
  animation: dustFloat linear infinite;
  opacity: 0;
}

@keyframes dustFloat {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100px) rotate(180deg);
    opacity: 0;
  }
}

/* ========== SLIDESHOW CONTAINER PREMIUM ========== */
.slideshow-container-premium {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  z-index: 2;
}

.slide-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  visibility: hidden;
}

.slide-premium.active {
  opacity: 1;
  visibility: visible;
}

.slide-content-premium {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 60px;
  height: 100%;
  min-height: 100vh;
  gap: 60px;
}

/* Texto do slide com glassmorphism premium */
.slide-text-premium {
  flex: 1;
  animation: slideInLeftPremium 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.text-content-premium {
  max-width: 600px;
}

.badge-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.slide-badge-premium {
  display: inline-block;
  background: rgba(212, 175, 55, 0.15);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: var(--gold-primary);
  position: relative;
  z-index: 1;
}

.badge-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.2) 0%,
    transparent 70%
  );
  border-radius: 40px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.badge-wrapper:hover .badge-glow {
  opacity: 1;
}

.slide-title-premium {
  font-size: 3rem;
  margin-bottom: 24px;
  line-height: 1.2;
  font-weight: 800;
  background: linear-gradient(135deg, #f5f0e6 0%, #d4af37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
}

.slide-price-premium {
  margin-bottom: 32px;
}

.price-premium {
  font-size: 2.2rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #f5e6a0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: block;
  margin-bottom: 6px;
}

.price-installment-premium {
  font-size: 0.9rem;
  color: rgba(245, 240, 230, 0.7);
}

.slide-button-premium {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  padding: 14px 36px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
  position: relative;
  overflow: hidden;
  min-height: 48px;
}

.slide-button-premium::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.slide-button-premium:active::before {
  left: 100%;
}

.slide-button-premium:active {
  transform: scale(0.97);
}

.slide-button-premium svg {
  transition: transform 0.3s ease;
}

.slide-button-premium:active svg {
  transform: translateX(5px);
}

/* Imagem do slide com efeitos 3D */
.slide-image-premium {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideInRightPremium 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-container-premium {
  position: relative;
  width: 100%;
  max-width: 500px;
  perspective: 1000px;
}

.image-wrapper {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(212, 175, 55, 0.1) 0%,
    rgba(212, 175, 55, 0.05) 100%
  );
  border-radius: 30px;
  padding: 30px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.image-wrapper:active {
  transform: rotateY(3deg) rotateX(3deg);
}

.image-wrapper img {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.4));
  transition: all 0.5s ease;
  position: relative;
  z-index: 2;
  display: block;
  margin: 0 auto;
}

.image-reflection {
  position: absolute;
  bottom: -20px;
  left: 10%;
  width: 80%;
  height: 30px;
  background: linear-gradient(
    180deg,
    rgba(212, 175, 55, 0.1) 0%,
    transparent 100%
  );
  filter: blur(10px);
  border-radius: 50%;
  pointer-events: none;
}

.image-glow-premium {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.2) 0%,
    rgba(212, 175, 55, 0) 70%
  );
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.image-wrapper:active .image-glow-premium {
  opacity: 1;
}

.image-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 175, 55, 0.2),
    transparent
  );
  transition: left 0.6s ease;
  pointer-events: none;
  border-radius: 30px;
}

.image-wrapper:active .image-shine {
  left: 100%;
}

/* Botões de navegação premium */
.nav-btn-premium {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(11, 11, 15, 0.85);
  backdrop-filter: blur(12px);
  color: var(--white-soft);
  border: 1px solid rgba(212, 175, 55, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  touch-action: manipulation;
}

.nav-btn-premium:active {
  transform: translateY(-50%) scale(0.95);
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--gold-primary);
}

.prev-premium {
  left: 16px;
}

.next-premium {
  right: 16px;
}

/* Dots premium */
.dots-premium {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 100;
  padding: 8px;
}

.dot-premium {
  width: 40px;
  height: 4px;
  background: rgba(245, 240, 230, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 0;
  position: relative;
  overflow: hidden;
  padding: 8px 0;
  margin: -8px 0;
  background-clip: content-box;
}

.dot-premium:active {
  background: rgba(212, 175, 55, 0.6);
}

.dot-premium.active {
  background: var(--gold-primary);
  width: 52px;
}

.dot-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.4);
  transform: translateX(-100%);
}

.dot-premium.active .dot-progress {
  animation: progressBarPremium 8s linear forwards;
}

@keyframes progressBarPremium {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Slide counter premium */
.slide-counter {
  position: absolute;
  bottom: 28px;
  right: 20px;
  background: rgba(11, 11, 15, 0.7);
  backdrop-filter: blur(10px);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(245, 240, 230, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.2);
  z-index: 100;
}

.slide-counter .current {
  color: var(--gold-primary);
  font-weight: 700;
}

.slide-counter .separator {
  margin: 0 4px;
  color: rgba(245, 240, 230, 0.4);
}

/* Animações */
@keyframes slideInLeftPremium {
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRightPremium {
  from {
    opacity: 0;
    transform: translateX(60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ========== RESPONSIVIDADE MOBILE ========== */
@media (max-width: 768px) {
  .hero-banner-premium {
    min-height: 100vh;
    max-height: none;
  }

  .slide-content-premium {
    flex-direction: column;
    text-align: center;
    padding: 100px 20px 80px;
    gap: 32px;
    min-height: 100vh;
    justify-content: center;
  }

  .slide-text-premium {
    text-align: center;
    order: 2;
    width: 100%;
  }

  .text-content-premium {
    max-width: 100%;
  }

  .slide-image-premium {
    order: 1;
    width: 100%;
  }

  .slide-title-premium {
    font-size: 1.8rem;
    margin-bottom: 16px;
  }

  .price-premium {
    font-size: 1.8rem;
  }

  .slide-button-premium {
    justify-content: center;
    margin: 0 auto;
    padding: 12px 28px;
    width: 100%;
    max-width: 280px;
  }

  .image-wrapper {
    padding: 20px;
    max-width: 280px;
    margin: 0 auto;
  }

  .image-wrapper img {
    max-width: 220px;
  }

  .nav-btn-premium {
    width: 44px;
    height: 44px;
  }

  .prev-premium {
    left: 12px;
  }

  .next-premium {
    right: 12px;
  }

  .dots-premium {
    bottom: 20px;
    gap: 10px;
  }

  .dot-premium {
    width: 32px;
  }

  .dot-premium.active {
    width: 44px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-banner-premium {
    min-height: 90vh;
    max-height: 700px;
  }

  .slide-content-premium {
    padding: 60px 40px;
    gap: 40px;
  }

  .slide-title-premium {
    font-size: 2.2rem;
  }
}

@media (min-width: 1025px) {
  .hero-banner-premium {
    height: 700px;
    min-height: auto;
  }

  .nav-btn-premium {
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero-banner-premium:hover .nav-btn-premium {
    opacity: 0.8;
  }

  .nav-btn-premium:hover {
    opacity: 1 !important;
    background: rgba(212, 175, 55, 0.2);
    border-color: var(--gold-primary);
    transform: translateY(-50%) scale(1.1);
  }

  .slide-button-premium:hover::before {
    left: 100%;
  }

  .slide-button-premium:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
    gap: 16px;
  }

  .image-wrapper:hover {
    transform: rotateY(5deg) rotateX(5deg);
  }

  .image-wrapper:hover img {
    transform: scale(1.05);
  }
}

@media (max-width: 480px) {
  .slide-title-premium {
    font-size: 1.5rem;
  }

  .price-premium {
    font-size: 1.5rem;
  }

  .slide-button-premium {
    padding: 10px 24px;
    font-size: 0.85rem;
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
