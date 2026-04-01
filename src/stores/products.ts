import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Product } from "../models/product.model";

export const useProductsStore = defineStore("products", () => {
  // ========== CONSTANTES ==========
  // Opção 1: Usar proxy CORS
  const API_BASE_URL =
    "https://cors-anywhere.herokuapp.com/https://fakestoreapi.com/products";

  // ========== ESTADO ==========
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedCategory = ref<string>("");

  // ========== GETTERS ==========

  /** Produtos em destaque (primeiros 8) */
  const featuredProducts = computed(() => products.value.slice(0, 8));

  /** Lista única de categorias disponíveis */
  const categories = computed(() => {
    return [...new Set(products.value.map((p) => p.category))];
  });

  /** Produtos filtrados pela categoria selecionada */
  const productsByCategory = computed(() => {
    if (!selectedCategory.value) return products.value;
    return products.value.filter((p) => p.category === selectedCategory.value);
  });

  /** Total de produtos */
  const totalProducts = computed(() => products.value.length);

  /** Verifica se há produtos */
  const hasProducts = computed(() => products.value.length > 0);

  /** Produtos com desconto */
  const discountedProducts = computed(() => {
    return products.value.filter((p) => p.hasDiscount());
  });

  /** Produtos mais bem avaliados (top 10) */
  const topRatedProducts = computed(() => {
    return [...products.value]
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 10);
  });

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Executa uma requisição fetch com tratamento de erro
   * @param url - URL da requisição
   * @returns Dados da resposta
   */
  const fetchFromAPI = async (url: string): Promise<any[]> => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      // Tratamento específico para CORS
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        throw new Error(
          "Erro de CORS: Não foi possível acessar a API. Verifique sua conexão ou tente novamente mais tarde.",
        );
      }
      throw err;
    }
  };

  /**
   * Processa os dados da API e atualiza o estado
   * @param data - Dados da API
   */
  const processProductsData = (data: any[]): void => {
    products.value = Product.fromAPIList(data);
  };

  /**
   * Define o estado de erro
   * @param err - Erro capturado
   */
  const setError = (err: unknown): void => {
    error.value = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[ProductsStore] Erro:", err);
  };

  /**
   * Limpa o estado de erro
   */
  const clearError = (): void => {
    error.value = null;
  };

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Busca todos os produtos da API
   */
  const fetchProducts = async (): Promise<void> => {
    loading.value = true;
    clearError();

    try {
      const data = await fetchFromAPI(API_BASE_URL);
      processProductsData(data);
    } catch (err) {
      setError(err);
      // Lançar o erro para que o componente possa tratar
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca produtos por categoria da API
   * @param category - Categoria dos produtos
   */
  const fetchProductsByCategory = async (category: string): Promise<void> => {
    loading.value = true;
    clearError();

    try {
      // Para categorias, também precisa usar o proxy
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
      const url = `${proxyUrl}${apiUrl}`;

      const data = await fetchFromAPI(url);
      processProductsData(data);
      selectedCategory.value = category;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Filtra produtos por categoria (filtro local)
   * @param category - Categoria dos produtos
   */
  const getProductsByCategory = (category: string): Product[] => {
    return products.value.filter((p) => p.category === category) as Product[];
  };

  /**
   * Busca um produto pelo ID
   * @param id - ID do produto
   */
  const getProductById = (id: number): Product | undefined => {
    return products.value.find((p) => p.id === id) as Product;
  };

  /**
   * Busca produtos por termo de pesquisa (local)
   * @param query - Termo de pesquisa
   */
  const searchProducts = (query: string): Product[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return products.value as Product[];

    return products.value.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    ) as Product[];
  };

  /**
   * Define a categoria selecionada para filtro local
   * @param category - Categoria a ser filtrada
   */
  const setSelectedCategory = (category: string): void => {
    selectedCategory.value = category;
  };

  /**
   * Limpa o filtro de categoria selecionada
   */
  const clearCategoryFilter = (): void => {
    selectedCategory.value = "";
  };

  /**
   * Limpa todos os produtos (útil para logout)
   */
  const clearProducts = (): void => {
    products.value = [];
    selectedCategory.value = "";
    clearError();
  };

  /**
   * Recarrega os produtos (refetch)
   */
  const refreshProducts = async (): Promise<void> => {
    await fetchProducts();
  };

  // ========== INICIALIZAÇÃO ==========
  // Os produtos são carregados sob demanda, não automaticamente

  // ========== RETORNO ==========
  return {
    // Estado
    products,
    loading,
    error,
    selectedCategory,

    // Getters
    featuredProducts,
    categories,
    productsByCategory,
    totalProducts,
    hasProducts,
    discountedProducts,
    topRatedProducts,

    // Actions
    fetchProducts,
    fetchProductsByCategory,
    getProductById,
    getProductsByCategory,
    searchProducts,
    setSelectedCategory,
    clearCategoryFilter,
    clearProducts,
    refreshProducts,
  };
});
