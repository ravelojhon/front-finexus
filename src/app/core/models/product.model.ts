// Interfaces para la API de productos

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  category?: string;
}

export interface ProductResponse {
  data: Product;
  message?: string;
}

export interface ProductsResponse {
  data: Product[];
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string[];
    message: string;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Estados de la aplicación
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Filtros para productos
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Paginación
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
