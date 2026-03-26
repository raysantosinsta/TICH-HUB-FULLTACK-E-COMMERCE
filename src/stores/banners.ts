import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  discount?: number;
  discountText?: string;
  timer?: boolean;
  type: 'hero' | 'flash' | 'promo';
}

export const useBannersStore = defineStore('banners', () => {
  // ========== DADOS ESTÁTICOS (Constantes) ==========

  /** Banners principais do hero section */
  const HERO_BANNERS: Banner[] = [
    {
      id: 1,
      title: "Nova Coleção 2024",
      subtitle: "Estilo e Elegância",
      description: "Descubra as últimas tendências da moda com qualidade premium",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      buttonText: "Ver Coleção",
      buttonLink: "/products",
      type: "hero",
    },
    {
      id: 2,
      title: "Ofertas Imperdíveis",
      subtitle: "Até 50% OFF",
      description: "Aproveite os descontos especiais em produtos selecionados",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
      buttonText: "Comprar Agora",
      buttonLink: "/products",
      discount: 50,
      type: "hero",
    },
    {
      id: 3,
      title: "Tecnologia de Ponta",
      subtitle: "Os melhores eletrônicos",
      description: "Inovação e qualidade em um só lugar",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
      buttonText: "Explorar",
      buttonLink: "/products?category=electronics",
      type: "hero",
    },
  ];

  /** Banners de ofertas relâmpago */
  const FLASH_DEALS: Banner[] = [
    {
      id: 1,
      title: "Smart TVs",
      subtitle: "Oferta Relâmpago",
      description: "Descontos incríveis em Smart TVs",
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600",
      buttonText: "Comprar",
      buttonLink: "/products?category=electronics",
      discount: 40,
      discountText: "40% OFF",
      timer: true,
      type: "flash",
    },
    {
      id: 2,
      title: "Fones Bluetooth",
      subtitle: "Oferta Relâmpago",
      description: "Qualidade de som premium",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      buttonText: "Comprar",
      buttonLink: "/products",
      discount: 30,
      discountText: "30% OFF",
      timer: true,
      type: "flash",
    },
    {
      id: 3,
      title: "Smartwatches",
      subtitle: "Oferta Relâmpago",
      description: "Tecnologia no seu pulso",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      buttonText: "Comprar",
      buttonLink: "/products",
      discount: 25,
      discountText: "25% OFF",
      timer: true,
      type: "flash",
    },
  ];

  /** Banners promocionais */
  const PROMO_BANNERS: Banner[] = [
    {
      id: 1,
      title: "Frete Grátis",
      subtitle: "Para compras acima de R$ 200",
      image: "https://images.unsplash.com/photo-1605146768851-eda79daa97c4?w=600",
      buttonText: "Comprar Agora",
      buttonLink: "/products",
      type: "promo",
    },
    {
      id: 2,
      title: "Black Friday",
      subtitle: "Prepare-se para as melhores ofertas",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600",
      buttonText: "Saiba Mais",
      buttonLink: "/products",
      type: "promo",
    },
    {
      id: 3,
      title: "Lançamentos",
      subtitle: "Os produtos mais aguardados",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
      buttonText: "Conferir",
      buttonLink: "/products",
      type: "promo",
    },
  ];

  // ========== ESTADO ==========
  const banners = ref<Banner[]>([...HERO_BANNERS]);
  const flashDeals = ref<Banner[]>([...FLASH_DEALS]);
  const promoBanners = ref<Banner[]>([...PROMO_BANNERS]);

  // ========== GETTERS ==========

  /** Retorna banners ativos (não expirados) */
  const activeBanners = computed(() => banners.value);
  
  /** Retorna ofertas relâmpago ativas */
  const activeFlashDeals = computed(() => flashDeals.value);
  
  /** Retorna banners promocionais ativos */
  const activePromoBanners = computed(() => promoBanners.value);
  
  /** Retorna o primeiro banner hero (principal) */
  const heroBanner = computed(() => banners.value[0]);
  
  /** Retorna os banners para o carrossel */
  const carouselBanners = computed(() => banners.value);

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Busca um banner pelo ID
   * @param id - ID do banner
   */
  const getBannerById = (id: number): Banner | undefined => {
    return banners.value.find(banner => banner.id === id);
  };

  /**
   * Busca um banner de oferta relâmpago pelo ID
   * @param id - ID do banner
   */
  const getFlashDealById = (id: number): Banner | undefined => {
    return flashDeals.value.find(deal => deal.id === id);
  };

  /**
   * Busca um banner promocional pelo ID
   * @param id - ID do banner
   */
  const getPromoBannerById = (id: number): Banner | undefined => {
    return promoBanners.value.find(banner => banner.id === id);
  };

  /**
   * Retorna banners filtrados por tipo
   * @param type - Tipo do banner ('hero', 'flash', 'promo')
   */
  const getBannersByType = (type: Banner['type']): Banner[] => {
    switch (type) {
      case 'hero':
        return banners.value;
      case 'flash':
        return flashDeals.value;
      case 'promo':
        return promoBanners.value;
      default:
        return [];
    }
  };

  /**
   * Adiciona um novo banner
   * @param banner - Dados do banner
   */
  const addBanner = (banner: Banner): void => {
    banners.value.push(banner);
  };

  /**
   * Adiciona uma nova oferta relâmpago
   * @param deal - Dados da oferta
   */
  const addFlashDeal = (deal: Banner): void => {
    flashDeals.value.push(deal);
  };

  /**
   * Adiciona um novo banner promocional
   * @param banner - Dados do banner
   */
  const addPromoBanner = (banner: Banner): void => {
    promoBanners.value.push(banner);
  };

  /**
   * Remove um banner pelo ID
   * @param id - ID do banner
   */
  const removeBanner = (id: number): void => {
    banners.value = banners.value.filter(banner => banner.id !== id);
  };

  /**
   * Remove uma oferta relâmpago pelo ID
   * @param id - ID da oferta
   */
  const removeFlashDeal = (id: number): void => {
    flashDeals.value = flashDeals.value.filter(deal => deal.id !== id);
  };

  /**
   * Remove um banner promocional pelo ID
   * @param id - ID do banner
   */
  const removePromoBanner = (id: number): void => {
    promoBanners.value = promoBanners.value.filter(banner => banner.id !== id);
  };

  /**
   * Atualiza um banner existente
   * @param id - ID do banner
   * @param updatedBanner - Dados atualizados
   */
  const updateBanner = (id: number, updatedBanner: Partial<Banner>): boolean => {
    const index = banners.value.findIndex(banner => banner.id === id);
    if (index !== -1) {
      banners.value[index] = { ...banners.value[index], ...updatedBanner };
      return true;
    }
    return false;
  };

  /**
   * Atualiza uma oferta relâmpago
   * @param id - ID da oferta
   * @param updatedDeal - Dados atualizados
   */
  const updateFlashDeal = (id: number, updatedDeal: Partial<Banner>): boolean => {
    const index = flashDeals.value.findIndex(deal => deal.id === id);
    if (index !== -1) {
      flashDeals.value[index] = { ...flashDeals.value[index], ...updatedDeal };
      return true;
    }
    return false;
  };

  /**
   * Atualiza um banner promocional
   * @param id - ID do banner
   * @param updatedBanner - Dados atualizados
   */
  const updatePromoBanner = (id: number, updatedBanner: Partial<Banner>): boolean => {
    const index = promoBanners.value.findIndex(banner => banner.id === id);
    if (index !== -1) {
      promoBanners.value[index] = { ...promoBanners.value[index], ...updatedBanner };
      return true;
    }
    return false;
  };

  /**
   * Reseta todos os banners para o estado inicial
   */
  const resetBanners = (): void => {
    banners.value = [...HERO_BANNERS];
    flashDeals.value = [...FLASH_DEALS];
    promoBanners.value = [...PROMO_BANNERS];
  };

  // ========== RETORNO ==========
  return {
    // Estado
    banners,
    flashDeals,
    promoBanners,
    
    // Getters
    activeBanners,
    activeFlashDeals,
    activePromoBanners,
    heroBanner,
    carouselBanners,
    
    // Métodos de busca
    getBannerById,
    getFlashDealById,
    getPromoBannerById,
    getBannersByType,
    
    // Métodos de adição
    addBanner,
    addFlashDeal,
    addPromoBanner,
    
    // Métodos de remoção
    removeBanner,
    removeFlashDeal,
    removePromoBanner,
    
    // Métodos de atualização
    updateBanner,
    updateFlashDeal,
    updatePromoBanner,
    
    // Utilitários
    resetBanners,
  };
});