import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

import { environment } from '../../../../../environments/environment';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

// La interfaz Product ahora viene del modelo

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="product-detail-container">
      <div class="header">
        <h2>Detalle del Producto</h2>
        <div class="actions">
          <button class="btn btn-secondary" (click)="goBack()">
            Volver
          </button>
          <button class="btn btn-primary" (click)="editProduct()">
            Editar
          </button>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="isLoading">
        <div class="spinner"></div>
        <p class="loading-text">Cargando producto...</p>
      </div>

      <div class="error-message" *ngIf="hasError">
        <p>{{ errorMessage || 'Error al cargar el producto' }}</p>
        <button class="btn btn-primary" (click)="goBack()">Volver a la lista</button>
      </div>

      <div class="product-detail" *ngIf="!isLoading && !hasError && product">
        <div class="product-header">
          <h1>{{ product.name }}</h1>
          <span class="category-badge">{{ product.category }}</span>
        </div>

        <div class="product-content">
          <div class="product-info">
            <div class="info-section">
              <h3>Información General</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Precio:</label>
                  <span class="price">{{ product.price | currency:'EUR' }}</span>
                </div>
                <div class="info-item">
                  <label>Stock:</label>
                  <span class="stock" [class.low-stock]="product.stock < 10">
                    {{ product.stock }} unidades
                  </span>
                </div>
                <div class="info-item">
                  <label>Creado:</label>
                  <span>{{ product.createdAt | date:'short' }}</span>
                </div>
                <div class="info-item">
                  <label>Actualizado:</label>
                  <span>{{ product.updatedAt | date:'short' }}</span>
                </div>
              </div>
            </div>

            <div class="info-section" *ngIf="product.description">
              <h3>Descripción</h3>
              <p class="description">{{ product.description }}</p>
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-warning" (click)="editProduct()">
              Editar Producto
            </button>
            <button class="btn btn-danger" (click)="deleteProduct()">
              Eliminar Producto
            </button>
          </div>
        </div>
      </div>

      <div class="not-found" *ngIf="!isLoading && !product">
        <h3>Producto no encontrado</h3>
        <p>El producto que buscas no existe o ha sido eliminado.</p>
        <button class="btn btn-primary" (click)="goBack()">
          Volver a la lista
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
    }

    .product-detail {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .product-header {
      background: #f8f9fa;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .product-header h1 {
      margin: 0;
      color: #333;
    }

    .category-badge {
      background: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .product-content {
      padding: 2rem;
    }

    .info-section {
      margin-bottom: 2rem;
    }

    .info-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 0.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item label {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }

    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c5aa0;
    }

    .stock {
      font-weight: 500;
    }

    .stock.low-stock {
      color: #dc3545;
    }

    .description {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .product-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e9ecef;
    }

    .not-found {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .not-found h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-warning {
      background-color: #ffc107;
      color: #212529;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      margin-top: 1rem;
      color: #666;
      font-size: 0.9rem;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 8px;
      margin: 1rem 0;
      color: #721c24;
    }

    .error-message p {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .error-message .btn {
      padding: 0.75rem 1.5rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .error-message .btn:hover {
      background-color: #c82333;
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.http.get<Product>(`${environment.apiUrl}/products/${id}`).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        console.log('✅ Producto cargado:', product);
      },
      error: (error) => {
        console.error('❌ Error cargando producto:', error);
        this.errorMessage = 'Error al cargar el producto';
        this.isLoading = false;
      }
    });
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }

  deleteProduct(): void {
    if (this.product && confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.http.delete(`${environment.apiUrl}/products/${this.product.id}`).subscribe({
        next: () => {
          console.log('✅ Producto eliminado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('❌ Error eliminando producto:', error);
          this.errorMessage = 'Error al eliminar el producto';
        }
      });
    }
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
