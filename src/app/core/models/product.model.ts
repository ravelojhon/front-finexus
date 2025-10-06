/**
 * Modelo Product para tipado fuerte en toda la aplicación
 * Basado en la estructura de la API de FinExus
 * 
 * @author FinExus Team
 * @version 1.0.0
 */

/**
 * Interfaz principal del modelo Product
 * Representa un producto en el sistema FinExus
 */
export interface Product {
  /** ID único del producto (generado automáticamente) */
  id: number;
  
  /** Nombre del producto (requerido, mínimo 2 caracteres) */
  name: string;
  
  /** Precio del producto (requerido, mayor a 0) */
  price: number;
  
  /** Cantidad en stock (requerido, entero no negativo) */
  stock: number;
  
  /** Categoría del producto (opcional) */
  category?: string | null;
  
  /** Fecha de creación (ISO 8601) */
  createdAt: string;
  
  /** Fecha de última actualización (ISO 8601) */
  updatedAt: string;
}

/**
 * Interfaz para crear un nuevo producto
 * No incluye campos auto-generados como id, createdAt, updatedAt
 */
export interface CreateProduct {
  /** Nombre del producto (requerido) */
  name: string;
  
  /** Precio del producto (requerido) */
  price: number;
  
  /** Cantidad en stock (requerido) */
  stock: number;
  
  /** Categoría del producto (opcional) */
  category?: string;
}

/**
 * Interfaz para actualizar un producto existente
 * Todos los campos son opcionales excepto el id (que se pasa por parámetro)
 */
export interface UpdateProduct {
  /** Nombre del producto (opcional) */
  name?: string;
  
  /** Precio del producto (opcional) */
  price?: number;
  
  /** Cantidad en stock (opcional) */
  stock?: number;
  
  /** Categoría del producto (opcional) */
  category?: string;
}

/**
 * Interfaz para la respuesta estándar de la API
 */
export interface ApiResponse<T> {
  /** Datos de la respuesta */
  data: T;
  
  /** Mensaje opcional de la API */
  message?: string;
  
  /** Indica si la operación fue exitosa */
  success: boolean;
}

/**
 * Interfaz para errores de la API
 */
export interface ApiError {
  /** Mensaje principal del error */
  message: string;
  
  /** Errores de validación detallados (opcional) */
  errors?: Array<{
    /** Campo que tiene el error */
    field: string[];
    /** Mensaje específico del error */
    message: string;
  }>;
  
  /** Código de estado HTTP (opcional) */
  status?: number;
}

/**
 * Interfaz para filtros de búsqueda de productos
 */
export interface ProductFilters {
  /** Filtrar por categoría */
  category?: string;
  
  /** Precio mínimo */
  minPrice?: number;
  
  /** Precio máximo */
  maxPrice?: number;
  
  /** Búsqueda por texto (nombre) */
  search?: string;
}

/**
 * Interfaz para parámetros de paginación
 */
export interface PaginationParams {
  /** Número de página (empezando en 1) */
  page: number;
  
  /** Cantidad de elementos por página */
  limit: number;
  
  /** Campo por el cual ordenar (opcional) */
  sortBy?: string;
  
  /** Orden de clasificación (opcional) */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interfaz para respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
  /** Array de datos de la página actual */
  data: T[];
  
  /** Información de paginación */
  pagination: {
    /** Página actual */
    page: number;
    
    /** Elementos por página */
    limit: number;
    
    /** Total de elementos */
    total: number;
    
    /** Total de páginas */
    totalPages: number;
  };
}

/**
 * Enum para estados de carga
 */
export enum LoadingState {
  /** Estado inicial */
  IDLE = 'IDLE',
  
  /** Cargando datos */
  LOADING = 'LOADING',
  
  /** Carga exitosa */
  SUCCESS = 'SUCCESS',
  
  /** Error en la carga */
  ERROR = 'ERROR'
}

/**
 * Enum para categorías de productos
 */
export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  CLOTHING = 'Clothing',
  BOOKS = 'Books',
  HOME = 'Home',
  SPORTS = 'Sports',
  BEAUTY = 'Beauty',
  AUTOMOTIVE = 'Automotive',
  OTHER = 'Other'
}

/**
 * Clase de utilidad para validaciones de Product
 */
export class ProductValidator {
  /**
   * Valida si un producto tiene todos los campos requeridos
   */
  static isValid(product: Partial<Product>): boolean {
    return !!(
      product.name &&
      product.name.length >= 2 &&
      product.price &&
      product.price > 0 &&
      product.stock !== undefined &&
      product.stock >= 0
    );
  }

  /**
   * Valida si un CreateProduct tiene todos los campos requeridos
   */
  static isValidCreateProduct(product: Partial<CreateProduct>): boolean {
    return !!(
      product.name &&
      product.name.length >= 2 &&
      product.price &&
      product.price > 0 &&
      product.stock !== undefined &&
      product.stock >= 0
    );
  }

  /**
   * Valida si un UpdateProduct tiene al menos un campo para actualizar
   */
  static isValidUpdateProduct(product: Partial<UpdateProduct>): boolean {
    return !!(
      product.name ||
      product.price !== undefined ||
      product.stock !== undefined ||
      product.category !== undefined
    );
  }

  /**
   * Formatea el precio para mostrar
   */
  static formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  /**
   * Valida el stock disponible
   */
  static isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  /**
   * Obtiene el estado del stock como string
   */
  static getStockStatus(product: Product): string {
    if (product.stock === 0) return 'Sin stock';
    if (product.stock <= 5) return 'Stock bajo';
    if (product.stock <= 20) return 'Stock medio';
    return 'Stock alto';
  }
}
