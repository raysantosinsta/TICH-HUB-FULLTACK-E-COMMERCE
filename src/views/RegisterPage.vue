<template>
  <div class="register-split-premium">
    <!-- Lado Esquerdo - Slideshow de Imagens -->
    <div class="slideshow-side-register">
      <div class="slideshow-container-register">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="slide-bg-register"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="slide-overlay-register"></div>
          <div class="slide-content-left-register">
            <div class="slide-text-animation-register">
              <div class="slide-badge-register">{{ slide.badge }}</div>
              <h2 class="slide-title-register">{{ slide.title }}</h2>
              <p class="slide-description-register">{{ slide.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicadores do Slideshow -->
      <div class="slide-indicators-register">
        <button 
          v-for="(slide, index) in slides" 
          :key="index"
          class="indicator-register"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        >
          <span class="indicator-progress-register" v-if="currentSlide === index"></span>
        </button>
      </div>
      
      <!-- Decoração de gradiente -->
      <div class="side-gradient-register"></div>
    </div>

    <!-- Lado Direito - Formulário de Registro Fixo -->
    <div class="form-side-register">
      <!-- Efeito de brilho que segue o mouse -->
      <div class="mouse-glow-form-register" ref="mouseGlowForm"></div>
      
      <div class="form-container-register">
        <div class="form-wrapper-register">
          <!-- Logo -->
          <div class="logo-area-register">
            <div class="logo-ring-register">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="logoGradientRegister" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#D4AF37"/>
                    <stop offset="50%" stop-color="#F5E6A0"/>
                    <stop offset="100%" stop-color="#D4AF37"/>
                  </linearGradient>
                </defs>
                <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="url(#logoGradientRegister)"/>
              </svg>
            </div>
            <h1 class="brand-name-register">SHOP<span class="gold">HUB</span></h1>
          </div>

          <div class="welcome-area-register">
            <h2 class="welcome-title-register">Criar conta</h2>
            <p class="welcome-subtitle-register">Comece sua jornada no ShopHub</p>
          </div>

          <form @submit.prevent="handleRegister" class="register-form-split">
            <div class="input-group-split-register">
              <label class="input-label-split-register">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Nome completo</span>
              </label>
              <div class="input-wrapper-split-register">
                <input
                  type="text"
                  v-model="name"
                  placeholder="Digite seu nome"
                  required
                  :disabled="loading"
                  class="premium-input-split-register"
                />
                <div class="input-focus-split-register"></div>
              </div>
            </div>

            <div class="input-group-split-register">
              <label class="input-label-split-register">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>E-mail</span>
              </label>
              <div class="input-wrapper-split-register">
                <input
                  type="email"
                  v-model="email"
                  placeholder="seu@email.com"
                  required
                  :disabled="loading"
                  class="premium-input-split-register"
                />
                <div class="input-focus-split-register"></div>
              </div>
            </div>

            <div class="input-group-split-register">
              <label class="input-label-split-register">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M18 8H6C4.89543 8 4 8.89543 4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 8V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Senha</span>
              </label>
              <div class="input-wrapper-split-register">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="••••••••"
                  required
                  :disabled="loading"
                  class="premium-input-split-register"
                />
                <button 
                  type="button" 
                  class="toggle-password-split-register"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M2 2L22 22M6.71 6.71C4.44 8.14 2.77 10.32 2 12C2 12 6 20 12 20C13.94 20 15.56 19.13 16.85 17.85M12 16C9.79 16 8 14.21 8 12C8 11.96 8 11.92 8 11.88" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M15.3 9.7C15.74 10.26 16 10.98 16 12C16 14.21 14.21 16 12 16" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
                <div class="input-focus-split-register"></div>
              </div>
            </div>

            <div class="input-group-split-register">
              <label class="input-label-split-register">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M18 8H6C4.89543 8 4 8.89543 4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 8V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Confirmar senha</span>
              </label>
              <div class="input-wrapper-split-register">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  placeholder="••••••••"
                  required
                  :disabled="loading"
                  class="premium-input-split-register"
                />
                <button 
                  type="button" 
                  class="toggle-password-split-register"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M2 2L22 22M6.71 6.71C4.44 8.14 2.77 10.32 2 12C2 12 6 20 12 20C13.94 20 15.56 19.13 16.85 17.85M12 16C9.79 16 8 14.21 8 12C8 11.96 8 11.92 8 11.88" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M15.3 9.7C15.74 10.26 16 10.98 16 12C16 14.21 14.21 16 12 16" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
                <div class="input-focus-split-register"></div>
              </div>
            </div>

            <button type="submit" class="register-button-split" :disabled="loading">
              <span class="button-content-split">
                <span v-if="loading" class="button-spinner-split"></span>
                <span v-else>Criar conta</span>
                <svg v-if="!loading" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </span>
            </button>

            <div v-if="errorMessage" class="error-message-split">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              {{ errorMessage }}
            </div>
          </form>

          <div class="login-area-register">
            <span>Já tem uma conta?</span>
            <router-link to="/login" class="login-link-split">
              Fazer login
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useToast } from '../plugins/toast'

const router = useRouter()
const toast = useToast()

// Form data
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const mouseGlowForm = ref<HTMLElement | null>(null)

// Slideshow
const currentSlide = ref(0)
let slideInterval: number | null = null

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop',
    badge: '✨ Novos Produtos',
    title: 'Descubra o Melhor do ShopHub',
    description: 'Milhares de produtos exclusivos esperando por você'
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop',
    badge: '👗 Moda & Estilo',
    title: 'Vista-se com Elegância',
    description: 'As melhores tendências da moda em um só lugar'
  },
  {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=1000&fit=crop',
    badge: '📱 Tecnologia',
    title: 'Inovação e Performance',
    description: 'Os últimos lançamentos do mundo tech'
  },
  {
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop',
    badge: '💎 Jóias Exclusivas',
    title: 'Peças Únicas e Sofisticadas',
    description: 'Para momentos especiais e inesquecíveis'
  }
]

// Mouse glow
const handleMouseMove = (e: MouseEvent) => {
  if (mouseGlowForm.value) {
    const rect = mouseGlowForm.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseGlowForm.value.style.background =
      `radial-gradient(circle 400px at ${x}px ${y}px, rgba(212, 175, 55, 0.12), transparent 80%)`
  }
}

// Slideshow
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetInterval()
}

const resetInterval = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  slideInterval = window.setInterval(nextSlide, 3000)
}

const handleRegister = async () => {
  errorMessage.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Preencha todos os campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Senhas não coincidem'
    return
  }

  loading.value = true

  try {

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value
        }
      }
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    // 👇 Se precisa confirmar email
    if (!data.session) {
      toast.success(
        'Conta criada!',
        'Verifique seu email para confirmar sua conta',
        4000
      )

      router.push('/login')
      return
    }

    // 👇 Se já logou automaticamente
    toast.success(
      'Conta criada!',
      'Bem-vindo ao ShopHub 🎉',
      3000
    )

    router.push('/')

  } catch (error) {
    errorMessage.value = 'Erro ao criar conta'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  resetInterval()

  const formSide = document.querySelector('.form-side-register')
  formSide?.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }

  const formSide = document.querySelector('.form-side-register')
  formSide?.removeEventListener('mousemove', handleMouseMove)
})
</script>


<style scoped>
/* ========== REGISTER SPLIT PREMIUM ========== */
.register-split-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* ========== LADO ESQUERDO - SLIDESHOW ========== */
.slideshow-side-register {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--black-primary);
}

.slideshow-container-register {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-bg-register {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  visibility: hidden;
}

.slide-bg-register.active {
  opacity: 1;
  visibility: visible;
}

.slide-overlay-register {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.35) 50%,
    rgba(0, 0, 0, 0.65) 100%
  );
}

.slide-content-left-register {
  position: absolute;
  bottom: 15%;
  left: 10%;
  right: 10%;
  z-index: 2;
  animation: fadeInUp 0.6s ease;
}

.slide-text-animation-register {
  max-width: 80%;
}

.slide-badge-register {
  display: inline-block;
  background: rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gold-primary);
  margin-bottom: 16px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.slide-title-register {
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #fff 0%, var(--gold-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.slide-description-register {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
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

/* Indicadores do Slideshow */
.slide-indicators-register {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator-register {
  width: 40px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.indicator-register.active {
  background: var(--gold-primary);
  width: 60px;
}

.indicator-progress-register {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  animation: progressBar 3s linear forwards;
}

@keyframes progressBar {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.side-gradient-register {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--black-primary));
  pointer-events: none;
  z-index: 5;
}

/* ========== LADO DIREITO - FORMULÁRIO FIXO ========== */
.form-side-register {
  width: 500px;
  background: var(--black-primary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  scrollbar-width: none;
}

.form-side-register::-webkit-scrollbar {
  display: none;
}

.mouse-glow-form-register {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: background 0.05s ease;
  z-index: 1;
}

.form-container-register {
  width: 100%;
  max-width: 420px;
  padding: 40px 28px;
  position: relative;
  z-index: 2;
}

.form-wrapper-register {
  width: 100%;
}

/* Logo Area */
.logo-area-register {
  text-align: center;
  margin-bottom: 28px;
}

.logo-ring-register {
  display: inline-block;
  animation: pulseRing 2s ease-in-out infinite;
  margin-bottom: 12px;
}

.logo-ring-register svg {
  filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.3));
}

@keyframes pulseRing {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.brand-name-register {
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.brand-name-register .gold {
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
  color: var(--gold-primary);
}

/* Welcome Area */
.welcome-area-register {
  text-align: center;
  margin-bottom: 28px;
}

.welcome-title-register {
  font-size: 1.5rem;
  color: var(--white-soft);
  margin-bottom: 6px;
  font-weight: 600;
}

.welcome-subtitle-register {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.8rem;
}

/* Formulário */
.register-form-split {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group-split-register {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label-split-register {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(245, 240, 230, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
}

.input-wrapper-split-register {
  position: relative;
}

.premium-input-split-register {
  width: 100%;
  padding: 11px 14px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  color: var(--white-soft);
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.premium-input-split-register:focus {
  outline: none;
  border-color: var(--gold-primary);
  background: rgba(59, 58, 64, 0.5);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-focus-split-register {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.premium-input-split-register:focus ~ .input-focus-split-register {
  width: 80%;
}

.toggle-password-split-register {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(245, 240, 230, 0.5);
  transition: color 0.3s ease;
  padding: 4px;
  display: flex;
  align-items: center;
}

.toggle-password-split-register:hover {
  color: var(--gold-primary);
}

/* Register Button */
.register-button-split {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border: none;
  border-radius: 40px;
  padding: 11px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.register-button-split:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
}

.register-button-split:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content-split {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--black-primary);
  font-weight: 600;
  font-size: 0.85rem;
}

.button-spinner-split {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--black-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Message */
.error-message-split {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 10px;
  padding: 8px 12px;
  color: #ff6b6b;
  font-size: 0.75rem;
}

/* Login Area */
.login-area-register {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.75rem;
}

.login-link-split {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--gold-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.75rem;
}

.login-link-split:hover {
  gap: 8px;
  color: #e6bc3e;
}

/* Responsividade */
@media (max-width: 1024px) {
  .form-side-register {
    width: 450px;
  }
  
  .slide-title-register {
    font-size: 1.8rem;
  }
  
  .form-container-register {
    padding: 32px 24px;
  }
}

@media (max-width: 900px) {
  .register-split-premium {
    flex-direction: column;
  }
  
  .slideshow-side-register {
    height: 40vh;
    min-height: 300px;
  }
  
  .form-side-register {
    width: 100%;
    height: 60vh;
  }
  
  .form-container-register {
    padding: 24px 20px;
  }
  
  .slide-content-left-register {
    bottom: 20px;
    left: 20px;
    right: 20px;
  }
  
  .slide-title-register {
    font-size: 1.3rem;
  }
  
  .slide-description-register {
    font-size: 0.8rem;
  }
  
  .side-gradient-register {
    width: 100%;
    height: 50px;
    top: auto;
    bottom: 0;
    right: 0;
    background: linear-gradient(0deg, var(--black-primary), transparent);
  }
}

@media (max-width: 480px) {
  .form-container-register {
    padding: 20px 16px;
  }
  
  .brand-name-register {
    font-size: 1.3rem;
  }
  
  .welcome-title-register {
    font-size: 1.2rem;
  }
  
  .premium-input-split-register {
    padding: 9px 12px;
    font-size: 0.8rem;
  }
  
  .register-button-split {
    padding: 10px 16px;
  }
  
  .slide-badge-register {
    font-size: 0.65rem;
    padding: 4px 12px;
  }
}
</style>