import type { Product } from "../types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export class Cart {
  private _items: CartItem[];

  constructor(items: CartItem[] = []) {
    this._items = items;
  }

  // ========== GETTERS ==========
  
  /** Retorna todos os itens do carrinho (cópia) */
  public get items(): CartItem[] {
    return [...this._items];
  }

  /** Retorna os itens internos (para compatibilidade) */
  public get itemsArray(): CartItem[] {
    return this._items;
  }

  /** Verifica se o carrinho está vazio */
  public get isEmpty(): boolean {
    return this._items.length === 0;
  }

  /** Calcula o total de itens no carrinho */
  public get totalItems(): number {
    return this._items.reduce((total, item) => total + item.quantity, 0);
  }

  /** Calcula o subtotal (soma dos preços sem descontos) */
  public get subtotal(): number {
    return this._items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  /** Calcula o desconto total aplicado */
  public get totalDiscount(): number {
    return this._items.reduce((total, item) => {
      const discount = (item.product.discount || 0) * item.product.price;
      return total + discount * item.quantity;
    }, 0);
  }

  /** Calcula o total com descontos aplicados */
  public get total(): number {
    return this.subtotal - this.totalDiscount;
  }

  // ========== MÉTODOS PÚBLICOS ==========

  /**
   * Adiciona um produto ao carrinho
   * @param product - Produto a ser adicionado
   * @param quantity - Quantidade (padrão: 1)
   */
  public addItem(product: Product, quantity: number = 1): void {
    if (quantity <= 0) return;

    const existingItem = this.findItemByProductId(product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this._items.push({ product, quantity });
    }
  }

  /**
   * Remove um produto do carrinho pelo ID
   * @param productId - ID do produto a ser removido
   */
  public removeItem(productId: number): void {
    this._items = this._items.filter((item) => item.product.id !== productId);
  }

  /**
   * Atualiza a quantidade de um produto no carrinho
   * @param productId - ID do produto
   * @param quantity - Nova quantidade
   */
  public updateQuantity(productId: number, quantity: number): void {
    const item = this.findItemByProductId(productId);
    
    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
    }
  }

  /** Remove todos os itens do carrinho */
  public clearCart(): void {
    this._items = [];
  }

  /**
   * Verifica se um produto está no carrinho
   * @param productId - ID do produto
   */
  public hasProduct(productId: number): boolean {
    return this.findItemByProductId(productId) !== undefined;
  }

  /**
   * Obtém a quantidade de um produto no carrinho
   * @param productId - ID do produto
   */
  public getQuantity(productId: number): number {
    const item = this.findItemByProductId(productId);
    return item?.quantity ?? 0;
  }

  /**
   * Obtém um item do carrinho pelo ID do produto
   * @param productId - ID do produto
   */
  public getItem(productId: number): CartItem | undefined {
    return this.findItemByProductId(productId);
  }

  /** Retorna todos os itens do carrinho */
  public getAllItems(): CartItem[] {
    return [...this._items];
  }

  // ========== MÉTODOS DE COMPATIBILIDADE (alias) ==========

  /** @deprecated Use `totalItems` getter */
  public getTotalItems(): number {
    return this.totalItems;
  }

  /** @deprecated Use `subtotal` getter */
  public getSubtotal(): number {
    return this.subtotal;
  }

  /** @deprecated Use `totalDiscount` getter */
  public getTotalDiscount(): number {
    return this.totalDiscount;
  }

  /** @deprecated Use `total` getter */
  public getTotalWithDiscount(): number {
    return this.total;
  }

  /**
   * Mescla este carrinho com outro
   * @param otherCart - Outro carrinho a ser mesclado
   */
  public mergeWith(otherCart: Cart): void {
    otherCart.getAllItems().forEach((item) => {
      this.addItem(item.product, item.quantity);
    });
  }

  /** Cria uma cópia profunda do carrinho */
  public clone(): Cart {
    const clonedItems = this._items.map((item) => ({
      product: { ...item.product },
      quantity: item.quantity,
    }));
    return new Cart(clonedItems);
  }

  // ========== MÉTODOS DE UTILIDADE ==========

  /** Converte o carrinho para JSON (para salvar no localStorage) */
  public toJSON(): { items: CartItem[] } {
    return { items: this._items };
  }

  /** Retorna uma representação em string do carrinho */
  public toString(): string {
    return JSON.stringify(this.toJSON());
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Busca um item no carrinho pelo ID do produto
   * @param productId - ID do produto
   * @returns O item encontrado ou undefined
   */
  private findItemByProductId(productId: number): CartItem | undefined {
    return this._items.find((item) => item.product.id === productId);
  }

  // ========== MÉTODOS ESTÁTICOS ==========

  /**
   * Cria um carrinho a partir de um objeto salvo
   * @param data - Objeto com os dados do carrinho
   */
  public static fromJSON(data: { items: CartItem[] }): Cart {
    return new Cart(data.items);
  }

  /**
   * Cria um carrinho vazio
   */
  public static createEmpty(): Cart {
    return new Cart([]);
  }
}