import type { Product } from "../types";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  discount?: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export class Order {
  public id: string;
  public date: Date;
  public status: OrderStatus;
  public subtotal: number;
  public shipping: number;
  public discount: number;
  public total: number;
  public products: OrderItem[];
  public trackingCode?: string;
  public paymentMethod?: string;

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

  // Criar um novo pedido a partir do carrinho
  static createFromCart(
    cartItems: { product: Product; quantity: number }[],
    subtotal: number,
    shipping: number,
    discount: number,
    total: number,
    userId?: number,
  ): Order {
    const now = new Date();
    const orderId = Order.generateOrderId(userId);

    // Converter produtos do carrinho para OrderItem
    const orderProducts: OrderItem[] = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      category: item.product.category,
      discount: item.product.discount,
    }));

    const trackingCode = Order.generateTrackingCode();

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

  // Gerar ID do pedido
  static generateOrderId(userId?: number): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
  }

  // Gerar código de rastreamento
  static generateTrackingCode(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "";

    // 2 letras
    for (let i = 0; i < 2; i++) {
      code += letters[Math.floor(Math.random() * letters.length)];
    }

    // 2 números
    for (let i = 0; i < 2; i++) {
      code += numbers[Math.floor(Math.random() * numbers.length)];
    }

    // 1 letra
    code += letters[Math.floor(Math.random() * letters.length)];

    // 3 números
    for (let i = 0; i < 3; i++) {
      code += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return code;
  }

  // Atualizar status do pedido
  updateStatus(status: OrderStatus): void {
    this.status = status;
  }

  // Verificar se o pedido pode ser cancelado
  canCancel(): boolean {
    return this.status === "pending" || this.status === "processing";
  }

  // Verificar se o pedido foi entregue
  isDelivered(): boolean {
    return this.status === "delivered";
  }

  // Verificar se o pedido está em andamento
  isInProgress(): boolean {
    return this.status === "processing" || this.status === "shipped";
  }

  // Obter o progresso do pedido (0-100)
  getProgress(): number {
    const progressMap: Record<OrderStatus, number> = {
      pending: 0,
      processing: 25,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
    };
    return progressMap[this.status];
  }

  // Obter texto do status formatado
  getStatusText(): string {
    const statusMap: Record<OrderStatus, string> = {
      pending: "Aguardando pagamento",
      processing: "Processando",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return statusMap[this.status];
  }

  // Obter cor do status
  getStatusColor(): string {
    const colorMap: Record<OrderStatus, string> = {
      pending: "#ffc107",
      processing: "#2196f3",
      shipped: "#4caf50",
      delivered: "#9c27b0",
      cancelled: "#ff6b6b",
    };
    return colorMap[this.status];
  }

  // Obter background do status
  getStatusBg(): string {
    const bgMap: Record<OrderStatus, string> = {
      pending: "rgba(255, 193, 7, 0.1)",
      processing: "rgba(33, 150, 243, 0.1)",
      shipped: "rgba(76, 175, 80, 0.1)",
      delivered: "rgba(156, 39, 176, 0.1)",
      cancelled: "rgba(255, 107, 107, 0.1)",
    };
    return bgMap[this.status];
  }

  // Obter total de itens no pedido
  getTotalItems(): number {
    return this.products.reduce((total, item) => total + item.quantity, 0);
  }

  // Obter subtotal (sem descontos e frete)
  getSubtotal(): number {
    return this.subtotal;
  }

  // Obter total com desconto e frete
  getTotal(): number {
    return this.total;
  }

  // Obter data formatada
  getFormattedDate(): string {
    return this.date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Obter resumo do pedido para exibição
  getSummary(): {
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
      date: this.getFormattedDate(),
      status: this.status,
      statusText: this.getStatusText(),
      total: this.getFormattedTotal(),
      totalItems: this.getTotalItems(),
      trackingCode: this.trackingCode,
    };
  }

  // Obter total formatado
  getFormattedTotal(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.total);
  }

  // Obter subtotal formatado
  getFormattedSubtotal(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.subtotal);
  }

  // Obter frete formatado
  getFormattedShipping(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.shipping);
  }

  // Obter desconto formatado
  getFormattedDiscount(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.discount);
  }

  // Converter para objeto simples (para salvar no localStorage)
  toJSON(): {
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

  // Criar pedido a partir de objeto salvo
  static fromJSON(data: {
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
}
