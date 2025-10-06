import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, retry, timeout } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { 
  Product, 
  ProductInput, 
  ApiResponse, 
  ApiError, 
  LoadingState,
  ProductFilters,
  PaginationParams,
  PaginatedResponse
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.apiUrl;
  private readonly timeout = environment.apiTimeout;

  // Estado global de productos
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  // Estado de carga
  private loadingSubject = new BehaviorSubject<LoadingState>(LoadingState.IDLE);
  public loading$ = this.loadingSubject.asObservable();

  // Cache de productos
  private productsCache = new Map<string, Product[]>();
  private lastFetchTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los productos con cache y filtros
   */
  getProducts(filters?: ProductFilters, forceRefresh = false): Observable<Product[]> {
    const cacheKey = this.generateCacheKey(filters);
    const now = Date.now();

    // Verificar cache si no es refresh forzado
    if (!forceRefresh && this.productsCache.has(cacheKey)) {
      const cachedData = this.productsCache.get(cacheKey)!;
      const isCacheValid = (now - this.lastFetchTime) < this.CACHE_DURATION;
      
      if (isCacheValid) {
        this.productsSubject.next(cachedData);
        return of(cachedData);
      }
    }

    this.setLoadingState(LoadingState.LOADING);

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
          this.setLoadingState(LoadingState.SUCCESS);
          
          if (environment.enableLogging) {
            console.log('✅ Productos cargados:', products.length);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Obtener producto por ID
   */
  getProductById(id: number): Observable<Product> {
    this.setLoadingState(LoadingState.LOADING);

    return this.http.get<Product>(`${this.baseUrl}/products/${id}`)
      .pipe(
        timeout(this.timeout),
        retry(2),
        tap(product => {
          this.setLoadingState(LoadingState.SUCCESS);
          if (environment.enableLogging) {
            console.log('✅ Producto obtenido:', product);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Crear nuevo producto
   */
  createProduct(productData: ProductInput): Observable<Product> {
    this.setLoadingState(LoadingState.LOADING);

    return this.http.post<Product>(`${this.baseUrl}/products`, productData)
      .pipe(
        timeout(this.timeout),
        tap(newProduct => {
          // Actualizar cache local
          this.updateProductsCache(newProduct, 'create');
          this.setLoadingState(LoadingState.SUCCESS);
          
          if (environment.enableLogging) {
            console.log('✅ Producto creado:', newProduct);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Actualizar producto existente
   */
  updateProduct(id: number, productData: Partial<ProductInput>): Observable<Product> {
    this.setLoadingState(LoadingState.LOADING);

    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, productData)
      .pipe(
        timeout(this.timeout),
        tap(updatedProduct => {
          // Actualizar cache local
          this.updateProductsCache(updatedProduct, 'update');
          this.setLoadingState(LoadingState.SUCCESS);
          
          if (environment.enableLogging) {
            console.log('✅ Producto actualizado:', updatedProduct);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Eliminar producto
   */
  deleteProduct(id: number): Observable<void> {
    this.setLoadingState(LoadingState.LOADING);

    return this.http.delete<void>(`${this.baseUrl}/products/${id}`)
      .pipe(
        timeout(this.timeout),
        tap(() => {
          // Actualizar cache local
          this.updateProductsCache({ id } as Product, 'delete');
          this.setLoadingState(LoadingState.SUCCESS);
          
          if (environment.enableLogging) {
            console.log('✅ Producto eliminado:', id);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Verificar estado de la API
   */
  checkApiHealth(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.baseUrl}`)
      .pipe(
        timeout(5000),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Verificar conexión con base de datos
   */
  checkDatabaseConnection(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/products/test`)
      .pipe(
        timeout(5000),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Limpiar cache
   */
  clearCache(): void {
    this.productsCache.clear();
    this.lastFetchTime = 0;
    this.productsSubject.next([]);
  }

  /**
   * Obtener estado actual de productos
   */
  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }

  /**
   * Verificar si está cargando
   */
  isLoading(): boolean {
    return this.loadingSubject.value === LoadingState.LOADING;
  }

  // Métodos privados

  private setLoadingState(state: LoadingState): void {
    this.loadingSubject.next(state);
  }

  private generateCacheKey(filters?: ProductFilters): string {
    if (!filters) return 'default';
    return Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
  }

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
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.setLoadingState(LoadingState.ERROR);

    let errorMessage = 'Ha ocurrido un error inesperado';
    let errorDetails: ApiError | null = null;

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          errorDetails = error.error;
          break;
        case 404:
          errorMessage = 'Producto no encontrado';
          break;
        case 409:
          errorMessage = 'Conflicto: El producto ya existe';
          break;
        case 422:
          errorMessage = 'Error de validación';
          errorDetails = error.error;
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    if (environment.enableLogging) {
      console.error('❌ Error en ProductService:', {
        message: errorMessage,
        details: errorDetails,
        status: error.status,
        url: error.url
      });
    }

    return throwError(() => ({
      message: errorMessage,
      details: errorDetails,
      status: error.status,
      originalError: error
    }));
  }
}
