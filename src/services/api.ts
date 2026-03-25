import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

export const api = {
  async getAllProducts() {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },

  async getProductById(id: number) {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  async getProductsByCategory(category: string) {
    const response = await axios.get(`${API_BASE_URL}/products/category/${category}`);
    return response.data;
  },

  async getAllCategories() {
    const response = await axios.get(`${API_BASE_URL}/products/categories`);
    return response.data;
  }
};