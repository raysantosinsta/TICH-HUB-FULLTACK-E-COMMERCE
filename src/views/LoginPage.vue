<template>
  <div class="login-page">
    <!-- Background Premium -->
    <div class="bg-premium">
      <div class="light-sweep"></div>
      <div class="glass-overlay"></div>
    </div>

    <div class="container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 class="login-title">Bem-vindo de volta</h1>
          <p class="login-subtitle">Faça login para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">E-mail</label>
            <div class="input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Digite seu e-mail"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <div class="input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M18 8H6C4.89543 8 4 8.89543 4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 8V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Digite sua senha"
                required
                autocomplete="current-password"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M2 2L22 22M6.71 6.71C4.44 8.14 2.77 10.32 2 12C2 12 6 20 12 20C13.94 20 15.56 19.13 16.85 17.85M12 16C9.79 16 8 14.21 8 12C8 11.96 8 11.92 8 11.88" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M15.3 9.7C15.74 10.26 16 10.98 16 12C16 14.21 14.21 16 12 16" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe">
              <span>Lembrar-me</span>
            </label>
            <a href="#" class="forgot-password">Esqueceu a senha?</a>
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading" class="spinner-small"></span>
            <span v-else>Entrar</span>
          </button>

          <div v-if="errorMessage" class="error-message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            {{ errorMessage }}
          </div>
        </form>

        <div class="login-footer">
          <p>Credenciais de teste:</p>
          <code>user@test.com / 123456</code>
        </div>

        <div class="register-link">
          <p>Não tem uma conta? <router-link to="/register">Criar conta</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../plugins/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  const result = await authStore.login(email.value, password.value)
  
  loading.value = false
  
  if (result.success) {
    toast.success('Login realizado!', 'Bem-vindo de volta ao ShopHub.', 3000)
    router.push('/')
  } else {
    errorMessage.value = result.message || 'Email ou senha inválidos'
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

/* Background Premium */
.bg-premium {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
}

.light-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.1) 40%,
    rgba(212, 175, 55, 0.15) 45%,
    rgba(212, 175, 55, 0.2) 50%,
    rgba(212, 175, 55, 0.15) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweep 15s ease-in-out infinite;
}

@keyframes lightSweep {
  0% { background-position: -100% 0%; opacity: 0; }
  20% { opacity: 0.5; }
  40% { opacity: 1; }
  60% { opacity: 0.5; }
  100% { background-position: 200% 0%; opacity: 0; }
}

.glass-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(2px);
}

.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.login-card {
  background: rgba(11, 11, 15, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: fadeInUp 0.5s ease;
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

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  color: var(--gold-primary);
  margin-bottom: 16px;
}

.login-title {
  font-size: 1.8rem;
  color: var(--white-soft);
  margin-bottom: 8px;
}

.login-subtitle {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: var(--white-soft);
  font-size: 0.85rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper svg {
  position: absolute;
  left: 14px;
  color: rgba(245, 240, 230, 0.4);
}

.input-wrapper input {
  width: 100%;
  padding: 12px 40px;
  background: rgba(59, 58, 64, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  color: var(--white-soft);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--gold-primary);
  background: rgba(59, 58, 64, 0.5);
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(245, 240, 230, 0.4);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--gold-primary);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(245, 240, 230, 0.7);
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--gold-primary);
}

.forgot-password {
  color: var(--gold-primary);
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #e6bc3e;
}

.login-btn {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--black-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 12px;
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 8px;
}

.login-footer {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  text-align: center;
}

.login-footer p {
  color: rgba(245, 240, 230, 0.5);
  font-size: 0.75rem;
  margin-bottom: 8px;
}

.login-footer code {
  background: rgba(212, 175, 55, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  color: var(--gold-primary);
  font-size: 0.8rem;
}

.register-link {
  margin-top: 24px;
  text-align: center;
}

.register-link p {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
}

.register-link a {
  color: var(--gold-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #e6bc3e;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 24px;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>