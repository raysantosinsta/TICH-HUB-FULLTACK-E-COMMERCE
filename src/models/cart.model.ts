import type { Product } from "../types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export class Cart {
  public items: CartItem[];

  constructor(items: CartItem[] = []) {
    this.items = items;
  }

  // Adicionar item ao carrinho
  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  // Remover item do carrinho
  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }

  // Atualizar quantidade de um item
  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  // Limpar todo o carrinho
  clearCart(): void {
    this.items = [];
  }

  // Verificar se produto existe no carrinho
  hasProduct(productId: number): boolean {
    return this.items.some((item) => item.product.id === productId);
  }

  // Obter quantidade de um produto específico
  getQuantity(productId: number): number {
    const item = this.items.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  }

  // Calcular total de itens
  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Calcular subtotal (soma dos preços sem descontos)
  getSubtotal(): number {
    return this.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  // Calcular desconto total (se tiver desconto no produto)
  getTotalDiscount(): number {
    return this.items.reduce((total, item) => {
      const discount = (item.product.discount || 0) * item.product.price;
      return total + discount * item.quantity;
    }, 0);
  }

  // Calcular total com desconto
  getTotalWithDiscount(): number {
    return this.getSubtotal() - this.getTotalDiscount();
  }

  // Obter todos os itens
  getAllItems(): CartItem[] {
    return [...this.items];
  }

  // Criar cópia do carrinho
  clone(): Cart {
    return new Cart(
      this.items.map((item) => ({
        product: { ...item.product },
        quantity: item.quantity,
      })),
    );
  }

  // Mesclar com outro carrinho (útil para login)
  mergeWith(otherCart: Cart): void {
    otherCart.items.forEach((item) => {
      this.addItem(item.product, item.quantity);
    });
  }

  // Converter para objeto simples (para salvar no localStorage)
  toJSON(): { items: CartItem[] } {
    return {
      items: this.items,
    };
  }

  // Criar carrinho a partir de objeto salvo
  static fromJSON(data: { items: CartItem[] }): Cart {
    return new Cart(data.items);
  }
}
