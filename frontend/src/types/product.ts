export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
