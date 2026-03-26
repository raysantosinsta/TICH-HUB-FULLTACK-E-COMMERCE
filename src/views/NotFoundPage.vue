<template>
  <div class="not-found-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="error-particles">
        <div v-for="i in 60" :key="i" class="error-particle" :style="getParticleStyle(i)">
          ✨
        </div>
      </div>
    </div>

    <div class="container-premium">
      <div class="not-found-card-premium">
        <div class="card-glow-premium"></div>
        
        <div class="error-animation-premium">
          <div class="error-404-premium">
            <span class="digit digit-1">4</span>
            <span class="digit digit-2">0</span>
            <span class="digit digit-3">4</span>
            <div class="error-ring"></div>
          </div>
          <div class="floating-elements">
            <div class="float-element">🔍</div>
            <div class="float-element">❓</div>
            <div class="float-element">⚠️</div>
            <div class="float-element">🌟</div>
          </div>
        </div>

        <h1 class="error-title-premium">Página não encontrada</h1>
        <p class="error-message-premium">
          Oops! A página que você está procurando não existe, foi movida ou está temporariamente indisponível.
        </p>
        
        <div class="error-actions-premium">
          <router-link to="/" class="btn-primary-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M9 21V12H15V21" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Voltar para Home</span>
          </router-link>
          <button @click="goBack" class="btn-outline-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Voltar</span>
          </button>
        </div>

        <div class="suggestions-premium">
          <p class="suggestions-title">Você pode tentar:</p>
          <div class="suggestions-links">
            <router-link to="/" class="suggestion-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Página inicial
            </router-link>
            <router-link to="/products" class="suggestion-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Explorar produtos
            </router-link>
            <router-link to="/favorites" class="suggestion-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
              </svg>
              Meus favoritos
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${12 + Math.random() * 15}s`,
    opacity: 0.1 + Math.random() * 0.3
  }
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
/* ========== 404 NOT FOUND PREMIUM ========== */
.not-found-premium {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  padding: 40px 20px;
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
  animation: gradientPulse404 8s ease-in-out infinite;
}

@keyframes gradientPulse404 {
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
  animation: lightSweep404 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweep404 {
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

.error-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.error-particle {
  position: absolute;
  font-size: 14px;
  animation: floatParticle404 linear infinite;
  opacity: 0;
}

@keyframes floatParticle404 {
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
  max-width: 700px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Not Found Card Premium */
.not-found-card-premium {
  position: relative;
  background: rgba(11, 11, 15, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 48px;
  padding: 60px 48px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  text-align: center;
  animation: fadeInUp 0.6s ease;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.not-found-card-premium:hover {
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
}

.card-glow-premium {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.08), transparent);
  transition: left 0.8s ease;
  pointer-events: none;
}

.not-found-card-premium:hover .card-glow-premium {
  left: 100%;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Error Animation Premium */
.error-animation-premium {
  position: relative;
  margin-bottom: 32px;
}

.error-404-premium {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.digit {
  font-size: 8rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  animation: floatDigit 3s ease-in-out infinite;
  display: inline-block;
}

.digit-1 {
  animation-delay: 0s;
}

.digit-2 {
  animation-delay: 0.2s;
}

.digit-3 {
  animation-delay: 0.4s;
}

@keyframes floatDigit {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.float-element {
  position: absolute;
  font-size: 24px;
  animation: floatElement 4s ease-in-out infinite;
}

.float-element:nth-child(1) {
  top: -20px;
  left: 10%;
  animation-delay: 0s;
}

.float-element:nth-child(2) {
  top: 30%;
  right: -30px;
  animation-delay: 0.5s;
}

.float-element:nth-child(3) {
  bottom: -20px;
  left: 20%;
  animation-delay: 1s;
}

.float-element:nth-child(4) {
  top: 50%;
  left: -30px;
  animation-delay: 1.5s;
}

@keyframes floatElement {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-15px) rotate(10deg);
    opacity: 1;
  }
}

/* Title and Message */
.error-title-premium {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 16px;
}

.error-message-premium {
  color: rgba(245, 240, 230, 0.7);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Action Buttons */
.error-actions-premium {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.btn-primary-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

.btn-primary-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-primary-premium:hover::before {
  left: 100%;
}

.btn-primary-premium:hover {
  transform: translateY(-2px);
  gap: 14px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.btn-outline-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: transparent;
  border: 1.5px solid var(--gold-primary);
  color: var(--gold-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

.btn-outline-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-outline-premium:hover::before {
  left: 100%;
}

.btn-outline-premium:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
  gap: 14px;
}

/* Suggestions Premium */
.suggestions-premium {
  padding-top: 32px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.suggestions-title {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.suggestions-links {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.suggestion-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(245, 240, 230, 0.7);
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 30px;
}

.suggestion-link svg {
  transition: transform 0.3s ease;
}

.suggestion-link:hover {
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.1);
  transform: translateX(5px);
}

.suggestion-link:hover svg {
  transform: translateX(-3px);
}

/* Responsividade Premium */
@media (max-width: 1024px) {
  .not-found-card-premium {
    padding: 48px 40px;
  }
  
  .digit {
    font-size: 6rem;
  }
  
  .error-title-premium {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .not-found-premium {
    padding: 30px 16px;
  }
  
  .not-found-card-premium {
    padding: 40px 28px;
    border-radius: 36px;
  }
  
  .digit {
    font-size: 4.5rem;
    gap: 12px;
  }
  
  .error-ring {
    width: 130px;
    height: 130px;
  }
  
  .error-title-premium {
    font-size: 1.4rem;
  }
  
  .error-message-premium {
    font-size: 0.9rem;
  }
  
  .error-actions-premium {
    gap: 16px;
  }
  
  .btn-primary-premium,
  .btn-outline-premium {
    padding: 10px 24px;
    font-size: 0.85rem;
  }
  
  .suggestions-links {
    gap: 16px;
  }
  
  .suggestion-link {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
  
  .float-element {
    font-size: 18px;
  }
  
  .float-element:nth-child(2) {
    right: -20px;
  }
  
  .float-element:nth-child(4) {
    left: -20px;
  }
}

@media (max-width: 480px) {
  .not-found-card-premium {
    padding: 32px 20px;
    border-radius: 28px;
  }
  
  .digit {
    font-size: 3.5rem;
    gap: 8px;
  }
  
  .error-ring {
    width: 100px;
    height: 100px;
  }
  
  .error-title-premium {
    font-size: 1.2rem;
  }
  
  .error-message-premium {
    font-size: 0.8rem;
  }
  
  .error-actions-premium {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-primary-premium,
  .btn-outline-premium {
    width: 100%;
    justify-content: center;
  }
  
  .suggestions-links {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .suggestion-link {
    width: 100%;
    justify-content: center;
  }
  
  .float-element {
    font-size: 14px;
  }
  
  .float-element:nth-child(2) {
    right: -15px;
  }
  
  .float-element:nth-child(4) {
    left: -15px;
  }
}
</style>