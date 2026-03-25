<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import ToastPlugin from './plugins/toast'

const toastRef = ref()

// Expor instância do toast globalmente
onMounted(() => {
  if (toastRef.value) {
    ToastPlugin.setInstance(toastRef.value)
  }
})
</script>

<style>
.main-content {
  flex: 1;
}
</style>