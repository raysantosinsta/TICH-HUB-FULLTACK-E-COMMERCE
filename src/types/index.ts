export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  discount: number
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}



