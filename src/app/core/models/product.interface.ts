/**
 * Interfaz Product para tipado fuerte en toda la aplicación
 * Basada en la estructura de la API de FinExus
 */
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interfaz para crear un nuevo producto (sin campos auto-generados)
 */
export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
}

/**
 * Interfaz para actualizar un producto (todos los campos opcionales excepto id)
 */
export interface UpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

/**
 * Interfaz para la respuesta de la API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Interfaz para errores de la API
 */
export interface ApiError {
  message: string;
  errors?: Array<{
    field: string[];
    message: string;
  }>;
  status?: number;
}

/**
 * Interfaz para filtros de productos
 */
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

/**
 * Interfaz para paginación
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interfaz para respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Enum para estados de carga
 */
export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
