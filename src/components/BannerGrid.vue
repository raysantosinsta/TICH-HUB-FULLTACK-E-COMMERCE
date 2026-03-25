<template>
  <div class="banner-grid" v-if="promoBanners.length > 0">
    <div class="grid-container">
      <div 
        v-for="banner in promoBanners" 
        :key="banner.id"
        class="grid-item"
        :style="{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${banner.image})` }"
      >
        <div class="item-content">
          <h3>{{ banner.title }}</h3>
          <p>{{ banner.subtitle }}</p>
          <router-link :to="banner.buttonLink" class="item-button">
            {{ banner.buttonText }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBannersStore } from '../stores/banners'

const bannersStore = useBannersStore()
const promoBanners = computed(() => bannersStore.promoBanners)
</script>

<style scoped>
.banner-grid {
  margin: 50px 0;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.grid-item {
  position: relative;
  height: 250px;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.item-content {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  color: white;
  animation: fadeInUp 0.5s ease;
}

.item-content h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.item-content p {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 16px;
}

.item-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold-primary);
  color: var(--black-primary);
  padding: 8px 20px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.item-button:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .item-content {
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
  
  .item-content h3 {
    font-size: 1.2rem;
  }
}
</style>