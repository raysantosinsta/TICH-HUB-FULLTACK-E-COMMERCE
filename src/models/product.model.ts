export interface ProductRating {
  rate: number
  count: number
}

export class Product {
  public id: number
  public title: string
  public price: number
  public description: string
  public category: string
  public image: string
  public rating: ProductRating
  public discount?: number

  constructor(
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating: ProductRating,
    discount?: number
  ) {
    this.id = id
    this.title = title
    this.price = price
    this.description = description
    this.category = category
    this.image = image
    this.rating = rating
    this.discount = discount
  }

  // Formatar preço para exibição
  getFormattedPrice(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.price)
  }

  // Formatar preço com desconto
  getFormattedDiscountedPrice(): string {
    const discountedPrice = this.getDiscountedPrice()
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(discountedPrice)
  }

  // Obter preço com desconto
  getDiscountedPrice(): number {
    if (this.discount) {
      return this.price * (1 - this.discount)
    }
    return this.price
  }

  // Obter desconto em porcentagem formatado
  getFormattedDiscount(): string {
    if (this.discount) {
      return `${Math.round(this.discount * 100)}% OFF`
    }
    return ''
  }

  // Verificar se tem desconto
  hasDiscount(): boolean {
    return !!this.discount && this.discount > 0
  }

  // Obter avaliação em estrelas
  getStarRating(): string {
    const fullStars = Math.floor(this.rating.rate)
    const hasHalfStar = this.rating.rate % 1 >= 0.5
    let stars = ''
    
    for (let i = 0; i < fullStars; i++) stars += '★'
    if (hasHalfStar) stars += '½'
    for (let i = 0; i < 5 - Math.ceil(this.rating.rate); i++) stars += '☆'
    
    return stars
  }

  // Obter texto da categoria formatado
  getFormattedCategory(): string {
    const categories: Record<string, string> = {
      "men's clothing": "Moda Masculina",
      "women's clothing": "Moda Feminina",
      "jewelery": "Jóias",
      "electronics": "Eletrônicos"
    }
    return categories[this.category] || this.category
  }

  // Truncar título
  truncateTitle(length: number = 50): string {
    if (this.title.length > length) {
      return this.title.substring(0, length - 3) + '...'
    }
    return this.title
  }

  // Truncar descrição
  truncateDescription(length: number = 200): string {
    if (this.description.length > length) {
      return this.description.substring(0, length - 3) + '...'
    }
    return this.description
  }

  // Calcular parcelamento
  getInstallment(installments: number = 12): {
    value: number
    formattedValue: string
    installments: number
  } {
    const value = this.getDiscountedPrice() / installments
    return {
      value,
      formattedValue: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value),
      installments
    }
  }

  // Converter para objeto simples (para salvar no localStorage)
  toJSON(): {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: ProductRating
    discount?: number
  } {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      description: this.description,
      category: this.category,
      image: this.image,
      rating: this.rating,
      discount: this.discount
    }
  }

  // Criar produto a partir de dados da API
  static fromAPI(data: any): Product {
    return new Product(
      data.id,
      data.title,
      data.price,
      data.description,
      data.category,
      data.image,
      data.rating || { rate: 0, count: 0 },
      data.discount || 0
    )
  }

  // Criar lista de produtos a partir da API
  static fromAPIList(dataList: any[]): Product[] {
    return dataList.map(data => Product.fromAPI(data))
  }
}