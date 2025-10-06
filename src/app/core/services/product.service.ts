import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, retry, timeout, finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { 
  Product, 
  CreateProduct, 
  UpdateProduct, 
  ApiResponse, 
  ApiError,
  ProductFilters,
  PaginationParams,
  PaginatedResponse
} from '../models/product.interface';

/**
 * Servicio para manejar operaciones CRUD de productos
 * Consume la API REST de FinExus
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.apiUrl;
  private readonly timeout = environment.apiTimeout || 10000;

  // Estado global de productos
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  // Estado de carga
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Cache de productos
  private productsCache = new Map<string, Product[]>();
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor(private http: HttpClient) {
    this.log('ProductService inicializado', { baseUrl: this.baseUrl });
  }

  /**
   * Obtener todos los productos
   * @param filters Filtros opcionales para la búsqueda
   * @param forceRefresh Forzar actualización sin usar cache
   * @returns Observable<Product[]>
   */
  getAll(filters?: ProductFilters, forceRefresh = false): Observable<Product[]> {
    const cacheKey = this.generateCacheKey(filters);
    const now = Date.now();

    // Verificar cache si no es refresh forzado
    if (!forceRefresh && this.productsCache.has(cacheKey)) {
      const cachedData = this.productsCache.get(cacheKey)!;
      const isCacheValid = (now - this.lastFetchTime) < this.CACHE_DURATION;
      
      if (isCacheValid) {
        this.log('Productos obtenidos del cache', { count: cachedData.length });
        this.productsSubject.next(cachedData);
        return of(cachedData);
      }
    }

    this.setLoading(true);
    this.log('Obteniendo productos de la API', { filters });

    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params })
      .pipe(
        timeout(this.timeout),
        retry(2),
        tap(products => {
          this.productsCache.set(cacheKey, products);
          this.productsSubject.next(products);
          this.lastFetchTime = now;
          this.log('Productos cargados exitosamente', { count: products.length });
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Obtener producto por ID
   * @param id ID del producto
   * @returns Observable<Product>
   */
  getById(id: number): Observable<Product> {
    this.setLoading(true);
    this.log('Obteniendo producto por ID', { id });

    return this.http.get<Product>(`${this.baseUrl}/products/${id}`)
      .pipe(
        timeout(this.timeout),
        retry(2),
        tap(product => {
          this.log('Producto obtenido exitosamente', { id, name: product.name });
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Crear nuevo producto
   * @param product Datos del producto a crear
   * @returns Observable<Product>
   */
  create(product: CreateProduct): Observable<Product> {
    this.setLoading(true);
    this.log('Creando nuevo producto', { name: product.name });

    return this.http.post<Product>(`${this.baseUrl}/products`, product)
      .pipe(
        timeout(this.timeout),
        tap(newProduct => {
          // Actualizar cache local
          this.updateProductsCache(newProduct, 'create');
          this.log('Producto creado exitosamente', { id: newProduct.id, name: newProduct.name });
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Actualizar producto existente
   * @param id ID del producto a actualizar
   * @param product Datos del producto a actualizar
   * @returns Observable<Product>
   */
  update(id: number, product: UpdateProduct): Observable<Product> {
    this.setLoading(true);
    this.log('Actualizando producto', { id, updates: product });

    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, product)
      .pipe(
        timeout(this.timeout),
        tap(updatedProduct => {
          // Actualizar cache local
          this.updateProductsCache(updatedProduct, 'update');
          this.log('Producto actualizado exitosamente', { id, name: updatedProduct.name });
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Eliminar producto
   * @param id ID del producto a eliminar
   * @returns Observable<void>
   */
  delete(id: number): Observable<void> {
    this.setLoading(true);
    this.log('Eliminando producto', { id });

    return this.http.delete<void>(`${this.baseUrl}/products/${id}`)
      .pipe(
        timeout(this.timeout),
        tap(() => {
          // Actualizar cache local
          this.updateProductsCache({ id } as Product, 'delete');
          this.log('Producto eliminado exitosamente', { id });
        }),
        catchError(this.handleError.bind(this)),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Verificar estado de la API
   * @returns Observable<{ message: string }>
   */
  checkHealth(): Observable<{ message: string }> {
    this.log('Verificando estado de la API');
    return this.http.get<{ message: string }>(`${this.baseUrl}`)
      .pipe(
        timeout(5000),
        tap(response => this.log('API saludable', response)),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Verificar conexión con base de datos
   * @returns Observable<{ count: number }>
   */
  checkDatabase(): Observable<{ count: number }> {
    this.log('Verificando conexión con base de datos');
    return this.http.get<{ count: number }>(`${this.baseUrl}/products/test`)
      .pipe(
        timeout(5000),
        tap(response => this.log('Conexión con BD exitosa', response)),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Limpiar cache de productos
   */
  clearCache(): void {
    this.productsCache.clear();
    this.lastFetchTime = 0;
    this.productsSubject.next([]);
    this.log('Cache de productos limpiado');
  }

  /**
   * Obtener productos actuales del estado
   * @returns Product[]
   */
  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }

  /**
   * Verificar si está cargando
   * @returns boolean
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  // Métodos privados

  /**
   * Establecer estado de carga
   * @param loading Estado de carga
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Generar clave de cache basada en filtros
   * @param filters Filtros aplicados
   * @returns string
   */
  private generateCacheKey(filters?: ProductFilters): string {
    if (!filters) return 'default';
    return Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
  }

  /**
   * Actualizar cache local de productos
   * @param product Producto afectado
   * @param operation Tipo de operación
   */
  private updateProductsCache(product: Product, operation: 'create' | 'update' | 'delete'): void {
    const currentProducts = this.productsSubject.value;

    switch (operation) {
      case 'create':
        this.productsSubject.next([...currentProducts, product]);
        break;
      case 'update':
        this.productsSubject.next(
          currentProducts.map(p => p.id === product.id ? product : p)
        );
        break;
      case 'delete':
        this.productsSubject.next(
          currentProducts.filter(p => p.id !== product.id)
        );
        break;
    }

    // Actualizar cache
    this.productsCache.set('default', this.productsSubject.value);
    this.log('Cache actualizado', { operation, productId: product.id });
  }

  /**
   * Manejar errores de la API (simplificado - el ErrorInterceptor maneja la UI)
   * @param error Error HTTP
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.setLoading(false);
    
    // Solo log del error, el ErrorInterceptor se encarga de mostrar el toast
    this.log('Error en ProductService', { 
      status: error.status, 
      message: error.message,
      url: error.url 
    });
    
    return throwError(() => error);
  }

  /**
   * Logging para debugging
   * @param message Mensaje del log
   * @param data Datos adicionales
   */
  private log(message: string, data?: any): void {
    if (environment.enableLogging) {
      console.log(`[ProductService] ${message}`, data || '');
    }
  }
}