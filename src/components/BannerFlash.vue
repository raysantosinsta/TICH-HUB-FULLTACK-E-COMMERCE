<template>
  <div class="flash-offers">
    <div class="container">
      <div class="flash-header">
        <div class="header-left">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <h2>Ofertas Relâmpago</h2>
        </div>
        <div class="timer" v-if="timeLeft">
          <div class="timer-unit">
            <span class="timer-value">{{ timeLeft.hours }}</span>
            <span class="timer-label">horas</span>
          </div>
          <span class="timer-separator">:</span>
          <div class="timer-unit">
            <span class="timer-value">{{ timeLeft.minutes }}</span>
            <span class="timer-label">min</span>
          </div>
          <span class="timer-separator">:</span>
          <div class="timer-unit">
            <span class="timer-value">{{ timeLeft.seconds }}</span>
            <span class="timer-label">seg</span>
          </div>
        </div>
      </div>
      
      <div class="offers-grid">
        <div 
          v-for="offer in offers" 
          :key="offer.id"
          class="offer-card"
          @click="navigateToCategory(offer)"
        >
          <div class="offer-image">
            <img :src="offer.image" :alt="offer.name">
            <div class="image-overlay"></div>
            <div class="offer-discount">{{ offer.discount }}</div>
          </div>
          <div class="offer-content">
            <div class="offer-icon">{{ offer.icon }}</div>
            <h3 class="offer-title">{{ offer.name }}</h3>
            <p class="offer-description">{{ offer.description }}</p>
            <div class="offer-footer">
              <span class="offer-price">{{ offer.priceRange }}</span>
              <button class="offer-button">
                Comprar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
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
.flash-offers {
  margin: 60px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.flash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left svg {
  color: #ff6b6b;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.flash-header h2 {
  font-size: 1.8rem;
  color: var(--white-soft);
  margin: 0;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.5);
  padding: 8px 20px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.timer-unit {
  text-align: center;
}

.timer-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--gold-primary);
  background: rgba(0,0,0,0.5);
  padding: 4px 8px;
  border-radius: 8px;
  min-width: 50px;
  display: inline-block;
}

.timer-label {
  font-size: 0.7rem;
  color: rgba(245, 240, 230, 0.6);
  margin-left: 4px;
}

.timer-separator {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--gold-primary);
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.offer-card {
  position: relative;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.offer-card:hover {
  transform: translateY(-8px);
  border-color: var(--gold-primary);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
}

.offer-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.offer-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.offer-card:hover .offer-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
}

.offer-discount {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  animation: discountPulse 2s ease-in-out infinite;
}

@keyframes discountPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.offer-content {
  position: relative;
  padding: 20px;
  text-align: center;
  z-index: 2;
}

.offer-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  transition: transform 0.3s ease;
}

.offer-card:hover .offer-icon {
  transform: scale(1.1);
}

.offer-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--white-soft);
  margin-bottom: 6px;
}

.offer-description {
  font-size: 0.8rem;
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 16px;
  line-height: 1.4;
}

.offer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.offer-price {
  font-size: 0.85rem;
  color: rgba(245, 240, 230, 0.8);
  font-weight: 500;
}

.offer-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--gold-primary);
  color: var(--gold-primary);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.offer-button svg {
  transition: transform 0.3s ease;
}

.offer-card:hover .offer-button {
  background: var(--gold-primary);
  color: var(--black-primary);
}

.offer-card:hover .offer-button svg {
  transform: translateX(4px);
}

/* Responsividade */
@media (max-width: 1024px) {
  .offers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .flash-header h2 {
    font-size: 1.5rem;
  }
  
  .timer-value {
    font-size: 1.2rem;
    min-width: 40px;
  }
}

@media (max-width: 768px) {
  .flash-offers {
    margin: 40px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .flash-header {
    flex-direction: column;
    text-align: center;
  }
  
  .offers-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .offer-image {
    height: 200px;
  }
  
  .offer-content {
    padding: 16px;
  }
  
  .offer-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .offer-image {
    height: 180px;
  }
  
  .offer-content {
    padding: 14px;
  }
  
  .offer-icon {
    font-size: 2rem;
  }
  
  .offer-title {
    font-size: 1rem;
  }
  
  .offer-description {
    font-size: 0.75rem;
  }
  
  .offer-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .offer-button {
    width: 100%;
    justify-content: center;
  }
}
</style>