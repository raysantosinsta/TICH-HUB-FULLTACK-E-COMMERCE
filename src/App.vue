<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <Toast ref="toastRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import ToastPlugin from './plugins/toast'
import ConfirmPlugin from './plugins/confirm'

const toastRef = ref()
const confirmDialogRef = ref()

// Expor instância do toast globalmente
onMounted(() => {
  if (toastRef.value) {
    ToastPlugin.setInstance(toastRef.value)
  }
  
  // Inicializar o confirm dialog
  if (confirmDialogRef.value) {
    ConfirmPlugin.setInstance(confirmDialogRef.value)
  }
})
</script>

<style>
.main-content {
  flex: 1;
}
</style>