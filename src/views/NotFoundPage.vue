<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Página não encontrada</h1>
        <p class="error-message">
          Oops! A página que você está procurando não existe ou foi movida.
        </p>
        <div class="error-actions">
          <router-link to="/" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M9 21V12H15V21" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Voltar para Home
          </router-link>
          <button @click="goBack" class="btn btn-outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Voltar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--black-primary) 0%, #1a1a1f 100%);
}

.container {
  text-align: center;
  padding: 40px;
}

.not-found-content {
  animation: fadeInUp 0.5s ease;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.error-title {
  font-size: 2rem;
  color: var(--white-soft);
  margin-bottom: 16px;
}

.error-message {
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 32px;
  font-size: 1.1rem;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--gold-primary);
  color: var(--gold-primary);
}

.btn-outline:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
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

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>