// src/types/index.ts

// Interface para Categoria (agora é um OBJETO, não string)
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  creationAt?: string;
  updatedAt?: string;
}

// Interface para Rating (mantida)
export interface Rating {
  rate: number;
  count: number;
}

// Interface Principal do Produto (AJUSTADA para sua API real)
export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  
  // category agora é um OBJETO (não string)
  category: Category;                    // ← Mudança principal aqui
  
  // Sua API usa "images" (array), não "image"
  images: string[];                      // ← Array de imagens
  
  // Campos opcionais que aparecem na sua API
  creationAt?: string;
  updatedAt?: string;
  
  // Campos extras que podem aparecer em alguns produtos
  rating?: Rating;
  discount?: number;
}

// Estado do Store de Produtos
export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  categories: Category[];   // Adicionado para facilitar filtros
}