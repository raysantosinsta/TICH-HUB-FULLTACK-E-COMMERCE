import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Product } from "../models/product.model";

export const useProductsStore = defineStore("products", () => {
  // ========== CONSTANTES ==========
  // Nova API da Platzi - suporta CORS nativamente
  const API_BASE_URL = "https://api.escuelajs.co/api/v1/products";

  // ========== ESTADO ==========
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedCategory = ref<string>("");
  const categoriesList = ref<{ id: number; name: string }[]>([]);

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
      .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
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
      console.log("Fetching:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados recebidos:", data.length);
      return data;
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        throw new Error(
          "Erro de conexão: Não foi possível acessar a API. Verifique sua conexão com a internet.",
        );
      }
      throw err;
    }
  };

  // stores/products.ts - Atualizar o método processProductsData
const processProductsData = (data: any[]): void => {
  if (!Array.isArray(data)) {
    console.error("processProductsData: data não é um array", data);
    products.value = [];
    return;
  }

  // Usar o método estático da classe Product
  products.value = Product.fromAPIList(data);
  console.log("Produtos processados:", products.value.length);
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
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca produtos por categoria da API
   * @param categoryName - Nome da categoria
   */
  const fetchProductsByCategory = async (
    categoryName: string,
  ): Promise<void> => {
    loading.value = true;
    clearError();

    try {
      // Primeiro, busca todas as categorias para encontrar o ID
      const categoriesResponse = await fetch(
        "https://api.escuelajs.co/api/v1/categories",
      );
      const categories = await categoriesResponse.json();

      const category = categories.find(
        (cat: any) => cat.name.toLowerCase() === categoryName.toLowerCase(),
      );

      if (category) {
        // Busca produtos pela categoria ID
        const url = `${API_BASE_URL}/?categoryId=${category.id}`;
        const data = await fetchFromAPI(url);
        processProductsData(data);
        selectedCategory.value = categoryName;
      } else {
        // Se não encontrar a categoria, faz filtro local
        const filteredProducts = products.value.filter(
          (p) => p.category.toLowerCase() === categoryName.toLowerCase(),
        );
        products.value = filteredProducts;
        selectedCategory.value = categoryName;
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca todas as categorias disponíveis
   */
  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await fetch(
        "https://api.escuelajs.co/api/v1/categories",
      );
      const data = await response.json();
      categoriesList.value = data;
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  /**
   * Filtra produtos por categoria (filtro local)
   * @param category - Categoria dos produtos
   */
  const getProductsByCategory = (category: string): Product[] => {
    return products.value.filter((p) => p.category === category) as Product[];
  };

  // stores/products.ts - Atualizar getProductById
const getProductById = async (id: number): Promise<Product | undefined> => {
  // Primeiro tenta encontrar no estado local
  const localProduct = products.value.find((p) => p.id === id);
  if (localProduct) {
    return localProduct as any;
  }

  try {
    const url = `${API_BASE_URL}/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP ${response.status} ao buscar produto ${id}`);
      return undefined;
    }

    const data = await response.json();
    if (!data || Object.keys(data).length === 0) {
      return undefined;
    }

    // Usa o método estático
    const product = Product.fromAPI(data);
    return product;
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    return undefined;
  }
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
  // Carrega as categorias ao iniciar
  fetchCategories();

  // ========== RETORNO ==========
  return {
    // Estado
    products,
    loading,
    error,
    selectedCategory,
    categoriesList,

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
    fetchCategories,
    getProductById,
    getProductsByCategory,
    searchProducts,
    setSelectedCategory,
    clearCategoryFilter,
    clearProducts,
    refreshProducts,
  };
});
