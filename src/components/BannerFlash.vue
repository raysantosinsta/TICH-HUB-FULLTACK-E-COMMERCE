<template>
  <div class="flash-offers-premium">
    <div class="container-premium">
      <div class="flash-header-premium">
        <div class="header-left-premium">
          <div class="flash-icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <div class="icon-pulse"></div>
          </div>
          <h2 class="flash-title">Ofertas <span class="gold-text">Relâmpago</span></h2>
        </div>
        <div class="timer-premium" v-if="timeLeft">
          <div class="timer-card">
            <span class="timer-value-premium">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
            <span class="timer-label-premium">Horas</span>
          </div>
          <span class="timer-separator-premium">:</span>
          <div class="timer-card">
            <span class="timer-value-premium">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
            <span class="timer-label-premium">Minutos</span>
          </div>
          <span class="timer-separator-premium">:</span>
          <div class="timer-card">
            <span class="timer-value-premium">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
            <span class="timer-label-premium">Segundos</span>
          </div>
        </div>
      </div>
      
      <div class="offers-grid-premium">
        <div 
          v-for="offer in offers" 
          :key="offer.id"
          class="offer-card-premium"
          @click="navigateToCategory(offer)"
        >
          <div class="offer-image-premium">
            <img :src="offer.image" :alt="offer.name">
            <div class="image-overlay-premium"></div>
            <div class="offer-discount-premium">
              <span>{{ offer.discount }}</span>
              <span class="discount-sub">OFF</span>
            </div>
            <div class="offer-shine"></div>
          </div>
          <div class="offer-content-premium">
            <div class="offer-icon-premium">{{ offer.icon }}</div>
            <h3 class="offer-title-premium">{{ offer.name }}</h3>
            <p class="offer-description-premium">{{ offer.description }}</p>
            <div class="offer-footer-premium">
              <div class="price-info-premium">
                <span class="offer-price-premium">{{ offer.priceRange }}</span>
                <span class="price-range-label">faixa de preço</span>
              </div>
              <button class="offer-button-premium">
                <span>Comprar agora</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="card-glow-premium"></div>
        </div>
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

// Dados das ofertas
const offers = computed(() => {
  // Obter produtos por categoria para mostrar faixa de preço
  const getProductsByCategory = (category: string) => {
    return store.products.filter(p => p.category === category)
  }

  const mensProducts = getProductsByCategory("men's clothing")
  const womensProducts = getProductsByCategory("women's clothing")
  const jeweleryProducts = getProductsByCategory("jewelery")
  const electronicsProducts = getProductsByCategory("electronics")

  // Calcular faixa de preço
  const getPriceRange = (products: any[]) => {
    if (products.length === 0) return "R$ 0 - R$ 0"
    const prices = products.map(p => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return `R$ ${min.toFixed(2)} - R$ ${max.toFixed(2)}`
  }

  return [
    {
      id: 1,
      name: "Moda Masculina",
      category: "men's clothing",
      icon: "👔",
      discount: "-40%",
      description: "Estilo e elegância com até 40% OFF",
      priceRange: getPriceRange(mensProducts),
      image: mensProducts[0]?.image || "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
    },
    {
      id: 2,
      name: "Moda Feminina",
      category: "women's clothing",
      icon: "👗",
      discount: "-35%",
      description: "Tendências e sofisticação com até 35% OFF",
      priceRange: getPriceRange(womensProducts),
      image: womensProducts[0]?.image || "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png"
    },
    {
      id: 3,
      name: "Jóias",
      category: "jewelery",
      icon: "💍",
      discount: "-25%",
      description: "Peças exclusivas com até 25% OFF",
      priceRange: getPriceRange(jeweleryProducts),
      image: jeweleryProducts[0]?.image || "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png"
    },
    {
      id: 4,
      name: "Eletrônicos",
      category: "electronics",
      icon: "📱",
      discount: "-50%",
      description: "Tecnologia de ponta com até 50% OFF",
      priceRange: getPriceRange(electronicsProducts),
      image: electronicsProducts[0]?.image || "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png"
    }
  ]
})

// Temporizador
const timeLeft = ref({ hours: 23, minutes: 59, seconds: 59 })
let timerInterval: number | null = null

const updateTimer = () => {
  const now = new Date()
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)
  
  const diff = endOfDay.getTime() - now.getTime()
  
  if (diff <= 0) {
    if (timerInterval) clearInterval(timerInterval)
    return
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  timeLeft.value = { hours, minutes, seconds }
}

const navigateToCategory = (offer: any) => {
  router.push(`/products?category=${encodeURIComponent(offer.category)}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  updateTimer()
  timerInterval = window.setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
/* ========== FLASH OFFERS PREMIUM ========== */
.flash-offers-premium {
  margin: 80px 0;
  position: relative;
}

.container-premium {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

/* Header Premium */
.flash-header-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 24px;
}

.header-left-premium {
  display: flex;
  align-items: center;
  gap: 16px;
}

.flash-icon-wrapper {
  position: relative;
}

.flash-icon-wrapper svg {
  color: var(--gold-primary);
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
  animation: flashPulse 1.5s ease-in-out infinite;
}

@keyframes flashPulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.6));
  }
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseRing 2s ease-in-out infinite;
}

@keyframes pulseRing {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.flash-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.flash-title .gold-text {
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
  color: var(--gold-primary);
}

/* Timer Premium */
.timer-premium {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(20px);
  padding: 12px 28px;
  border-radius: 60px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.timer-card {
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 16px;
  border-radius: 16px;
  min-width: 70px;
  transition: all 0.3s ease;
}

.timer-card:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.timer-value-premium {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: block;
  line-height: 1;
  letter-spacing: 2px;
}

.timer-label-premium {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-top: 4px;
}

.timer-separator-premium {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: separatorPulse 1s ease-in-out infinite;
}

@keyframes separatorPulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Grid de Ofertas */
.offers-grid-premium {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

/* Card Premium */
.offer-card-premium {
  position: relative;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 28px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: fadeInUp 0.6s ease backwards;
}

.offer-card-premium:nth-child(1) { animation-delay: 0.1s; }
.offer-card-premium:nth-child(2) { animation-delay: 0.2s; }
.offer-card-premium:nth-child(3) { animation-delay: 0.3s; }
.offer-card-premium:nth-child(4) { animation-delay: 0.4s; }

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

.offer-card-premium:hover {
  transform: translateY(-12px);
  border-color: var(--gold-primary);
  box-shadow: 0 30px 50px rgba(212, 175, 55, 0.25);
}

.card-glow-premium {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.15), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.offer-card-premium:hover .card-glow-premium {
  left: 100%;
}

/* Imagem do Produto */
.offer-image-premium {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(59, 58, 64, 0.3) 0%, rgba(59, 58, 64, 0.1) 100%);
}

.offer-image-premium img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.offer-card-premium:hover .offer-image-premium img {
  transform: scale(1.12);
}

.image-overlay-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(0,0,0,0.1) 0%, 
    rgba(0,0,0,0.4) 50%,
    rgba(0,0,0,0.7) 100%);
}

.offer-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.offer-card-premium:hover .offer-shine {
  left: 100%;
}

/* Discount Badge */
.offer-discount-premium {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  color: white;
  padding: 8px 14px;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 800;
  z-index: 2;
  box-shadow: 0 8px 20px rgba(255, 71, 87, 0.4);
  text-align: center;
  line-height: 1;
  animation: discountGlow 2s ease-in-out infinite;
}

.discount-sub {
  font-size: 0.7rem;
  font-weight: 500;
  display: block;
  margin-top: 2px;
}

@keyframes discountGlow {
  0%, 100% {
    box-shadow: 0 8px 20px rgba(255, 71, 87, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 8px 30px rgba(255, 71, 87, 0.7);
    transform: scale(1.05);
  }
}

/* Conteúdo do Card */
.offer-content-premium {
  position: relative;
  padding: 24px;
  text-align: center;
  z-index: 2;
}

.offer-icon-premium {
  font-size: 2.8rem;
  margin-bottom: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.offer-card-premium:hover .offer-icon-premium {
  transform: scale(1.15) translateY(-5px);
}

.offer-title-premium {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.offer-description-premium {
  font-size: 0.85rem;
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 20px;
  line-height: 1.5;
}

.offer-footer-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  gap: 12px;
  flex-wrap: wrap;
}

.price-info-premium {
  text-align: left;
}

.offer-price-premium {
  font-size: 0.9rem;
  color: var(--gold-primary);
  font-weight: 600;
  display: block;
}

.price-range-label {
  font-size: 0.65rem;
  color: rgba(245, 240, 230, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.offer-button-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1.5px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 8px 18px;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.offer-button-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
  transition: left 0.4s ease;
}

.offer-button-premium:hover::before {
  left: 100%;
}

.offer-button-premium:hover {
  background: var(--gold-primary);
  color: var(--black-primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
  gap: 12px;
}

.offer-button-premium svg {
  transition: transform 0.3s ease;
}

.offer-button-premium:hover svg {
  transform: translateX(4px);
}

/* Responsividade Premium */
@media (max-width: 1200px) {
  .offers-grid-premium {
    gap: 20px;
  }
  
  .offer-title-premium {
    font-size: 1.1rem;
  }
}

@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }
  
  .offers-grid-premium {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .flash-header-premium {
    flex-direction: column;
    text-align: center;
  }
  
  .flash-title {
    font-size: 1.6rem;
  }
  
  .timer-card {
    min-width: 60px;
    padding: 6px 12px;
  }
  
  .timer-value-premium {
    font-size: 1.4rem;
  }
}

@media (max-width: 768px) {
  .flash-offers-premium {
    margin: 50px 0;
  }
  
  .container-premium {
    padding: 0 16px;
  }
  
  .flash-header-premium {
    margin-bottom: 32px;
    gap: 16px;
  }
  
  .flash-title {
    font-size: 1.4rem;
  }
  
  .timer-premium {
    padding: 8px 20px;
    gap: 8px;
  }
  
  .timer-card {
    min-width: 50px;
    padding: 4px 10px;
  }
  
  .timer-value-premium {
    font-size: 1.2rem;
  }
  
  .timer-label-premium {
    font-size: 0.6rem;
  }
  
  .timer-separator-premium {
    font-size: 1.5rem;
  }
  
  .offers-grid-premium {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .offer-image-premium {
    height: 220px;
  }
  
  .offer-content-premium {
    padding: 20px;
  }
  
  .offer-icon-premium {
    font-size: 2.4rem;
  }
  
  .offer-title-premium {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .flash-offers-premium {
    margin: 40px 0;
  }
  
  .flash-title {
    font-size: 1.2rem;
  }
  
  .timer-premium {
    padding: 6px 16px;
  }
  
  .timer-card {
    min-width: 45px;
    padding: 4px 8px;
  }
  
  .timer-value-premium {
    font-size: 1rem;
  }
  
  .timer-label-premium {
    font-size: 0.55rem;
  }
  
  .offer-image-premium {
    height: 200px;
  }
  
  .offer-discount-premium {
    top: 12px;
    right: 12px;
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .offer-content-premium {
    padding: 16px;
  }
  
  .offer-icon-premium {
    font-size: 2rem;
  }
  
  .offer-title-premium {
    font-size: 1rem;
  }
  
  .offer-description-premium {
    font-size: 0.75rem;
  }
  
  .offer-footer-premium {
    flex-direction: column;
    text-align: center;
  }
  
  .price-info-premium {
    text-align: center;
  }
  
  .offer-button-premium {
    width: 100%;
    justify-content: center;
    padding: 10px;
  }
}
</style>