import axios from 'axios';
import type { Product, ProductInput } from '../types/product';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Tambahkan Token JWT dari localStorage ke Authorization Header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Tangani Respon Error (seperti 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Jika token tidak valid / expired saat mengakses resource terproteksi
      // Token bisa dibersihkan jika diperlukan
      if (localStorage.getItem('token')) {
        console.warn('Sesi login telah kedaluwarsa atau token tidak valid.');
      }
    }
    return Promise.reject(error);
  }
);

// =================== AUTH SERVICES ===================

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  return res.data;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/auth/register', credentials);
  return res.data;
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const res = await apiClient.get<{ user: User }>('/api/auth/me');
  return res.data;
};

// =================== PRODUCT SERVICES ===================

export const getProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>('/api/products');
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await apiClient.get<Product>(`/api/products/${id}`);
  return res.data;
};

export const createProduct = async (productData: ProductInput): Promise<Product> => {
  const res = await apiClient.post<Product>('/api/products', productData);
  return res.data;
};

export const updateProduct = async (id: string, productData: Partial<ProductInput>): Promise<Product> => {
  const res = await apiClient.put<Product>(`/api/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/products/${id}`);
};

export interface BuyResponse {
  message: string;
  product: Product;
  purchasedQuantity: number;
  totalCost: number;
}

export const buyProduct = async (id: string, quantity: number): Promise<BuyResponse> => {
  const res = await apiClient.post<BuyResponse>(`/api/products/${id}/buy`, { quantity });
  return res.data;
};
