<template>
  <div class="banner-grid-premium" v-if="promoBanners.length > 0">
    <div class="grid-container-premium">
      <div 
        v-for="banner in promoBanners" 
        :key="banner.id"
        class="grid-item-premium"
        :style="{ backgroundImage: `url(${banner.image})` }"
      >
        <!-- Overlay Gradiente Premium -->
        <div class="item-overlay-premium"></div>
        
        <!-- Efeito de Luz que Varre -->
        <div class="light-sweep-banner"></div>
        
        <!-- Conteúdo do Banner -->
        <div class="item-content-premium">
          <div class="content-wrapper">
            <div class="badge-premium" v-if="banner.badge">
              <span>{{ banner.badge }}</span>
            </div>
            <h3 class="item-title-premium">{{ banner.title }}</h3>
            <p class="item-subtitle-premium">{{ banner.subtitle }}</p>
            <router-link :to="banner.buttonLink" class="item-button-premium">
              <span>{{ banner.buttonText }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </router-link>
          </div>
        </div>
        
        <!-- Efeito de Brilho no Canto -->
        <div class="corner-glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBannersStore } from '../stores/banners'

const bannersStore = useBannersStore()
const promoBanners = computed(() => bannersStore.promoBanners)
</script>

<style scoped>
/* ========== BANNER GRID PREMIUM ========== */
.banner-grid-premium {
  margin: 80px 0;
  position: relative;
}

.grid-container-premium {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 32px;
}

/* Card Premium */
.grid-item-premium {
  position: relative;
  height: 320px;
  background-size: cover;
  background-position: center;
  border-radius: 28px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUpBanner 0.6s ease backwards;
}

.grid-item-premium:nth-child(1) { animation-delay: 0.1s; }
.grid-item-premium:nth-child(2) { animation-delay: 0.2s; }
.grid-item-premium:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUpBanner {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid-item-premium:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 30px 50px rgba(212, 175, 55, 0.25);
}

/* Overlay Gradiente Premium */
.item-overlay-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.5) 40%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.5) 100%
  );
  transition: all 0.5s ease;
}

.grid-item-premium:hover .item-overlay-premium {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(212, 175, 55, 0.2) 40%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

/* Efeito de Luz que Varre */
.light-sweep-banner {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 175, 55, 0.2),
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 2;
}

.grid-item-premium:hover .light-sweep-banner {
  left: 100%;
}

/* Conteúdo do Banner */
.item-content-premium {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  z-index: 3;
  animation: slideUpContent 0.6s ease backwards;
}

@keyframes slideUpContent {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-wrapper {
  max-width: 90%;
}

/* Badge Premium */
.badge-premium {
  display: inline-block;
  margin-bottom: 16px;
  animation: badgePulse 2s ease-in-out infinite;
}

.badge-premium span {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Título Premium */
.item-title-premium {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
  line-height: 1.2;
  position: relative;
  display: inline-block;
}

.item-title-premium::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, var(--gold-primary), transparent);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.grid-item-premium:hover .item-title-premium::after {
  width: 80px;
}

/* Subtítulo Premium */
.item-subtitle-premium {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 24px;
  line-height: 1.5;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  max-width: 90%;
}

/* Botão Premium */
.item-button-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 12px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.item-button-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.item-button-premium:hover::before {
  left: 100%;
}

.item-button-premium:hover {
  transform: translateX(8px);
  gap: 15px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
}

.item-button-premium svg {
  transition: transform 0.3s ease;
}

.item-button-premium:hover svg {
  transform: translateX(4px);
}

/* Efeito de Brilho nos Cantos */
.corner-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.corner-glow::before,
.corner-glow::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.corner-glow::before {
  top: -50px;
  right: -50px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
}

.corner-glow::after {
  bottom: -50px;
  left: -50px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
}

.grid-item-premium:hover .corner-glow::before,
.grid-item-premium:hover .corner-glow::after {
  opacity: 1;
}

/* Efeito de Reflexo na Base */
.grid-item-premium::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 20px;
  background: radial-gradient(ellipse, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
  filter: blur(10px);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: 1;
}

.grid-item-premium:hover::after {
  opacity: 1;
}

/* Responsividade Premium */
@media (max-width: 1200px) {
  .grid-container-premium {
    gap: 24px;
  }
  
  .grid-item-premium {
    height: 300px;
  }
  
  .item-title-premium {
    font-size: 1.6rem;
  }
  
  .item-content-premium {
    padding: 32px;
  }
}

@media (max-width: 1024px) {
  .banner-grid-premium {
    margin: 60px 0;
  }
  
  .grid-container-premium {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }
  
  .grid-item-premium {
    height: 280px;
    border-radius: 24px;
  }
  
  .item-content-premium {
    padding: 28px;
  }
  
  .item-title-premium {
    font-size: 1.4rem;
  }
  
  .item-subtitle-premium {
    font-size: 0.85rem;
    max-width: 100%;
  }
  
  .item-button-premium {
    padding: 10px 24px;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .banner-grid-premium {
    margin: 50px 0;
  }
  
  .grid-container-premium {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .grid-item-premium {
    height: 280px;
    border-radius: 24px;
  }
  
  .item-content-premium {
    padding: 28px;
  }
  
  .item-title-premium {
    font-size: 1.5rem;
  }
  
  .item-title-premium::after {
    width: 40px;
  }
  
  .grid-item-premium:hover .item-title-premium::after {
    width: 60px;
  }
  
  .item-subtitle-premium {
    font-size: 0.9rem;
    max-width: 100%;
  }
  
  .item-button-premium {
    padding: 10px 24px;
  }
}

@media (max-width: 480px) {
  .banner-grid-premium {
    margin: 40px 0;
  }
  
  .grid-item-premium {
    height: 260px;
    border-radius: 20px;
  }
  
  .item-content-premium {
    padding: 20px;
  }
  
  .badge-premium span {
    padding: 4px 12px;
    font-size: 0.7rem;
  }
  
  .item-title-premium {
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  
  .item-title-premium::after {
    bottom: -6px;
    width: 30px;
  }
  
  .grid-item-premium:hover .item-title-premium::after {
    width: 50px;
  }
  
  .item-subtitle-premium {
    font-size: 0.8rem;
    margin-bottom: 16px;
  }
  
  .item-button-premium {
    padding: 8px 20px;
    font-size: 0.8rem;
  }
}

/* Animação de entrada para os banners */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Efeito de brilho no hover do card */
.grid-item-premium {
  position: relative;
  isolation: isolate;
}

.grid-item-premium::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 28px;
  padding: 2px;
  background: linear-gradient(135deg, transparent 0%, var(--gold-primary) 50%, transparent 100%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.grid-item-premium:hover::before {
  opacity: 1;
}
</style>