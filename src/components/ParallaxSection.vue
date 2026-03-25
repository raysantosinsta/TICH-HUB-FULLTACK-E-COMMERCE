<template>
  <div class="parallax-wrapper">
    <!-- Seção 1 -->
    <div class="parallax-container">
      <div class="parallax-bg" :style="{ backgroundImage: `url(${bgImage1})` }">
        <div class="overlay"></div>
        <div class="content">
          <div class="text-content">
            <span class="badge">🔥 Oferta Especial</span>
            <h2>Coleção Exclusiva</h2>
            <p>Produtos selecionados com até 50% OFF. Não perca essa oportunidade!</p>
            <router-link to="/products" class="btn">
              Comprar Agora
              <span>→</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção 2 -->
    <div class="parallax-container">
      <div class="parallax-bg" :style="{ backgroundImage: `url(${bgImage2})` }">
        <div class="overlay"></div>
        <div class="content right">
          <div class="text-content">
            <span class="badge">📱 Novidades</span>
            <h2>Tecnologia de Ponta</h2>
            <p>Os melhores eletrônicos com garantia e qualidade premium.</p>
            <router-link to="/products?category=electronics" class="btn">
              Ver Produtos
              <span>→</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção 3 -->
    <div class="parallax-container">
      <div class="parallax-bg" :style="{ backgroundImage: `url(${bgImage3})` }">
        <div class="overlay"></div>
        <div class="content">
          <div class="text-content">
            <span class="badge">👗 Moda & Estilo</span>
            <h2>Vista-se com Estilo</h2>
            <p>As melhores tendências da moda masculina e feminina.</p>
            <router-link to="/products" class="btn">
              Explorar Coleção
              <span>→</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imagens de fundo (imagens gratuitas de alta qualidade)
const bgImage1 = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop'
const bgImage2 = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=800&fit=crop'
const bgImage3 = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=800&fit=crop'
</script>

<style scoped>
.parallax-wrapper {
  margin: 60px 0;
}

.parallax-container {
  position: relative;
  height: 500px;
  overflow: hidden;
  margin-bottom: 30px;
  border-radius: 20px;
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  transition: transform 0.3s ease;
}

/* Efeito parallax - o background fica fixo enquanto o conteúdo rola */
@media (min-width: 768px) {
  .parallax-bg {
    background-attachment: fixed;
  }
}

/* Overlay escuro para melhor contraste do texto */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%);
  z-index: 1;
}

/* Conteúdo */
.content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10%;
}

.content.right {
  justify-content: flex-end;
  text-align: right;
}

.text-content {
  max-width: 500px;
  animation: fadeInUp 0.6s ease;
}

.badge {
  display: inline-block;
  background: rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #D4AF37;
  margin-bottom: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.text-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #F5F0E6;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.text-content p {
  font-size: 1rem;
  color: rgba(245, 240, 230, 0.9);
  margin-bottom: 30px;
  line-height: 1.6;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #D4AF37 0%, #b58f2a 100%);
  color: #0B0B0F;
  padding: 12px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn span {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
}

.btn:hover span {
  transform: translateX(5px);
}

/* Animações */
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

/* Responsividade */
@media (max-width: 1024px) {
  .parallax-container {
    height: 450px;
  }
  
  .text-content h2 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .parallax-wrapper {
    margin: 40px 0;
  }
  
  .parallax-container {
    height: auto;
    min-height: 400px;
    margin-bottom: 20px;
  }
  
  .content {
    justify-content: center !important;
    text-align: center;
    padding: 40px 20px;
  }
  
  .text-content {
    text-align: center;
  }
  
  .text-content h2 {
    font-size: 1.8rem;
  }
  
  .text-content p {
    font-size: 0.9rem;
  }
  
  /* Desativar parallax no mobile para melhor performance */
  .parallax-bg {
    background-attachment: scroll !important;
  }
}

@media (max-width: 480px) {
  .parallax-container {
    min-height: 350px;
  }
  
  .text-content h2 {
    font-size: 1.5rem;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 4px 12px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
}
</style>