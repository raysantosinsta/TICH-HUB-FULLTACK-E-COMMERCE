<template>
  <div class="parallax-wrapper-premium">
    <!-- Seção 1 -->
    <div class="parallax-container-premium">
      <div class="parallax-bg-premium" :style="{ backgroundImage: `url(${bgImage1})` }">
        <div class="overlay-premium"></div>
        <div class="light-sweep-parallax"></div>
        <div class="content-premium">
          <div class="text-content-premium" data-aos="fade-up">
            <div class="badge-premium">
              <span class="badge-icon">🔥</span>
              <span class="badge-text">Oferta Especial</span>
              <div class="badge-glow"></div>
            </div>
            <h2 class="title-premium">Coleção <span class="gold-text">Exclusiva</span></h2>
            <p class="description-premium">Produtos selecionados com até 50% OFF. Não perca essa oportunidade única!</p>
            <router-link to="/products" class="btn-premium">
              <span>Comprar Agora</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="corner-decoration"></div>
      </div>
    </div>

    <!-- Seção 2 -->
    <div class="parallax-container-premium">
      <div class="parallax-bg-premium" :style="{ backgroundImage: `url(${bgImage2})` }">
        <div class="overlay-premium"></div>
        <div class="light-sweep-parallax"></div>
        <div class="content-premium right">
          <div class="text-content-premium" data-aos="fade-up">
            <div class="badge-premium">
              <span class="badge-icon">📱</span>
              <span class="badge-text">Novidades Tech</span>
              <div class="badge-glow"></div>
            </div>
            <h2 class="title-premium">Tecnologia de <span class="gold-text">Ponta</span></h2>
            <p class="description-premium">Os melhores eletrônicos com garantia premium e qualidade incomparável.</p>
            <router-link to="/products?category=electronics" class="btn-premium">
              <span>Ver Produtos</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="corner-decoration"></div>
      </div>
    </div>

    <!-- Seção 3 -->
    <div class="parallax-container-premium">
      <div class="parallax-bg-premium" :style="{ backgroundImage: `url(${bgImage3})` }">
        <div class="overlay-premium"></div>
        <div class="light-sweep-parallax"></div>
        <div class="content-premium">
          <div class="text-content-premium" data-aos="fade-up">
            <div class="badge-premium">
              <span class="badge-icon">👗</span>
              <span class="badge-text">Moda & Estilo</span>
              <div class="badge-glow"></div>
            </div>
            <h2 class="title-premium">Vista-se com <span class="gold-text">Estilo</span></h2>
            <p class="description-premium">As melhores tendências da moda masculina e feminina em um só lugar.</p>
            <router-link to="/products" class="btn-premium">
              <span>Explorar Coleção</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="corner-decoration"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imagens de fundo premium (imagens gratuitas de alta qualidade)
const bgImage1 = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop'
const bgImage2 = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=800&fit=crop'
const bgImage3 = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=800&fit=crop'
</script>

<style scoped>
/* ========== PARALLAX PREMIUM ========== */
.parallax-wrapper-premium {
  margin: 80px 0;
  position: relative;
}

.parallax-container-premium {
  position: relative;
  height: 550px;
  overflow: hidden;
  margin-bottom: 40px;
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.parallax-container-premium:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 50px rgba(212, 175, 55, 0.2);
}

.parallax-bg-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.parallax-container-premium:hover .parallax-bg-premium {
  transform: scale(1.05);
}

/* Overlay Premium */
.overlay-premium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.5) 40%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(212, 175, 55, 0.1) 100%
  );
  z-index: 1;
  transition: all 0.5s ease;
}

.parallax-container-premium:hover .overlay-premium {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.55) 40%,
    rgba(0, 0, 0, 0.45) 70%,
    rgba(212, 175, 55, 0.2) 100%
  );
}

/* Efeito de Luz que Varre */
.light-sweep-parallax {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 175, 55, 0.15),
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  pointer-events: none;
}

.parallax-container-premium:hover .light-sweep-parallax {
  left: 100%;
}

/* Conteúdo */
.content-premium {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10%;
}

.content-premium.right {
  justify-content: flex-end;
  text-align: right;
}

.text-content-premium {
  max-width: 550px;
  animation: fadeInUpParallax 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUpParallax {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Badge Premium */
.badge-premium {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.15);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gold-primary);
  margin-bottom: 24px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  overflow: hidden;
  transition: all 0.3s ease;
}

.badge-premium:hover {
  transform: translateY(-2px);
  border-color: var(--gold-primary);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
}

.badge-icon {
  font-size: 1rem;
  animation: badgePulseParallax 2s ease-in-out infinite;
}

@keyframes badgePulseParallax {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.badge-text {
  letter-spacing: 0.5px;
}

.badge-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
  transition: left 0.5s ease;
}

.badge-premium:hover .badge-glow {
  left: 100%;
}

/* Título Premium */
.title-premium {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #F5F0E6 0%, #FFFFFF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.title-premium .gold-text {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #F5E6A0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  display: inline-block;
}

.title-premium .gold-text::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--gold-primary), transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.content-premium:hover .title-premium .gold-text::after {
  transform: scaleX(1);
}

/* Descrição Premium */
.description-premium {
  font-size: 1.05rem;
  color: rgba(245, 240, 230, 0.9);
  margin-bottom: 32px;
  line-height: 1.6;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

/* Botão Premium */
.btn-premium {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 14px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-premium:hover::before {
  left: 100%;
}

.btn-premium:hover {
  transform: translateY(-3px);
  gap: 16px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
}

.btn-premium svg {
  transition: transform 0.3s ease;
}

.btn-premium:hover svg {
  transform: translateX(5px);
}

/* Decoração de Canto */
.corner-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

.corner-decoration::before,
.corner-decoration::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  border-style: solid;
  border-color: rgba(212, 175, 55, 0.3);
  transition: all 0.4s ease;
}

.corner-decoration::before {
  top: 20px;
  left: 20px;
  border-width: 2px 0 0 2px;
}

.corner-decoration::after {
  bottom: 20px;
  right: 20px;
  border-width: 0 2px 2px 0;
}

.parallax-container-premium:hover .corner-decoration::before {
  top: 30px;
  left: 30px;
  border-color: var(--gold-primary);
}

.parallax-container-premium:hover .corner-decoration::after {
  bottom: 30px;
  right: 30px;
  border-color: var(--gold-primary);
}

/* Efeito de brilho no container */
.parallax-container-premium::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
  transform: scaleX(0);
  transition: transform 0.5s ease;
  z-index: 5;
}

.parallax-container-premium:hover::after {
  transform: scaleX(1);
}

/* Responsividade Premium */
@media (min-width: 768px) {
  .parallax-bg-premium {
    background-attachment: fixed;
  }
}

@media (max-width: 1024px) {
  .parallax-container-premium {
    height: 500px;
    margin-bottom: 30px;
    border-radius: 28px;
  }
  
  .title-premium {
    font-size: 2.5rem;
  }
  
  .description-premium {
    font-size: 1rem;
  }
  
  .btn-premium {
    padding: 12px 28px;
  }
}

@media (max-width: 768px) {
  .parallax-wrapper-premium {
    margin: 60px 0;
  }
  
  .parallax-container-premium {
    height: auto;
    min-height: 450px;
    margin-bottom: 24px;
    border-radius: 24px;
  }
  
  .content-premium {
    justify-content: center !important;
    text-align: center;
    padding: 50px 24px;
  }
  
  .text-content-premium {
    text-align: center;
    max-width: 100%;
  }
  
  .title-premium {
    font-size: 2rem;
  }
  
  .description-premium {
    font-size: 0.95rem;
    margin-bottom: 28px;
  }
  
  .btn-premium {
    padding: 10px 24px;
    font-size: 0.9rem;
  }
  
  /* Desativar parallax no mobile para melhor performance */
  .parallax-bg-premium {
    background-attachment: scroll !important;
  }
  
  .corner-decoration::before,
  .corner-decoration::after {
    width: 50px;
    height: 50px;
  }
  
  .corner-decoration::before {
    top: 12px;
    left: 12px;
  }
  
  .corner-decoration::after {
    bottom: 12px;
    right: 12px;
  }
}

@media (max-width: 480px) {
  .parallax-wrapper-premium {
    margin: 40px 0;
  }
  
  .parallax-container-premium {
    min-height: 400px;
    margin-bottom: 20px;
    border-radius: 20px;
  }
  
  .content-premium {
    padding: 40px 20px;
  }
  
  .title-premium {
    font-size: 1.6rem;
  }
  
  .badge-premium {
    padding: 6px 16px;
    font-size: 0.75rem;
    margin-bottom: 20px;
  }
  
  .badge-icon {
    font-size: 0.85rem;
  }
  
  .description-premium {
    font-size: 0.85rem;
    margin-bottom: 24px;
  }
  
  .btn-premium {
    padding: 10px 20px;
    font-size: 0.85rem;
    gap: 8px;
  }
  
  .btn-premium svg {
    width: 16px;
    height: 16px;
  }
  
  .corner-decoration::before,
  .corner-decoration::after {
    width: 35px;
    height: 35px;
  }
  
  .corner-decoration::before {
    top: 8px;
    left: 8px;
  }
  
  .corner-decoration::after {
    bottom: 8px;
    right: 8px;
  }
}

/* Animação de entrada suave para cada seção */
.parallax-container-premium:nth-child(1) .text-content-premium {
  animation-delay: 0.1s;
}

.parallax-container-premium:nth-child(2) .text-content-premium {
  animation-delay: 0.2s;
}

.parallax-container-premium:nth-child(3) .text-content-premium {
  animation-delay: 0.3s;
}
</style>