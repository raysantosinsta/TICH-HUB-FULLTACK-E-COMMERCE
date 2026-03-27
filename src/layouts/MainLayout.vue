<template>
  <div class="main-layout">
    <Navbar />
    <main class="main-content">
      <!-- Adicionar :key="$route.fullPath" para forçar re-renderização -->
      <router-view :key="$route.fullPath" />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>