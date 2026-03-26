<template>
  <div class="login-split-premium">
    <!-- Lado Esquerdo - Slideshow de Imagens -->
    <div class="slideshow-side">
      <div class="slideshow-container">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="slide-bg"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="slide-overlay"></div>
          <div class="slide-content-left">
            <div class="slide-text-animation">
              <h2 class="slide-title">{{ slide.title }}</h2>
              <p class="slide-description">{{ slide.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicadores do Slideshow -->
      <div class="slide-indicators">
        <button 
          v-for="(slide, index) in slides" 
          :key="index"
          class="indicator"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        >
          <span class="indicator-progress" v-if="currentSlide === index"></span>
        </button>
      </div>
      
      <!-- Decoração de gradiente -->
      <div class="side-gradient"></div>
    </div>

    <!-- Lado Direito - Formulário de Login Fixo -->
    <div class="form-side">
      <!-- Efeito de brilho que segue o mouse -->
      <div class="mouse-glow-form" ref="mouseGlowForm"></div>
      
      <div class="form-container">
        <div class="form-wrapper">
          <!-- Logo -->
          <div class="logo-area">
            <div class="logo-ring">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#D4AF37"/>
                    <stop offset="50%" stop-color="#F5E6A0"/>
                    <stop offset="100%" stop-color="#D4AF37"/>
                  </linearGradient>
                </defs>
                <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="url(#logoGradient)"/>
              </svg>
            </div>
            <h1 class="brand-name">SHOP<span class="gold">HUB</span></h1>
          </div>

          <div class="welcome-area">
            <h2 class="welcome-title">Bem-vindo de volta</h2>
            <p class="welcome-subtitle">Entre no universo de experiências exclusivas</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form-split">
            <div class="input-group-split">
              <label class="input-label-split">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>E-mail</span>
              </label>
              <div class="input-wrapper-split">
                <input
                  type="email"
                  v-model="email"
                  placeholder="seu@email.com"
                  required
                  :disabled="loading"
                  class="premium-input-split"
                />
                <div class="input-focus-split"></div>
              </div>
            </div>

            <div class="input-group-split">
              <label class="input-label-split">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M18 8H6C4.89543 8 4 8.89543 4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 8V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Senha</span>
              </label>
              <div class="input-wrapper-split">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="••••••••"
                  required
                  :disabled="loading"
                  class="premium-input-split"
                />
                <button 
                  type="button" 
                  class="toggle-password-split"
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
                <div class="input-focus-split"></div>
              </div>
            </div>

            <div class="form-options-split">
              <label class="custom-checkbox-split">
                <input type="checkbox" v-model="rememberMe" :disabled="loading">
                <span class="checkmark-split"></span>
                <span class="checkbox-text-split">Lembrar de mim</span>
              </label>
              <a href="#" class="forgot-link-split" @click.prevent="handleForgotPassword">
                Esqueceu a senha?
              </a>
            </div>

            <button type="submit" class="login-button-split" :disabled="loading">
              <span class="button-content-split">
                <span v-if="loading" class="button-spinner-split"></span>
                <span v-else>Entrar na conta</span>
                <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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

          <div class="register-area">
            <span>Não tem uma conta?</span>
            <router-link to="/register" class="register-link-split">
              Criar conta gratuita
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </router-link>
          </div>

          <div class="test-credentials-split">
            <div class="credential-badge-split">
              <span>🔐 Credenciais de teste</span>
              <div class="credential-list-split">
                <code>user@test.com / 123456</code>
                <code>admin@test.com / admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// Form data
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const mouseGlowForm = ref<HTMLElement | null>(null)

// Slideshow data
const currentSlide = ref(0)
let slideInterval: number | null = null

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop',
    title: 'Coleção Exclusiva',
    description: 'Produtos selecionados com qualidade premium'
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop',
    title: 'Moda e Estilo',
    description: 'As melhores tendências em um só lugar'
  },
  {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=1000&fit=crop',
    title: 'Tecnologia de Ponta',
    description: 'Os últimos lançamentos do mercado'
  },
  {
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop',
    title: 'Jóias Exclusivas',
    description: 'Peças únicas para momentos especiais'
  }
]

// Mouse glow effect
const handleMouseMove = (e: MouseEvent) => {
  if (mouseGlowForm.value) {
    const rect = mouseGlowForm.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseGlowForm.value.style.background = `radial-gradient(circle 400px at ${x}px ${y}px, rgba(212, 175, 55, 0.12), transparent 80%)`
  }
}

// Slideshow functions
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
  slideInterval = window.setInterval(nextSlide, 3000) // 1 segundo
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    const redirectTo = route.query.redirect as string || '/'
    router.push(redirectTo)
  }
  
  const savedEmail = localStorage.getItem('remembered_email')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
  
  // Start slideshow
  resetInterval()
  
  // Add mouse move listener for glow effect
  const formSide = document.querySelector('.form-side')
  if (formSide) {
    formSide.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  const formSide = document.querySelector('.form-side')
  if (formSide) {
    formSide.removeEventListener('mousemove', handleMouseMove)
  }
})

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      if (rememberMe.value) {
        localStorage.setItem('remembered_email', email.value)
      } else {
        localStorage.removeItem('remembered_email')
      }
      
      toast.success('Login realizado!', 'Bem-vindo de volta ao ShopHub.', 3000)
      
      const redirectTo = route.query.redirect as string || '/'
      router.push(redirectTo)
    } else {
      errorMessage.value = result.message || 'Email ou senha inválidos'
      toast.error('Erro no login', errorMessage.value, 3000)
    }
  } catch (error) {
    console.error('Erro no login:', error)
    errorMessage.value = 'Erro ao conectar com o servidor. Tente novamente.'
    toast.error('Erro', errorMessage.value, 3000)
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  toast.info(
    'Recuperar senha', 
    'Funcionalidade em desenvolvimento. Em breve você poderá recuperar sua senha.', 
    3000
  )
}

// Watch para limpar erro
import { watch } from 'vue'
watch([email, password], () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
})
</script>

<style scoped>
/* ========== LOGIN SPLIT PREMIUM ========== */
.login-split-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* ========== LADO ESQUERDO - SLIDESHOW ========== */
.slideshow-side {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--black-primary);
}

.slideshow-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-bg {
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

.slide-bg.active {
  opacity: 1;
  visibility: visible;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.slide-content-left {
  position: absolute;
  bottom: 15%;
  left: 10%;
  right: 10%;
  z-index: 2;
  animation: fadeInUp 0.6s ease;
}

.slide-text-animation {
  max-width: 80%;
}

.slide-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #fff 0%, var(--gold-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.slide-description {
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
.slide-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
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

.indicator.active {
  background: var(--gold-primary);
  width: 60px;
}

.indicator-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  animation: progressBar 1s linear forwards;
}

@keyframes progressBar {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.side-gradient {
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
.form-side {
  width: 480px;
  background: var(--black-primary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  scrollbar-width: none;
}

.form-side::-webkit-scrollbar {
  display: none;
}

.mouse-glow-form {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: background 0.05s ease;
  z-index: 1;
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  position: relative;
  z-index: 2;
}

.form-wrapper {
  width: 100%;
}

/* Logo Area */
.logo-area {
  text-align: center;
  margin-bottom: 32px;
}

.logo-ring {
  display: inline-block;
  animation: pulseRing 2s ease-in-out infinite;
  margin-bottom: 12px;
}

.logo-ring svg {
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

.brand-name {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F5F0E6 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.brand-name .gold {
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
  color: var(--gold-primary);
}

/* Welcome Area */
.welcome-area {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 1.6rem;
  color: var(--white-soft);
  margin-bottom: 8px;
  font-weight: 600;
}

.welcome-subtitle {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
}

/* Formulário */
.login-form-split {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group-split {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label-split {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(245, 240, 230, 0.8);
  font-size: 0.8rem;
  font-weight: 500;
}

.input-wrapper-split {
  position: relative;
}

.premium-input-split {
  width: 100%;
  padding: 12px 16px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  color: var(--white-soft);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.premium-input-split:focus {
  outline: none;
  border-color: var(--gold-primary);
  background: rgba(59, 58, 64, 0.5);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-focus-split {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.premium-input-split:focus ~ .input-focus-split {
  width: 80%;
}

.toggle-password-split {
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

.toggle-password-split:hover {
  color: var(--gold-primary);
}

/* Form Options */
.form-options-split {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-checkbox-split {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.custom-checkbox-split input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark-split {
  width: 16px;
  height: 16px;
  background: rgba(59, 58, 64, 0.5);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.custom-checkbox-split input:checked ~ .checkmark-split {
  background: var(--gold-primary);
  border-color: var(--gold-primary);
}

.custom-checkbox-split input:checked ~ .checkmark-split::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid var(--black-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text-split {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.8rem;
}

.forgot-link-split {
  color: var(--gold-primary);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.forgot-link-split:hover {
  color: #e6bc3e;
  text-decoration: underline;
}

/* Login Button */
.login-button-split {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border: none;
  border-radius: 40px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-button-split:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
}

.login-button-split:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content-split {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--black-primary);
  font-weight: 600;
  font-size: 0.9rem;
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
  padding: 10px 12px;
  color: #ff6b6b;
  font-size: 0.8rem;
}

/* Register Area */
.register-area {
  text-align: center;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.8rem;
}

.register-link-split {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--gold-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.register-link-split:hover {
  gap: 8px;
  color: #e6bc3e;
}

/* Test Credentials */
.test-credentials-split {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.credential-badge-split {
  text-align: center;
}

.credential-badge-split > span {
  display: inline-block;
  font-size: 0.65rem;
  color: rgba(245, 240, 230, 0.5);
  margin-bottom: 8px;
}

.credential-list-split {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.credential-list-split code {
  background: rgba(212, 175, 55, 0.1);
  padding: 3px 10px;
  border-radius: 20px;
  color: var(--gold-primary);
  font-size: 0.65rem;
  font-family: monospace;
}

/* Responsividade */
@media (max-width: 1024px) {
  .form-side {
    width: 420px;
  }
  
  .slide-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .login-split-premium {
    flex-direction: column;
  }
  
  .slideshow-side {
    height: 40vh;
    min-height: 300px;
  }
  
  .form-side {
    width: 100%;
    height: 60vh;
  }
  
  .form-container {
    padding: 24px 20px;
  }
  
  .slide-content-left {
    bottom: 20px;
    left: 20px;
    right: 20px;
  }
  
  .slide-title {
    font-size: 1.5rem;
  }
  
  .slide-description {
    font-size: 0.85rem;
  }
  
  .side-gradient {
    width: 100%;
    height: 50px;
    top: auto;
    bottom: 0;
    right: 0;
    background: linear-gradient(0deg, var(--black-primary), transparent);
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 20px 16px;
  }
  
  .brand-name {
    font-size: 1.5rem;
  }
  
  .welcome-title {
    font-size: 1.3rem;
  }
  
  .premium-input-split {
    padding: 10px 14px;
  }
  
  .credential-list-split {
    flex-direction: column;
    align-items: center;
  }
}
</style>