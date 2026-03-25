<template>
  <div class="home-page">
    <HeroBanner />
    <ProductList />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '../components/HeroBanner.vue'
import ProductList from '../components/ProductList.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>