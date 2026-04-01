// src/models/order.model.ts

import type { Product, Category } from "../types";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;  // ← string, não Category
  discount?: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export class Order {
  // ========== PROPRIEDADES ==========
  public readonly id: string;
  public readonly date: Date;
  public status: OrderStatus;
  public readonly subtotal: number;
  public readonly shipping: number;
  public readonly discount: number;
  public readonly total: number;
  public readonly products: OrderItem[];
  public readonly trackingCode?: string;
  public readonly paymentMethod?: string;

  // ========== CONSTRUTOR ==========
  constructor(
    id: string,
    date: Date,
    status: OrderStatus,
    subtotal: number,
    shipping: number,
    discount: number,
    total: number,
    products: OrderItem[],
    trackingCode?: string,
    paymentMethod?: string,
  ) {
    this.id = id;
    this.date = date;
    this.status = status;
    this.subtotal = subtotal;
    this.shipping = shipping;
    this.discount = discount;
    this.total = total;
    this.products = products;
    this.trackingCode = trackingCode;
    this.paymentMethod = paymentMethod;
  }

  // ========== GETTERS ==========

  /** Número total de itens no pedido */
  public get totalItems(): number {
    return this.products.reduce((total, item) => total + item.quantity, 0);
  }

  /** Data formatada para exibição */
  public get formattedDate(): string {
    return this.date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /** Texto do status formatado */
  public get statusText(): string {
    const statusMap: Record<OrderStatus, string> = {
      pending: "Aguardando pagamento",
      processing: "Processando",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return statusMap[this.status];
  }

  /** Cor do status */
  public get statusColor(): string {
    const colorMap: Record<OrderStatus, string> = {
      pending: "#ffc107",
      processing: "#2196f3",
      shipped: "#4caf50",
      delivered: "#9c27b0",
      cancelled: "#ff6b6b",
    };
    return colorMap[this.status];
  }

  /** Background do status */
  public get statusBg(): string {
    const bgMap: Record<OrderStatus, string> = {
      pending: "rgba(255, 193, 7, 0.1)",
      processing: "rgba(33, 150, 243, 0.1)",
      shipped: "rgba(76, 175, 80, 0.1)",
      delivered: "rgba(156, 39, 176, 0.1)",
      cancelled: "rgba(255, 107, 107, 0.1)",
    };
    return bgMap[this.status];
  }

  /** Progresso do pedido (0-100) */
  public get progress(): number {
    const progressMap: Record<OrderStatus, number> = {
      pending: 0,
      processing: 25,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
    };
    return progressMap[this.status];
  }

  /** Total formatado para exibição */
  public get formattedTotal(): string {
    return this.formatCurrency(this.total);
  }

  /** Subtotal formatado para exibição */
  public get formattedSubtotal(): string {
    return this.formatCurrency(this.subtotal);
  }

  /** Frete formatado para exibição */
  public get formattedShipping(): string {
    return this.formatCurrency(this.shipping);
  }

  /** Desconto formatado para exibição */
  public get formattedDiscount(): string {
    return this.formatCurrency(this.discount);
  }

  // ========== MÉTODOS PÚBLICOS (Compatibilidade) ==========

  /**
   * Atualiza o status do pedido
   * @param status - Novo status
   */
  public updateStatus(status: OrderStatus): void {
    this.status = status;
  }

  /**
   * Retorna o texto do status
   */
  public getStatusText(): string {
    return this.statusText;
  }

  /**
   * Retorna a cor do status
   */
  public getStatusColor(): string {
    return this.statusColor;
  }

  /**
   * Retorna o background do status
   */
  public getStatusBg(): string {
    return this.statusBg;
  }

  /**
   * Retorna o progresso do pedido
   */
  public getProgress(): number {
    return this.progress;
  }

  /**
   * Verifica se pode cancelar
   */
  public canCancel(): boolean {
    return this.status === "pending" || this.status === "processing";
  }

  /**
   * Verifica se foi entregue
   */
  public isDelivered(): boolean {
    return this.status === "delivered";
  }

  /**
   * Verifica se está em andamento
   */
  public isInProgress(): boolean {
    return this.status === "processing" || this.status === "shipped";
  }

  /**
   * Retorna total de itens
   */
  public getTotalItems(): number {
    return this.totalItems;
  }

  /**
   * Retorna subtotal
   */
  public getSubtotal(): number {
    return this.subtotal;
  }

  /**
   * Retorna total
   */
  public getTotal(): number {
    return this.total;
  }

  /**
   * Retorna data formatada
   */
  public getFormattedDate(): string {
    return this.formattedDate;
  }

  /**
   * Retorna resumo do pedido
   */
  public getSummary(): {
    id: string;
    date: string;
    status: OrderStatus;
    statusText: string;
    total: string;
    totalItems: number;
    trackingCode?: string;
  } {
    return {
      id: this.id,
      date: this.formattedDate,
      status: this.status,
      statusText: this.statusText,
      total: this.formattedTotal,
      totalItems: this.totalItems,
      trackingCode: this.trackingCode,
    };
  }

  /**
   * Retorna total formatado
   */
  public getFormattedTotal(): string {
    return this.formattedTotal;
  }

  /**
   * Retorna subtotal formatado
   */
  public getFormattedSubtotal(): string {
    return this.formattedSubtotal;
  }

  /**
   * Retorna frete formatado
   */
  public getFormattedShipping(): string {
    return this.formattedShipping;
  }

  /**
   * Retorna desconto formatado
   */
  public getFormattedDiscount(): string {
    return this.formattedDiscount;
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

  // ========== MÉTODOS ESTÁTICOS ==========

  /**
   * Função auxiliar para extrair a imagem do produto
   * @param product - Produto
   * @returns URL da imagem
   */
  private static getProductImage(product: any): string {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image && typeof product.image === 'string') {
      return product.image;
    }
    return '/placeholder-image.jpg';
  }

  /**
   * Função auxiliar para extrair o nome da categoria
   * @param category - Categoria (pode ser objeto ou string)
   * @returns Nome da categoria como string
   */
  private static getCategoryName(category: any): string {
    if (!category) return 'Sem categoria';
    if (typeof category === 'string') return category;
    if (category.name && typeof category.name === 'string') return category.name;
    return 'Categoria';
  }

  /**
   * Cria um novo pedido a partir do carrinho
   */
  public static createFromCart(
    cartItems: { product: Product; quantity: number }[],
    subtotal: number,
    shipping: number,
    discount: number,
    total: number,
    userId?: number,
  ): Order {
    const now = new Date();
    const orderId = Order.generateOrderId(userId);
    const trackingCode = Order.generateTrackingCode();

    const orderProducts: OrderItem[] = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: this.getProductImage(item.product),  // ← usando a função auxiliar
      category: this.getCategoryName(item.product.category),  // ← convertendo categoria para string
      discount: item.product.discount,
    }));

    return new Order(
      orderId,
      now,
      "processing",
      subtotal,
      shipping,
      discount,
      total,
      orderProducts,
      trackingCode,
    );
  }

  /**
   * Gera um ID único para o pedido
   */
  public static generateOrderId(userId?: number): string {
    const now = new Date();
    const parts = {
      year: now.getFullYear(),
      month: String(now.getMonth() + 1).padStart(2, "0"),
      day: String(now.getDate()).padStart(2, "0"),
      hours: String(now.getHours()).padStart(2, "0"),
      minutes: String(now.getMinutes()).padStart(2, "0"),
      seconds: String(now.getSeconds()).padStart(2, "0"),
      random: Math.floor(Math.random() * 10000).toString().padStart(4, "0"),
    };

    // Se userId for fornecido, incluir no ID para melhor rastreabilidade
    if (userId) {
      return `ORD-${userId}-${parts.year}${parts.month}${parts.day}-${parts.hours}${parts.minutes}${parts.seconds}-${parts.random}`;
    }
    
    return `ORD-${parts.year}${parts.month}${parts.day}-${parts.hours}${parts.minutes}${parts.seconds}-${parts.random}`;
  }

  /**
   * Gera um código de rastreamento único
   */
  public static generateTrackingCode(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    
    const getRandomChar = (source: string): string => {
      return source[Math.floor(Math.random() * source.length)];
    };

    return [
      getRandomChar(letters),
      getRandomChar(letters),
      getRandomChar(numbers),
      getRandomChar(numbers),
      getRandomChar(letters),
      getRandomChar(numbers),
      getRandomChar(numbers),
      getRandomChar(numbers),
    ].join("");
  }

  /**
   * Cria um pedido a partir de um objeto salvo
   */
  public static fromJSON(data: {
    id: string;
    date: string;
    status: OrderStatus;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    products: OrderItem[];
    trackingCode?: string;
    paymentMethod?: string;
  }): Order {
    return new Order(
      data.id,
      new Date(data.date),
      data.status,
      data.subtotal,
      data.shipping,
      data.discount,
      data.total,
      data.products,
      data.trackingCode,
      data.paymentMethod,
    );
  }

  /**
   * Converte o pedido para objeto simples (para salvar no localStorage)
   */
  public toJSON(): {
    id: string;
    date: string;
    status: OrderStatus;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    products: OrderItem[];
    trackingCode?: string;
    paymentMethod?: string;
  } {
    return {
      id: this.id,
      date: this.date.toISOString(),
      status: this.status,
      subtotal: this.subtotal,
      shipping: this.shipping,
      discount: this.discount,
      total: this.total,
      products: this.products,
      trackingCode: this.trackingCode,
      paymentMethod: this.paymentMethod,
    };
  }
}