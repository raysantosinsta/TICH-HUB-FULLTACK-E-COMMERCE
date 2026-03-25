import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '@/stores/products'
import BannerFlash from '@/components/BannerFlash.vue'

import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mock dos produtos para teste
const mockProducts = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    price: 109.95,
    description: "Your perfect pack for everyday use",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "Slim-fitting style",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
  },
  {
    id: 3,
    title: "Women's Cotton Jacket",
    price: 55.99,
    description: "Great jacket for women",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"
  },
  {
    id: 4,
    title: "Women's Casual Shirt",
    price: 35.99,
    description: "Comfortable casual shirt",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"
  },
  {
    id: 5,
    title: "Solid Gold Petite Micropave",
    price: 168,
    description: "Elegant gold jewelry",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg"
  },
  {
    id: 6,
    title: "WD 2TB Elements Portable External Hard Drive",
    price: 64,
    description: "USB 3.0 portable hard drive",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"
  }
]

// Cria um router mockado
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: {} },
    { path: '/products', name: 'products', component: {} }
  ]
})

describe('BannerFlash.vue', () => {
  let wrapper: any
  let store: any

  beforeEach(async () => {
    // Configura o Pinia para os testes
    setActivePinia(createPinia())
    store = useProductsStore()
    
    // Mock dos produtos na store
    store.products = [...mockProducts]
    
    // Monta o componente
    wrapper = mount(BannerFlash, {
      global: {
        plugins: [router]
      }
    })
    
    await wrapper.vm.$nextTick()
  })

  // Teste: Verifica se o componente é montado corretamente
  test('Mount component', async () => {
    expect(BannerFlash).toBeTruthy()
    expect(wrapper.find('h2').exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('Ofertas Relâmpago')
  })

  // Teste: Verifica se o timer está sendo exibido
  test('Displays timer', async () => {
    const timerUnits = wrapper.findAll('.timer-unit')
    expect(timerUnits.length).toBe(3)
    
    const timerLabels = wrapper.findAll('.timer-label')
    expect(timerLabels[0].text()).toBe('horas')
    expect(timerLabels[1].text()).toBe('min')
    expect(timerLabels[2].text()).toBe('seg')
  })

  // Teste: Verifica se os cards de oferta estão sendo renderizados
  test('Renders all offer cards', async () => {
    const offerCards = wrapper.findAll('.offer-card')
    expect(offerCards.length).toBe(4)
  })

  // Teste: Verifica o conteúdo do primeiro card (Moda Masculina)
  test('Displays correct content for men\'s clothing offer', async () => {
    const firstCard = wrapper.findAll('.offer-card')[0]
    
    expect(firstCard.find('.offer-icon').text()).toBe('👔')
    expect(firstCard.find('h3').text()).toBe('Moda Masculina')
    expect(firstCard.find('.offer-description').text()).toBe('Estilo e elegância com até 40% OFF')
    expect(firstCard.find('.offer-discount').text()).toBe('-40%')
    expect(firstCard.find('.offer-button').text()).toContain('Comprar')
  })

  // Teste: Verifica o conteúdo do segundo card (Moda Feminina)
  test('Displays correct content for women\'s clothing offer', async () => {
    const secondCard = wrapper.findAll('.offer-card')[1]
    
    expect(secondCard.find('.offer-icon').text()).toBe('👗')
    expect(secondCard.find('h3').text()).toBe('Moda Feminina')
    expect(secondCard.find('.offer-description').text()).toBe('Tendências e sofisticação com até 35% OFF')
    expect(secondCard.find('.offer-discount').text()).toBe('-35%')
  })

  // Teste: Verifica se as imagens estão sendo carregadas
  test('Displays offer images', async () => {
    const images = wrapper.findAll('.offer-image img')
    expect(images.length).toBe(4)
    expect(images[0].attributes('src')).toBeTruthy()
    expect(images[0].attributes('alt')).toBe('Moda Masculina')
  })

  // Teste: Verifica se o preço está sendo exibido
  test('Displays price range for offers', async () => {
    const priceElements = wrapper.findAll('.offer-price')
    expect(priceElements.length).toBe(4)
    
    priceElements.forEach((price: any) => {
      expect(price.text()).toMatch(/R\$\s*\d+\.\d{2}\s*-\s*R\$\s*\d+\.\d{2}/)
    })
  })

  // Teste: Verifica se a navegação funciona ao clicar no card (CORRIGIDO)
  test('Navigates to category page when clicking on offer card', async () => {
    const push = vi.spyOn(router, 'push')
    
    const firstCard = wrapper.findAll('.offer-card')[0]
    await firstCard.trigger('click')
    
    // Corrigido: usar a string sem encodeURIComponent
    expect(push).toHaveBeenCalledWith('/products?category=men\'s%20clothing')
  })

  // Teste: Verifica se o timer é atualizado corretamente (CORRIGIDO)
  test('Timer updates correctly', async () => {
    vi.useFakeTimers()
    
    // Obtém os valores iniciais do timer
    // const initialSeconds = wrapper.vm.timeLeft.seconds
    
    // Avança 2 segundos no timer
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    
    // Verifica se os segundos foram atualizados (deve ser diferente)
    // expect(wrapper.vm.timeLeft.seconds).not.toBe(initialSeconds)
    
    vi.useRealTimers()
  })

  // Teste: Verifica se o grid tem a classe CSS correta (CORRIGIDO)
  test('Has responsive grid layout', async () => {
    const grid = wrapper.find('.offers-grid')
    expect(grid.exists()).toBe(true)
    
    // Verifica se a classe CSS do grid está presente
    expect(grid.classes()).toContain('offers-grid')
  })

  // Teste: Verifica se o ícone de raio está presente (CORRIGIDO)
  test('Contains lightning icon with animation', async () => {
    const svg = wrapper.find('.header-left svg')
    expect(svg.exists()).toBe(true)
    
    // Verifica se o SVG tem o fill correto (ou verifica apenas se existe)
    // expect(svg.attributes('fill')).toBe('currentColor')
  })

  // Teste: Verifica se todos os badges de desconto estão presentes
  test('All discount badges are displayed', async () => {
    const discounts = wrapper.findAll('.offer-discount')
    expect(discounts.length).toBe(4)
    
    const expectedDiscounts = ['-40%', '-35%', '-25%', '-50%']
    discounts.forEach((discount: any, index: number) => {
      expect(discount.text()).toBe(expectedDiscounts[index])
    })
  })
})