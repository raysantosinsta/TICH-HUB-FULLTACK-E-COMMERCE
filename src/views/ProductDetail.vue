<template>
  <div class="product-detail-premium">
    <!-- Background Premium com Efeitos Avançados -->
    <div class="bg-premium-advanced">
      <div class="bg-gradient-dynamic"></div>
      <div class="light-sweep-dynamic"></div>
      <div class="glass-overlay-advanced"></div>
      <div class="gold-particles">
        <div
          v-for="i in 40"
          :key="i"
          class="gold-particle"
          :style="getParticleStyle(i)"
        ></div>
      </div>
      <div class="ambient-glow"></div>
    </div>

    <div class="container-premium">
      <!-- Breadcrumb Premium -->
      <nav class="breadcrumb-premium">
        <router-link to="/" class="breadcrumb-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9L12 3L21 9L12 15L3 9Z"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
          Home
        </router-link>
        <span class="separator-premium">›</span>
        <router-link to="/products" class="breadcrumb-link"
          >Produtos</router-link
        >
        <span class="separator-premium">›</span>
        <span class="current-premium">{{
          truncateTitle(product?.title || "", 40)
        }}</span>
      </nav>

      <!-- Loading State Premium -->
      <div v-if="loading" class="loading-skeleton-premium">
        <div class="skeleton-image-premium shimmer"></div>
        <div class="skeleton-info-premium">
          <div class="skeleton-line shimmer"></div>
          <div class="skeleton-line shimmer"></div>
          <div class="skeleton-line short shimmer"></div>
          <div class="skeleton-line shimmer"></div>
          <div class="skeleton-line short shimmer"></div>
        </div>
      </div>

      <!-- Product Content -->
      <div v-else-if="product" class="product-content-premium">
        <!-- Seção Principal - Imagem e Info com Glassmorphism -->
        <div class="product-main-premium">
          <!-- Imagem do Produto com Galeria -->
          <div class="product-image-section-premium">
            <!-- Imagem Principal -->
            <div class="main-image-container-premium">
              <div class="image-wrapper-premium">
                <img
                  :src="currentImage"
                  :alt="product.title"
                  class="main-image-premium"
                  @error="handleImageError"
                />
                <div class="image-glow-premium"></div>
                <div class="image-shine-premium"></div>
              </div>
              <div class="image-reflection-premium"></div>
              <div class="image-badge" v-if="isNewProduct">
                <span>✨ Novo</span>
              </div>
            </div>

            <!-- Miniaturas das Imagens -->
            <div v-if="product.images && product.images.length > 1" class="thumbnail-gallery-premium">
              <div
                v-for="(img, index) in product.images"
                :key="index"
                class="thumbnail-premium"
                :class="{ active: currentImageIndex === index }"
                @click="selectImage(index)"
              >
                <img :src="img" :alt="`${product.title} - imagem ${index + 1}`" @error="handleThumbError" />
              </div>
            </div>
          </div>

          <!-- Informações do Produto -->
          <div class="product-info-section-premium">
            <div class="category-badge-premium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z"
                  fill="currentColor"
                />
              </svg>
              {{ getCategoryName() }}
            </div>
            <h1 class="product-title-premium">{{ product.title }}</h1>

            <!-- Preço Premium -->
            <div class="price-section-premium">
              <div class="price-premium">
                {{ formatPrice(product.price) }}
              </div>
              <div class="installment-premium" v-if="product.price && product.price > 0">
                ou 12x de {{ formatPrice(product.price / 12) }} sem juros
              </div>
              <div class="stock-info-premium">
                <span class="stock-badge-premium">
                  <span class="pulse-dot"></span>
                  Em estoque
                </span>
                <span class="delivery-estimate">🚚 Entrega em até 5 dias</span>
              </div>
            </div>

            <!-- Descrição Curta -->
            <p class="short-description-premium" v-if="product.description">
              {{ truncateDescription(product.description, 180) }}
            </p>

            <!-- Botões de Ação Premium -->
            <div class="action-buttons-premium">
              <div class="tooltip-premium">
                <button
                  class="btn-cart-premium"
                  @click="addToCart"
                  :disabled="addingToCart || !isAuthenticated"
                  :class="{ 'btn-disabled': !isAuthenticated }"
                >
                  <svg
                    v-if="!addingToCart"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M17 16.5C17 17.9 15.9 19 14.5 19C13.1 19 12 17.9 12 16.5C12 15.1 13.1 14 14.5 14C15.9 14 17 15.1 17 16.5ZM9 16.5C9 17.9 7.9 19 6.5 19C5.1 19 4 17.9 4 16.5C4 15.1 5.1 14 6.5 14C7.9 14 9 15.1 9 16.5Z"
                      stroke="currentColor"
                      fill="none"
                      stroke-width="1.5"
                    />
                  </svg>
                  <span v-else class="spinner-premium"></span>
                  {{
                    addingToCart ? "Adicionando..." : "Adicionar ao Carrinho"
                  }}
                </button>
                <span v-if="!isAuthenticated" class="tooltip-premium-text">
                  🔒 Faça login para adicionar
                </span>
              </div>

              <div class="tooltip-premium">
                <button
                  class="btn-buy-premium"
                  @click="buyNow"
                  :disabled="buyingNow || !isAuthenticated"
                  :class="{ 'btn-disabled': !isAuthenticated }"
                >
                  <span v-if="!buyingNow">Comprar Agora</span>
                  <span v-else class="spinner-premium"></span>
                  <svg
                    v-if="!buyingNow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
                <span v-if="!isAuthenticated" class="tooltip-premium-text">
                  🔒 Faça login para comprar
                </span>
              </div>
            </div>

            <!-- Benefícios Premium -->
            <div class="benefits-premium">
              <div class="benefit-item-premium">
                <div class="benefit-icon">✨</div>
                <div class="benefit-content">
                  <strong>Frete Grátis</strong>
                  <span>Para todo Brasil</span>
                </div>
              </div>
              <div class="benefit-item-premium">
                <div class="benefit-icon">🛡️</div>
                <div class="benefit-content">
                  <strong>Garantia de 30 dias</strong>
                  <span>Troca ou reembolso</span>
                </div>
              </div>
              <div class="benefit-item-premium">
                <div class="benefit-icon">⚡</div>
                <div class="benefit-content">
                  <strong>Entrega Rápida</strong>
                  <span>Em até 5 dias úteis</span>
                </div>
              </div>
            </div>

            <!-- Mensagens com transição -->
            <transition name="fade-premium">
              <div v-if="!isAuthenticated" key="guest" class="guest-message-premium-card">
                <div class="guest-message-premium-icon">🔒</div>
                <div class="guest-message-premium-content">
                  <h4>Acesso Exclusivo para Membros</h4>
                  <p>Faça login para adicionar produtos ao carrinho e aproveitar benefícios exclusivos.</p>
                  <button class="login-action-premium" @click="goToLogin">
                    Fazer login agora
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </transition>

            <transition name="fade-premium">
              <div v-if="isAuthenticated" key="welcome" class="welcome-message-premium">
                <div class="welcome-avatar">{{ userInitials }}</div>
                <div class="welcome-content">
                  <span>Olá, <strong>{{ user?.name?.split(' ')[0] || 'Usuário' }}</strong>!</span>
                  <span>Este produto está pronto para ser seu</span>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Descrição Completa com Tabs Premium -->
        <div class="product-details-premium">
          <div class="tabs-premium">
            <button
              class="tab-premium"
              :class="{ active: activeTab === 'description' }"
              @click="activeTab = 'description'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M8 12H16M8 8H16M8 16H12"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              Descrição
            </button>
            <button
              class="tab-premium"
              :class="{ active: activeTab === 'specs' }"
              @click="activeTab = 'specs'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z"
                  fill="currentColor"
                />
              </svg>
              Especificações
            </button>
            <button
              class="tab-premium"
              :class="{ active: activeTab === 'shipping' }"
              @click="activeTab = 'shipping'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6v6l4 2"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
              Entrega e Garantia
            </button>
          </div>

          <div class="tab-content-premium">
            <!-- Descrição -->
            <transition name="tab-premium">
              <div
                v-show="activeTab === 'description'"
                class="description-premium"
              >
                <h3>📝 Sobre este produto</h3>
                <p>{{ product.description || 'Descrição não disponível' }}</p>

                <h3>✨ Características exclusivas</h3>
                <ul class="features-premium">
                  <li>
                    <span class="feature-check">✓</span>
                    <span>Produto 100% original com garantia de fábrica</span>
                  </li>
                  <li>
                    <span class="feature-check">✓</span>
                    <span
                      >Materiais de alta qualidade e acabamento premium</span
                    >
                  </li>
                  <li>
                    <span class="feature-check">✓</span>
                    <span>Design exclusivo desenvolvido por especialistas</span>
                  </li>
                  <li>
                    <span class="feature-check">✓</span>
                    <span>Embalagem personalizada e proteção reforçada</span>
                  </li>
                  <li>
                    <span class="feature-check">✓</span>
                    <span>Satisfação garantida ou seu dinheiro de volta</span>
                  </li>
                </ul>
              </div>
            </transition>

            <!-- Especificações -->
            <transition name="tab-premium">
              <div v-show="activeTab === 'specs'" class="specs-premium">
                <div class="specs-grid-premium">
                  <div class="spec-card-premium">
                    <span class="spec-label-premium">Categoria</span>
                    <span class="spec-value-premium">{{
                      getCategoryName()
                    }}</span>
                  </div>
                  <div class="spec-card-premium">
                    <span class="spec-label-premium">SKU</span>
                    <span class="spec-value-premium">{{
                      getSku()
                    }}</span>
                  </div>
                  <div class="spec-card-premium">
                    <span class="spec-label-premium">Data de Cadastro</span>
                    <span class="spec-value-premium">{{
                      formatDate(product.creationAt)
                    }}</span>
                  </div>
                  <div class="spec-card-premium">
                    <span class="spec-label-premium">Última Atualização</span>
                    <span class="spec-value-premium">{{
                      formatDate(product.updatedAt)
                    }}</span>
                  </div>
                  <div class="spec-card-premium">
                    <span class="spec-label-premium">Peso</span>
                    <span class="spec-value-premium"
                      >{{ (Math.random() * 2 + 0.5).toFixed(1) }} kg</span
                    >
                  </div>
                  <div class="spec-card-premium">
                    <span class="spec-label-premium">Dimensões</span>
                    <span class="spec-value-premium"
                      >{{ Math.floor(Math.random() * 30 + 10) }}x{{
                        Math.floor(Math.random() * 20 + 10)
                      }}x{{ Math.floor(Math.random() * 10 + 5) }} cm</span
                    >
                  </div>
                </div>
              </div>
            </transition>

            <!-- Entrega e Garantia -->
            <transition name="tab-premium">
              <div v-show="activeTab === 'shipping'" class="shipping-premium">
                <div class="shipping-card">
                  <div class="shipping-icon">📦</div>
                  <div class="shipping-content">
                    <h4>Política de Entrega</h4>
                    <p>
                      Entregamos para todo Brasil. Prazo estimado de
                      <strong>3 a 7 dias úteis</strong> para capitais e regiões
                      metropolitanas, e <strong>7 a 15 dias úteis</strong> para
                      demais localidades.
                    </p>
                    <p class="shipping-highlight">
                      ✨ Frete grátis para todo o território nacional!
                    </p>
                  </div>
                </div>

                <div class="shipping-card">
                  <div class="shipping-icon">🛡️</div>
                  <div class="shipping-content">
                    <h4>Garantia Premium</h4>
                    <p>
                      <strong>30 dias de garantia</strong> contra defeitos de
                      fabricação. Em caso de qualquer problema, oferecemos troca
                      ou reembolso integral sem burocracia.
                    </p>
                  </div>
                </div>

                <div class="shipping-card">
                  <div class="shipping-icon">🔄</div>
                  <div class="shipping-content">
                    <h4>Troca e Devolução</h4>
                    <p>
                      Você tem até
                      <strong>7 dias após o recebimento</strong> para desistir
                      da compra. Para trocas por arrependimento, o produto deve
                      estar em perfeitas condições, na embalagem original.
                    </p>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Produtos Relacionados Premium -->
        <div class="related-premium" v-if="relatedProducts.length > 0">
          <div class="section-header-premium">
            <h2 class="section-title-premium">Você também pode gostar</h2>
            <div class="title-glow"></div>
          </div>
          <div class="products-grid-premium">
            <div
              v-for="related in relatedProducts"
              :key="related.id"
              class="product-card-premium"
              @click="goToProduct(related.id)"
            >
              <div class="card-image-premium">
                <img :src="getProductImage(related)" :alt="related.title" @error="handleRelatedImageError" />
                <div class="card-overlay">
                  <span>Ver detalhes</span>
                </div>
              </div>
              <div class="card-info-premium">
                <h3 class="card-title-premium">
                  {{ truncateTitle(related.title, 50) }}
                </h3>
                <div class="card-price-premium">
                  {{ formatPrice(related.price) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State Premium -->
      <div v-else class="error-premium">
        <div class="error-content-premium">
          <div class="error-icon">🔍</div>
          <h2>Produto não encontrado</h2>
          <p>
            O produto que você está procurando não existe ou foi removido do
            catálogo.
          </p>
          <router-link to="/" class="back-home-premium">
            Voltar para home
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductsStore } from "../stores/products";
import { useCartStore } from "../stores/cart";
import { useAuthStore } from "../stores/auth";
import { useToast } from "../plugins/toast";

const route = useRoute();
const router = useRouter();
const store = useProductsStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

const product = ref<any>(null);
const loading = ref(true);
const activeTab = ref("description");
const addingToCart = ref(false);
const buyingNow = ref(false);
const currentImageIndex = ref(0);

// Função para obter SKU
const getSku = () => {
  if (!product.value || product.value.id === undefined || product.value.id === null) {
    return "PROD-000000";
  }
  return `PROD-${String(product.value.id).padStart(6, "0")}`;
};

// Função para obter imagem do produto
const getProductImage = (prod: any) => {
  if (!prod) return "/placeholder-image.jpg";
  
  if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
    return prod.images[0];
  }
  
  if (prod.image && typeof prod.image === 'string' && prod.image.startsWith('http')) {
    return prod.image;
  }
  
  return "/placeholder-image.jpg";
};

// Computed para imagem atual
const currentImage = computed(() => {
  return getProductImage(product.value);
});

// Tratamento de erro de imagem
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/placeholder-image.jpg";
};

const handleThumbError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/placeholder-image.jpg";
};

const handleRelatedImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/placeholder-image.jpg";
};

// Função segura para obter nome da categoria
const getCategoryName = () => {
  if (!product.value) return "Categoria";
  
  try {
    if (product.value.category && typeof product.value.category === 'object') {
      if (product.value.category.name) {
        return formatCategory(product.value.category.name);
      }
    }
    
    if (typeof product.value.category === 'string') {
      return formatCategory(product.value.category);
    }
  } catch (e) {
    console.error("Erro ao obter categoria:", e);
  }
  
  return "Produto";
};

// Verificar se produto é novo
const isNewProduct = computed(() => {
  if (!product.value?.creationAt) return false;
  try {
    const createdDate = new Date(product.value.creationAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  } catch (e) {
    return false;
  }
});

// Produtos relacionados
const relatedProducts = computed(() => {
  if (!product.value) return [];
  
  try {
    const currentCategoryId = product.value.category?.id;
    const currentCategoryName = typeof product.value.category === 'string' 
      ? product.value.category 
      : product.value.category?.name;
    
    return store.products
      .filter((p: any) => {
        if (p.id === product.value?.id) return false;
        
        if (currentCategoryId && p.category?.id === currentCategoryId) return true;
        
        const pCategoryName = typeof p.category === 'string' ? p.category : p.category?.name;
        if (currentCategoryName && pCategoryName === currentCategoryName) return true;
        
        return false;
      })
      .slice(0, 4);
  } catch (e) {
    console.error("Erro ao buscar produtos relacionados:", e);
    return [];
  }
});

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value || !user.value.name) return "U";
  try {
    return user.value.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  } catch (e) {
    return "U";
  }
});

const formatPrice = (price: any) => {
  if (price === undefined || price === null) {
    return "R$ 0,00";
  }
  
  const numPrice = typeof price === 'number' ? price : Number(price);
  
  if (isNaN(numPrice)) {
    return "R$ 0,00";
  }
  
  return numPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatCategory = (categoryName: string) => {
  if (!categoryName) return "Produto";
  
  const categories: Record<string, string> = {
    "men's clothing": "Moda Masculina",
    "women's clothing": "Moda Feminina",
    jewelery: "Jóias Exclusivas",
    electronics: "Eletrônicos",
    furniture: "Móveis",
    shoes: "Calçados",
    miscellaneous: "Diversos",
    clothes: "Roupas"
  };
  return categories[categoryName.toLowerCase()] || categoryName;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Não disponível";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  } catch (e) {
    return "Data inválida";
  }
};

const truncateTitle = (title: string, length: number = 60) => {
  if (!title) return "";
  if (title.length > length) {
    return title.substring(0, length - 3) + "...";
  }
  return title;
};

const truncateDescription = (description: string, length: number = 200) => {
  if (!description) return "";
  if (description.length > length) {
    return description.substring(0, length - 3) + "...";
  }
  return description;
};

const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${8 + Math.random() * 12}s`,
    width: `${2 + Math.random() * 3}px`,
    height: `${2 + Math.random() * 3}px`,
  };
};

const selectImage = (index: number) => {
  currentImageIndex.value = index;
};

const addToCart = async () => {
  if (!isAuthenticated.value) {
    if (toast?.warning) {
      toast.warning(
        "Login necessário",
        "Faça login para adicionar produtos ao carrinho.",
        4000,
      );
    }
    setTimeout(() => router.push("/login"), 1500);
    return;
  }

  if (!product.value) return;

  addingToCart.value = true;

  try {
    const cartProduct = {
      id: product.value.id,
      title: product.value.title || "Produto",
      price: product.value.price || 0,
      image: getProductImage(product.value),
      description: product.value.description || "",
      category: getCategoryName(),
    };
    cartStore.addToCart(cartProduct, 1);
    if (toast?.success) {
      toast.success(
        "Produto adicionado!",
        `${(product.value.title || "Produto").substring(0, 50)}... foi adicionado ao carrinho.`,
        3000,
      );
    }
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    if (toast?.error) {
      toast.error(
        "Erro",
        "Não foi possível adicionar o produto ao carrinho.",
        3000,
      );
    }
  } finally {
    setTimeout(() => {
      addingToCart.value = false;
    }, 500);
  }
};

const buyNow = async () => {
  if (!isAuthenticated.value) {
    if (toast?.warning) {
      toast.warning(
        "Login necessário",
        "Faça login para finalizar a compra.",
        4000,
      );
    }
    setTimeout(() => router.push("/login"), 1500);
    return;
  }

  if (!product.value) return;

  buyingNow.value = true;

  try {
    const cartProduct = {
      id: product.value.id,
      title: product.value.title || "Produto",
      price: product.value.price || 0,
      image: getProductImage(product.value),
      description: product.value.description || "",
      category: getCategoryName(),
    };
    cartStore.addToCart(cartProduct, 1);
    if (toast?.success) {
      toast.success(
        "Compra iniciada!",
        "Redirecionando para o carrinho...",
        2000,
      );
    }
    setTimeout(() => {
      router.push("/cart");
      buyingNow.value = false;
    }, 1500);
  } catch (error) {
    console.error("Erro ao comprar:", error);
    if (toast?.error) {
      toast.error("Erro", "Não foi possível iniciar a compra.", 3000);
    }
    buyingNow.value = false;
  }
};

const goToLogin = () => router.push("/login");
const goToProduct = (id: number) => {
  router.push(`/product/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(async () => {
  try {
    const id = Number(route.params.id);
    
    if (store.products.length === 0) {
      await store.fetchProducts();
    }
    
    let foundProduct = store.products.find((p: any) => p.id === id);
    
    if (!foundProduct) {
      try {
        const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          foundProduct = data;
        }
      } catch (err) {
        console.error("Erro ao buscar produto da API:", err);
      }
    }
    
    if (foundProduct) {
      product.value = {
        id: foundProduct.id,
        title: foundProduct.title || "Produto",
        price: foundProduct.price !== undefined ? foundProduct.price : 0,
        description: foundProduct.description || "",
        category: foundProduct.category || "",
        image: foundProduct.image || foundProduct.images?.[0] || "",
        images: foundProduct.images || [],
        creationAt: foundProduct.creationAt,
        updatedAt: foundProduct.updatedAt,
      };
      
      console.log("Produto carregado:", product.value);
    } else {
      product.value = null;
    }
    
    loading.value = false;

    if (!product.value && toast?.error) {
      toast.error(
        "Produto não encontrado",
        "O produto que você procura não existe.",
        4000,
      );
    }
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    loading.value = false;
    product.value = null;
    if (toast?.error) {
      toast.error(
        "Erro",
        "Não foi possível carregar o produto.",
        4000,
      );
    }
  }
});
</script>



<style scoped>
/* Mantenha todos os estilos existentes */
/* ========== PRODUCT DETAIL PREMIUM ========== */
.product-detail-premium {
  position: relative;
  min-height: 100vh;
  padding: 40px 0 80px;
  overflow-x: hidden;
}

/* Background Premium Avançado */
.bg-premium-advanced {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: var(--black-primary);
  overflow: hidden;
}

.bg-gradient-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      circle at 20% 30%,
      rgba(212, 175, 55, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(212, 175, 55, 0.05) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, #0b0b0f 0%, #13131a 100%);
  animation: gradientPulse 8s ease-in-out infinite;
}

@keyframes gradientPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.light-sweep-dynamic {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 35%,
    rgba(212, 175, 55, 0.12) 40%,
    rgba(212, 175, 55, 0.18) 45%,
    rgba(212, 175, 55, 0.22) 50%,
    rgba(212, 175, 55, 0.18) 55%,
    rgba(212, 175, 55, 0.1) 60%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: lightSweepPremium 12s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes lightSweepPremium {
  0% {
    background-position: -100% 0%;
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 0.6;
  }
  100% {
    background-position: 200% 0%;
    opacity: 0;
  }
}

.glass-overlay-advanced {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.55);
  backdrop-filter: blur(2px);
}

.gold-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.gold-particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.4) 0%,
    rgba(212, 175, 55, 0) 80%
  );
  border-radius: 50%;
  animation: floatParticleGold linear infinite;
}

@keyframes floatParticleGold {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.4;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.ambient-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(212, 175, 55, 0.03) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.container-premium {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}

/* Breadcrumb Premium */
.breadcrumb-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 48px;
  padding: 12px 20px;
  background: rgba(11, 11, 15, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(212, 175, 55, 0.15);
  width: fit-content;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(245, 240, 230, 0.7);
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--gold-primary);
  transform: translateX(2px);
}

.separator-premium {
  color: rgba(245, 240, 230, 0.4);
  font-size: 0.9rem;
}

.current-premium {
  color: var(--gold-primary);
  font-size: 0.85rem;
  font-weight: 500;
}

/* Loading Skeleton */
.loading-skeleton-premium {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.skeleton-image-premium {
  height: 500px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 30px;
}

.skeleton-info-premium {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-line {
  height: 30px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 12px;
}

.skeleton-line.short {
  width: 60%;
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(59, 58, 64, 0.3) 25%,
    rgba(212, 175, 55, 0.1) 50%,
    rgba(59, 58, 64, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Product Main */
.product-main-premium {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
  animation: fadeInUpPremium 0.8s ease;
}

@keyframes fadeInUpPremium {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Product Image Premium */
.product-image-section-premium {
  position: sticky;
  top: 100px;
}

.main-image-container-premium {
  position: relative;
  background: rgba(59, 58, 64, 0.2);
  border-radius: 32px;
  padding: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
}

.main-image-container-premium:hover {
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.image-wrapper-premium {
  position: relative;
  perspective: 1000px;
}

.main-image-premium {
  width: 100%;
  height: auto;
  max-height: 450px;
  object-fit: contain;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}

.image-wrapper-premium:hover .main-image-premium {
  transform: scale(1.03) rotateY(2deg);
}

.image-glow-premium {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.2) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.image-wrapper-premium:hover .image-glow-premium {
  opacity: 1;
}

.image-shine-premium {
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
  transition: left 0.6s ease;
  pointer-events: none;
}

.image-wrapper-premium:hover .image-shine-premium {
  left: 100%;
}

.image-reflection-premium {
  position: absolute;
  bottom: -20px;
  left: 10%;
  width: 80%;
  height: 30px;
  background: linear-gradient(
    180deg,
    rgba(212, 175, 55, 0.1) 0%,
    transparent 100%
  );
  filter: blur(12px);
  border-radius: 50%;
  pointer-events: none;
}

.image-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  animation: pulseBadge 2s ease-in-out infinite;
}

@keyframes pulseBadge {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Thumbnail Gallery */
.thumbnail-gallery-premium {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.thumbnail-premium {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  background: rgba(59, 58, 64, 0.3);
}

.thumbnail-premium:hover {
  transform: translateY(-2px);
  border-color: var(--gold-primary);
}

.thumbnail-premium.active {
  border-color: var(--gold-primary);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.5);
}

.thumbnail-premium img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info Premium */
.product-info-section-premium {
  animation: fadeInUpPremium 0.8s ease 0.2s both;
}

.category-badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.12);
  color: var(--gold-primary);
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.product-title-premium {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f5f0e6 0%, #d4af37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 24px;
  line-height: 1.3;
}

/* Price Premium */
.price-section-premium {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.price-premium {
  font-size: 2.8rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #f5e6a0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.installment-premium {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.stock-info-premium {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.stock-badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 0.85rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  display: inline-block;
  animation: pulseDot 1.5s ease-in-out infinite;
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.delivery-estimate {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.85rem;
}

/* Description */
.short-description-premium {
  color: rgba(245, 240, 230, 0.85);
  line-height: 1.7;
  margin-bottom: 32px;
  font-size: 0.95rem;
}

/* Action Buttons Premium */
.action-buttons-premium {
  display: flex;
  gap: 20px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.tooltip-premium {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.tooltip-premium-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  color: var(--gold-primary);
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 100;
  transition: all 0.3s ease;
  pointer-events: none;
  border: 1px solid rgba(212, 175, 55, 0.3);
  font-weight: 500;
}

.tooltip-premium:hover .tooltip-premium-text {
  visibility: visible;
  opacity: 1;
  bottom: 140%;
}

.btn-cart-premium,
.btn-buy-premium {
  width: 100%;
  padding: 14px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-cart-premium {
  background: transparent;
  border: 2px solid var(--gold-primary);
  color: var(--gold-primary);
}

.btn-cart-premium:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
}

.btn-buy-premium {
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border: none;
  color: var(--black-primary);
}

.btn-buy-premium:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  gap: 14px;
}

.spinner-premium {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Benefits Premium */
.benefits-premium {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 24px;
}

.benefit-item-premium {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: rgba(212, 175, 55, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.benefit-item-premium:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.benefit-icon {
  font-size: 1.5rem;
}

.benefit-content {
  display: flex;
  flex-direction: column;
}

.benefit-content strong {
  color: var(--gold-primary);
  font-size: 0.85rem;
}

.benefit-content span {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.7rem;
}

/* Guest Message Premium */
.guest-message-premium-card {
  margin-top: 24px;
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(212, 175, 55, 0.12) 0%,
    rgba(212, 175, 55, 0.05) 100%
  );
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  animation: fadeInUpPremium 0.5s ease;
}

.guest-message-premium-icon {
  font-size: 2.5rem;
}

.guest-message-premium-content h4 {
  color: var(--gold-primary);
  margin-bottom: 8px;
  font-size: 1rem;
}

.guest-message-premium-content p {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.login-action-premium {
  background: var(--gold-primary);
  color: var(--black-primary);
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.login-action-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
  gap: 12px;
}

/* Welcome Message Premium */
.welcome-message-premium {
  margin-top: 24px;
  padding: 16px 20px;
  background: rgba(212, 175, 55, 0.08);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.welcome-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--black-primary);
}

.welcome-content {
  display: flex;
  flex-direction: column;
}

.welcome-content span:first-child {
  color: var(--white-soft);
  font-size: 0.9rem;
}

.welcome-content span:first-child strong {
  color: var(--gold-primary);
}

.welcome-content span:last-child {
  color: rgba(245, 240, 230, 0.6);
  font-size: 0.75rem;
}

/* Product Details Tabs Premium */
.product-details-premium {
  margin-bottom: 80px;
  background: rgba(11, 11, 15, 0.5);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 32px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.tabs-premium {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.tab-premium {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(245, 240, 230, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 40px;
  position: relative;
}

.tab-premium:hover {
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.05);
}

.tab-premium.active {
  color: var(--gold-primary);
  background: rgba(212, 175, 55, 0.1);
}

.tab-premium svg {
  transition: all 0.3s ease;
}

.tab-premium.active svg {
  transform: scale(1.1);
}

.tab-content-premium {
  color: rgba(245, 240, 230, 0.85);
  line-height: 1.7;
}

.description-premium h3 {
  color: var(--gold-primary);
  margin-bottom: 16px;
  margin-top: 24px;
  font-size: 1.2rem;
}

.description-premium h3:first-child {
  margin-top: 0;
}

.features-premium {
  list-style: none;
  padding: 0;
}

.features-premium li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

.feature-check {
  color: var(--gold-primary);
  font-size: 1.1rem;
  font-weight: bold;
}

/* Specs Premium */
.specs-grid-premium {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.spec-card-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(59, 58, 64, 0.3);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.spec-card-premium:hover {
  background: rgba(212, 175, 55, 0.08);
  transform: translateX(5px);
}

.spec-label-premium {
  font-weight: 600;
  color: var(--gold-primary);
}

.spec-value-premium {
  color: rgba(245, 240, 230, 0.8);
}

/* Shipping Premium */
.shipping-premium {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.shipping-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(59, 58, 64, 0.2);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.shipping-card:hover {
  background: rgba(212, 175, 55, 0.05);
  transform: translateX(5px);
}

.shipping-icon {
  font-size: 2rem;
}

.shipping-content h4 {
  color: var(--gold-primary);
  margin-bottom: 8px;
  font-size: 1rem;
}

.shipping-content p {
  color: rgba(245, 240, 230, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

.shipping-highlight {
  color: var(--gold-primary) !important;
  margin-top: 8px !important;
}

/* Related Products Premium */
.related-premium {
  margin-top: 60px;
}

.section-header-premium {
  position: relative;
  text-align: center;
  margin-bottom: 48px;
}

.section-title-premium {
  font-size: 2rem;
  background: linear-gradient(135deg, #f5f0e6 0%, #d4af37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  position: relative;
  z-index: 1;
}

.title-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 60px;
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.2) 0%,
    transparent 70%
  );
  filter: blur(20px);
  pointer-events: none;
}

.products-grid-premium {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
}

.product-card-premium {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.product-card-premium:hover {
  transform: translateY(-8px);
  border-color: var(--gold-primary);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
}

.card-image-premium {
  position: relative;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(59, 58, 64, 0.3);
  overflow: hidden;
}

.card-image-premium img {
  max-width: 100%;
  max-height: 160px;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.product-card-premium:hover .card-image-premium img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(212, 175, 55, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card-premium:hover .card-overlay {
  opacity: 1;
}

.card-overlay span {
  color: var(--black-primary);
  font-weight: 600;
  padding: 8px 20px;
  background: white;
  border-radius: 30px;
  font-size: 0.85rem;
}

.card-info-premium {
  padding: 20px;
}

.card-title-premium {
  font-size: 0.9rem;
  color: var(--white-soft);
  margin-bottom: 12px;
  min-height: 45px;
  line-height: 1.4;
}

.card-price-premium {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--gold-primary);
  margin-bottom: 8px;
}

/* Error State Premium */
.error-premium {
  text-align: center;
  padding: 80px 20px;
}

.error-content-premium {
  background: rgba(11, 11, 15, 0.6);
  backdrop-filter: blur(10px);
  padding: 48px;
  border-radius: 40px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  max-width: 500px;
  margin: 0 auto;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.error-content-premium h2 {
  color: var(--white-soft);
  margin-bottom: 16px;
}

.error-content-premium p {
  color: rgba(245, 240, 230, 0.7);
  margin-bottom: 32px;
}

.back-home-premium {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--gold-primary) 0%, #b58f2a 100%);
  color: var(--black-primary);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-home-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
  gap: 12px;
}

/* Transitions */
.fade-premium-enter-active,
.fade-premium-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-premium-enter-from,
.fade-premium-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.tab-premium-enter-active,
.tab-premium-leave-active {
  transition: opacity 0.2s ease;
}

.tab-premium-enter-from,
.tab-premium-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 1024px) {
  .container-premium {
    padding: 0 24px;
  }

  .product-main-premium {
    gap: 40px;
  }

  .product-title-premium {
    font-size: 1.8rem;
  }

  .price-premium {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .product-detail-premium {
    padding: 20px 0 60px;
  }

  .breadcrumb-premium {
    margin-bottom: 32px;
  }

  .product-main-premium {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .product-image-section-premium {
    position: relative;
    top: 0;
  }

  .main-image-container-premium {
    padding: 30px;
  }

  .product-title-premium {
    font-size: 1.5rem;
  }

  .benefits-premium {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .action-buttons-premium {
    flex-direction: column;
  }

  .tooltip-premium {
    width: 100%;
  }

  .guest-message-premium-card {
    flex-direction: column;
    text-align: center;
  }

  .welcome-message-premium {
    flex-direction: column;
    text-align: center;
  }

  .product-details-premium {
    padding: 24px;
  }

  .tabs-premium {
    justify-content: center;
  }

  .tab-premium {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .spec-card-premium {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .shipping-card {
    flex-direction: column;
    text-align: center;
  }

  .products-grid-premium {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }

  .thumbnail-gallery-premium {
    margin-top: 16px;
  }

  .thumbnail-premium {
    width: 60px;
    height: 60px;
  }

  .error-content-premium {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .container-premium {
    padding: 0 16px;
  }

  .product-title-premium {
    font-size: 1.3rem;
  }

  .price-premium {
    font-size: 1.8rem;
  }

  .benefit-item-premium {
    justify-content: center;
  }

  .products-grid-premium {
    grid-template-columns: 1fr;
  }

  .tab-premium span {
    display: none;
  }

  .tab-premium svg {
    margin: 0;
  }

  .thumbnail-premium {
    width: 50px;
    height: 50px;
  }
}
</style>