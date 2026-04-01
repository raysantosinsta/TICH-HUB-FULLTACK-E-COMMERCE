// models/product.model.ts
export interface ProductRating {
  rate: number;
  count: number;
}

export class Product {
  public readonly id: number;
  public readonly title: string;
  public readonly price: number;
  public readonly description: string;
  public readonly category: any; // Pode ser string ou objeto
  public readonly image: string;
  public readonly rating: ProductRating;
  public readonly discount?: number;
  public readonly slug?: string;
  public readonly images?: string[];
  public readonly creationAt?: string;
  public readonly updatedAt?: string;

  constructor(data: any) {
    this.id = data.id || 0;
    this.title = data.title || "";
    this.price =
      typeof data.price === "number" ? data.price : Number(data.price) || 0;
    this.description = data.description || "";
    this.category = data.category || "";
    this.image = data.image || data.images?.[0] || "";
    this.rating =
      data.rating && typeof data.rating === "object"
        ? { rate: data.rating.rate || 0, count: data.rating.count || 0 }
        : { rate: 0, count: 0 };
    this.discount = data.discount || 0;
    this.slug = data.slug;
    this.images = data.images || [];
    this.creationAt = data.creationAt;
    this.updatedAt = data.updatedAt;
  }

  public get formattedPrice(): string {
    return this.formatCurrency(this.price);
  }

  public get discountedPrice(): number {
    return this.hasDiscount() ? this.price * (1 - this.discount!) : this.price;
  }

  public get formattedDiscountedPrice(): string {
    return this.formatCurrency(this.discountedPrice);
  }

  public get formattedDiscount(): string {
    return this.hasDiscount() ? `${Math.round(this.discount! * 100)}% OFF` : "";
  }

  // 🔥 GETTERS COM VALIDAÇÃO
  public get starRating(): string {
    const rate = this.rating?.rate ?? 0; // Garante valor numérico
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    const stars = "★".repeat(fullStars);
    const halfStar = hasHalfStar ? "½" : "";
    const emptyStars = "☆".repeat(5 - Math.ceil(rate));
    return stars + halfStar + emptyStars;
  }

  public get fullStars(): number {
    return Math.floor(this.rating?.rate ?? 0);
  }

  public get hasHalfStar(): boolean {
    return (this.rating?.rate ?? 0) % 1 >= 0.5;
  }

  public get emptyStars(): number {
    return 5 - Math.ceil(this.rating?.rate ?? 0);
  }

  public get formattedCategory(): string {
    const categoryName =
      typeof this.category === "object" ? this.category.name : this.category;

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
    return (
      categoryMap[categoryName?.toLowerCase()] || categoryName || "Produto"
    );
  }

  public getCategoryName(): string {
    if (!this.category) return "Produto";
    if (typeof this.category === "object" && this.category.name) {
      return this.category.name;
    }
    return this.category;
  }

  public hasDiscount(): boolean {
    return !!this.discount && this.discount > 0;
  }

  public getStarRatingDisplay(): string {
    if (!this.rating || typeof this.rating !== "object") {
      return "☆☆☆☆☆";
    }
    return this.starRating;
  }

  public truncateTitle(length: number = 50): string {
    return this.truncateString(this.title, length);
  }

  public truncateDescription(length: number = 200): string {
    return this.truncateString(this.description, length);
  }

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

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  private truncateString(text: string, maxLength: number): string {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  public static fromAPI(data: any): Product {
    if (!data || typeof data !== "object") {
      throw new Error("Dados inválidos para criar produto");
    }
    return new Product(data);
  }

  public static fromAPIList(dataList: any[]): Product[] {
    if (!Array.isArray(dataList)) {
      console.error("fromAPIList: dataList não é um array", dataList);
      return [];
    }

    const products: Product[] = [];
    for (const data of dataList) {
      try {
        products.push(Product.fromAPI(data));
      } catch (err) {
        console.error("Erro ao criar produto:", data, err);
      }
    }
    return products;
  }

  public toJSON(): any {
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
      creationAt: this.creationAt,
      updatedAt: this.updatedAt,
    };
  }
}
