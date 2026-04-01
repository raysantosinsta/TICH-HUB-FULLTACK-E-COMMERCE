export interface ProductRating {
  rate: number;
  count: number;
}

export class Product {
  // ========== PROPRIEDADES ==========
  public readonly id: number;
  public readonly title: string;
  public readonly price: number;
  public readonly description: string;
  public readonly category: string;
  public readonly image: string;
  public readonly rating: ProductRating;
  public readonly discount?: number;

  // Campos adicionais da nova API
  public readonly slug?: string;
  public readonly images?: string[];
  public readonly creationAt?: string;
  public readonly updatedAt?: string;

  // ========== CONSTRUTOR ==========
  constructor(
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating: ProductRating,
    discount?: number,
    slug?: string,
    images?: string[],
    creationAt?: string,
    updatedAt?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.image = image;
    this.rating = rating;
    this.discount = discount;
    this.price = price;
    this.slug = slug;
    this.images = images;
    this.creationAt = creationAt;
    this.updatedAt = updatedAt;
  }

  // ========== GETTERS ==========

  /** Preço formatado para exibição */
  public get formattedPrice(): string {
    return this.formatCurrency(this.price);
  }

  /** Preço com desconto calculado */
  public get discountedPrice(): number {
    return this.hasDiscount() ? this.price * (1 - this.discount!) : this.price;
  }

  /** Preço com desconto formatado */
  public get formattedDiscountedPrice(): string {
    return this.formatCurrency(this.discountedPrice);
  }

  /** Desconto formatado em porcentagem */
  public get formattedDiscount(): string {
    return this.hasDiscount() ? `${Math.round(this.discount! * 100)}% OFF` : "";
  }

  /** Avaliação em estrelas (★, ½, ☆) */
  public get starRating(): string {
    const { rate } = this.rating;
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;

    const stars = "★".repeat(fullStars);
    const halfStar = hasHalfStar ? "½" : "";
    const emptyStars = "☆".repeat(5 - Math.ceil(rate));

    return stars + halfStar + emptyStars;
  }

  /** Número de estrelas inteiras preenchidas */
  public get fullStars(): number {
    return Math.floor(this.rating.rate);
  }

  /** Verifica se tem meia estrela */
  public get hasHalfStar(): boolean {
    return this.rating.rate % 1 >= 0.5;
  }

  /** Número de estrelas vazias */
  public get emptyStars(): number {
    return 5 - Math.ceil(this.rating.rate);
  }

  /** Categoria formatada para exibição */
  public get formattedCategory(): string {
    const categoryMap: Record<string, string> = {
      "men's clothing": "Moda Masculina",
      "women's clothing": "Moda Feminina",
      jewelery: "Jóias",
      electronics: "Eletrônicos",
      clothes: "Roupas",
      furniture: "Móveis",
      shoes: "Calçados",
      miscellaneous: "Diversos",
    };
    return categoryMap[this.category.toLowerCase()] || this.category;
  }

  // ========== MÉTODOS PÚBLICOS (Compatibilidade) ==========

  /**
   * Formata o preço para exibição
   */
  public getFormattedPrice(): string {
    return this.formattedPrice;
  }

  /**
   * Formata o preço com desconto
   */
  public getFormattedDiscountedPrice(): string {
    return this.formattedDiscountedPrice;
  }

  /**
   * Retorna o preço com desconto
   */
  public getDiscountedPrice(): number {
    return this.discountedPrice;
  }

  /**
   * Retorna o desconto formatado
   */
  public getFormattedDiscount(): string {
    return this.formattedDiscount;
  }

  /**
   * Verifica se o produto tem desconto
   */
  public hasDiscount(): boolean {
    return !!this.discount && this.discount > 0;
  }

  /**
   * Retorna a avaliação em estrelas
   */
  public getStarRating(): string {
    return this.starRating;
  }

  /**
   * Retorna a categoria formatada
   */
  public getFormattedCategory(): string {
    return this.formattedCategory;
  }

  /**
   * Trunca o título para o tamanho especificado
   * @param length - Tamanho máximo (padrão: 50)
   */
  public truncateTitle(length: number = 50): string {
    return this.truncateString(this.title, length);
  }

  /**
   * Trunca a descrição para o tamanho especificado
   * @param length - Tamanho máximo (padrão: 200)
   */
  public truncateDescription(length: number = 200): string {
    return this.truncateString(this.description, length);
  }

  /**
   * Calcula o parcelamento do produto
   * @param installments - Número de parcelas (padrão: 12)
   */
  public getInstallment(installments: number = 12): {
    value: number;
    formattedValue: string;
    installments: number;
  } {
    const value = this.discountedPrice / installments;
    return {
      value,
      formattedValue: this.formatCurrency(value),
      installments,
    };
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Formata um valor para moeda brasileira
   * @param value - Valor a ser formatado
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  /**
   * Trunca uma string para o tamanho especificado
   * @param text - Texto a ser truncado
   * @param maxLength - Tamanho máximo
   */
  private truncateString(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  // ========== MÉTODOS ESTÁTICOS ==========

 public static fromAPI(data: any): Product {
  if (!data || typeof data !== 'object') {
    throw new Error('Dados inválidos para criar produto');
  }

  let imageUrl = data.image || "";
  if (!imageUrl && data.images?.length > 0) {
    imageUrl = data.images[0];
  }

  let categoryName = typeof data.category === "object" && data.category !== null
    ? (data.category as any).name || ""
    : (data.category || "");

  const rating = data.rating || { rate: 0, count: 0 };

  return new Product(
    data.id,
    data.title,
    data.price,
    data.description,
    categoryName,
    imageUrl,
    rating,
    data.discount ?? 0,
    data.slug,
    data.images,
    data.creationAt,
    data.updatedAt,
  );
}

/**
 * Cria uma lista de produtos a partir dos dados da API
 * @param dataList - Lista de dados da API
 */
public static fromAPIList(dataList: any[]): Product[] {
  if (!Array.isArray(dataList)) {
    console.error("fromAPIList: dataList não é um array", dataList);
    return [];
  }

  const products: Product[] = [];
  
  for (const data of dataList) {
    try {
      const product = Product.fromAPI(data);
      products.push(product);
    } catch (err) {
      console.error("Erro ao criar produto:", data, err);
    }
  }
  
  return products;
}

  /**
   * Converte o produto para objeto simples (para salvar no localStorage)
   */
  public toJSON(): {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: ProductRating;
    discount?: number;
    slug?: string;
    images?: string[];
  } {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      description: this.description,
      category: this.category,
      image: this.image,
      rating: this.rating,
      discount: this.discount,
      slug: this.slug,
      images: this.images,
    };
  }
}
