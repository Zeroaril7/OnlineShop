import axios from 'axios';
import type { Product, ProductInput } from '../types/product';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
const PRODUCTS_URL = `${API_BASE_URL}/api/products`;

export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(PRODUCTS_URL);
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await axios.get<Product>(`${PRODUCTS_URL}/${id}`);
  return res.data;
};

export const createProduct = async (productData: ProductInput): Promise<Product> => {
  const res = await axios.post<Product>(PRODUCTS_URL, productData);
  return res.data;
};

export const updateProduct = async (id: string, productData: Partial<ProductInput>): Promise<Product> => {
  const res = await axios.put<Product>(`${PRODUCTS_URL}/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${PRODUCTS_URL}/${id}`);
};
