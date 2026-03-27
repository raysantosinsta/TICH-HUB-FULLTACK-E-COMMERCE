<template>
  <div class="home-page">
    <!-- Hero Banner com Slideshow de Produtos -->
     <HeroBanner />
    
    <div class="container">
      <!-- Banner Flash Deal (Ofertas Relâmpago) -->
      <BannerFlash />  
      
      <!-- Banner Grid (Promoções) -->
      <BannerGrid />
    
      
    </div>
    
    <!-- Seções Parallax -->
    <ParallaxSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import HeroBanner from '../components/HeroBanner.vue'
import ProductList from '../components/ProductList.vue'
import BannerFlash from '../components/BannerFlash.vue'
import BannerGrid from '../components/BannerGrid.vue'
import ParallaxSection from '../components/ParallaxSection.vue'

const store = useProductsStore()

onMounted(() => {
  store.fetchProducts()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>