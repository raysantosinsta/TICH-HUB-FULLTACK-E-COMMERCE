<template>
  <div class="favorite-wrapper-premium">
    <button
      class="favorite-btn-premium"
      :class="{
        active: isFavorited,
        animated: isAnimating,
        'btn-disabled-premium': !isAuthenticated,
      }"
      @click="handleFavorite"
      :disabled="disabled || !isAuthenticated"
    >
      <div class="btn-glow-premium"></div>
      <svg
        class="heart-icon-premium"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
          fill="currentColor"
        />
      </svg>
      <span v-if="showText" class="favorite-text-premium">
        {{ isFavorited ? "Favoritado" : "Favoritar" }}
      </span>
    </button>

    <!-- Tooltip Premium para usuários não logados -->
    <div v-if="!isAuthenticated" class="tooltip-premium-favorite">
      <div class="tooltip-content-premium">
        <span class="tooltip-icon">🔒</span>
        <span class="tooltip-message">Faça login para favoritar</span>
      </div>
      <div class="tooltip-arrow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useFavoritesStore } from "../stores/favorites";
import { useAuthStore } from "../stores/auth";
import { useToast } from "../plugins/toast";
import type { Product } from "../types";

const props = defineProps<{
  product: Product;
  showText?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update", isFavorited: boolean): void;
}>();

const router = useRouter();
const favoritesStore = useFavoritesStore();
const authStore = useAuthStore();
const toast = useToast();
const isAnimating = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isFavorited = computed(() => favoritesStore.isFavorite(props.product.id));

const handleFavorite = async () => {
  if (props.disabled) return;

  // Verificar se usuário está logado
  if (!isAuthenticated.value) {
    toast.warning(
      "Login necessário",
      "Faça login para adicionar produtos aos favoritos.",
      4000,
    );
    // CORREÇÃO: Redirecionar para login com redirect para favoritos
    setTimeout(() => {
      router.push({
        path: "/login",
        query: { redirect: "/favorites" },
      });
    }, 1500);
    return;
  }

  isAnimating.value = true;

  const wasFavorited = isFavorited.value;
  const isNowFavorited = favoritesStore.toggleFavorite(props.product);

  if (isNowFavorited && !wasFavorited) {
    toast.success(
      "Adicionado aos favoritos!",
      `${props.product.title.substring(0, 50)}${props.product.title.length > 50 ? "..." : ""} foi salvo nos favoritos.`,
      2000,
    );
  } else if (!isNowFavorited && wasFavorited) {
    toast.info(
      "Removido dos favoritos",
      `${props.product.title.substring(0, 50)}${props.product.title.length > 50 ? "..." : ""} foi removido dos favoritos.`,
      2000,
    );
  }

  emit("update", isNowFavorited);

  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};
</script>

<style scoped>
/* ========== FAVORITE BUTTON PREMIUM ========== */
.favorite-wrapper-premium {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.favorite-btn-premium {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(59, 58, 64, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 50px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(245, 240, 230, 0.7);
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.btn-glow-premium {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 175, 55, 0.2),
    transparent
  );
  transition: left 0.5s ease;
  pointer-events: none;
}

.favorite-btn-premium:hover:not(:disabled) .btn-glow-premium {
  left: 100%;
}

.favorite-btn-premium:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
}

.favorite-btn-premium.active {
  background: rgba(255, 107, 107, 0.15);
  border-color: rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.2);
}

.favorite-btn-premium.active:hover:not(:disabled) {
  box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
  border-color: #ff6b6b;
}

.favorite-btn-premium.animated {
  animation: heartBeatPremium 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes heartBeatPremium {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.heart-icon-premium {
  width: 20px;
  height: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.favorite-btn-premium:hover:not(:disabled) .heart-icon-premium {
  transform: scale(1.1);
}

.favorite-btn-premium.active .heart-icon-premium {
  filter: drop-shadow(0 0 6px rgba(255, 107, 107, 0.5));
  animation: heartGlow 1.5s ease-in-out infinite;
}

@keyframes heartGlow {
  0%,
  100% {
    filter: drop-shadow(0 0 6px rgba(255, 107, 107, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255, 107, 107, 0.8));
  }
}

.favorite-text-premium {
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.favorite-btn-premium.active .favorite-text-premium {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
}

/* Estado Disabled */
.favorite-btn-premium.btn-disabled-premium {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(59, 58, 64, 0.2);
  border-color: rgba(212, 175, 55, 0.1);
}

.favorite-btn-premium.btn-disabled-premium:hover {
  transform: none;
  box-shadow: none;
}

.favorite-btn-premium.btn-disabled-premium .btn-glow-premium {
  display: none;
}

.favorite-btn-premium:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tooltip Premium */
.tooltip-premium-favorite {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 8px 16px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  min-width: 180px;
}

.favorite-wrapper-premium:hover .tooltip-premium-favorite {
  opacity: 1;
  visibility: visible;
  bottom: 140%;
}

.tooltip-content-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.tooltip-icon {
  font-size: 1rem;
  animation: tooltipIconPulse 1.5s ease-in-out infinite;
}

@keyframes tooltipIconPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.tooltip-message {
  color: var(--gold-primary);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.95);
}

/* Efeito de partículas ao favoritar */
.favorite-btn-premium.active::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 107, 107, 0.6) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  animation: particleBurst 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes particleBurst {
  0% {
    width: 0;
    height: 0;
    opacity: 0.8;
  }
  50% {
    width: 60px;
    height: 60px;
    opacity: 0.5;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

/* Versão apenas ícone (sem texto) */
.favorite-btn-premium:has(.heart-icon-premium):not(
    :has(.favorite-text-premium)
  ) {
  padding: 10px;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  justify-content: center;
}

.favorite-btn-premium:has(.heart-icon-premium):not(:has(.favorite-text-premium))
  .heart-icon-premium {
  width: 22px;
  height: 22px;
}

/* Responsividade Premium */
@media (max-width: 768px) {
  .favorite-btn-premium {
    padding: 8px 14px;
  }

  .heart-icon-premium {
    width: 18px;
    height: 18px;
  }

  .favorite-text-premium {
    font-size: 0.75rem;
  }

  .tooltip-premium-favorite {
    min-width: 150px;
    padding: 6px 12px;
  }

  .tooltip-message {
    font-size: 0.7rem;
    white-space: normal;
    text-align: center;
  }

  .tooltip-content-premium {
    gap: 6px;
  }

  .favorite-btn-premium:has(.heart-icon-premium):not(
      :has(.favorite-text-premium)
    ) {
    padding: 8px;
    width: 38px;
    height: 38px;
  }

  .favorite-btn-premium:has(.heart-icon-premium):not(
      :has(.favorite-text-premium)
    )
    .heart-icon-premium {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .favorite-btn-premium {
    padding: 6px 12px;
  }

  .heart-icon-premium {
    width: 16px;
    height: 16px;
  }

  .favorite-text-premium {
    font-size: 0.7rem;
  }

  .tooltip-message {
    font-size: 0.65rem;
  }

  .favorite-btn-premium:has(.heart-icon-premium):not(
      :has(.favorite-text-premium)
    ) {
    padding: 6px;
    width: 34px;
    height: 34px;
  }

  .favorite-btn-premium:has(.heart-icon-premium):not(
      :has(.favorite-text-premium)
    )
    .heart-icon-premium {
    width: 16px;
    height: 16px;
  }
}

/* Efeito de foco para acessibilidade */
.favorite-btn-premium:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.5);
  border-color: var(--gold-primary);
}
</style>
