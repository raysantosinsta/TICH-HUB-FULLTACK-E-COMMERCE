import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Banner {
  id: number
  title: string
  subtitle: string
  description?: string
  image: string
  buttonText: string
  buttonLink: string
  discount?: number
  discountText?: string
  timer?: boolean
  type: 'hero' | 'flash' | 'promo'
}

export const useBannersStore = defineStore('banners', () => {
  const banners = ref<Banner[]>([
    {
      id: 1,
      title: "Nova Coleção 2024",
      subtitle: "Estilo e Elegância",
      description: "Descubra as últimas tendências da moda com qualidade premium",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      buttonText: "Ver Coleção",
      buttonLink: "/products",
      type: "hero"
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
      type: "hero"
    },
    {
      id: 3,
      title: "Tecnologia de Ponta",
      subtitle: "Os melhores eletrônicos",
      description: "Inovação e qualidade em um só lugar",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
      buttonText: "Explorar",
      buttonLink: "/products?category=electronics",
      type: "hero"
    }
  ])

  const flashDeals = ref<Banner[]>([
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
      type: "flash"
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
      type: "flash"
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
      type: "flash"
    }
  ])

  const promoBanners = ref<Banner[]>([
    {
      id: 1,
      title: "Frete Grátis",
      subtitle: "Para compras acima de R$ 200",
      image: "https://images.unsplash.com/photo-1605146768851-eda79daa97c4?w=600",
      buttonText: "Comprar Agora",
      buttonLink: "/products",
      type: "promo"
    },
    {
      id: 2,
      title: "Black Friday",
      subtitle: "Prepare-se para as melhores ofertas",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600",
      buttonText: "Saiba Mais",
      buttonLink: "/products",
      type: "promo"
    },
    {
      id: 3,
      title: "Lançamentos",
      subtitle: "Os produtos mais aguardados",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
      buttonText: "Conferir",
      buttonLink: "/products",
      type: "promo"
    }
  ])

  return {
    banners,
    flashDeals,
    promoBanners
  }
})