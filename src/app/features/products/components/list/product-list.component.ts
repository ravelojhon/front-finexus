import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../../../core/services/product.service';
import { Product, LoadingState } from '../../../../core/models/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="mb-0">
              <i class="fas fa-boxes me-2"></i>
              Lista de Productos
            </h2>
            <button class="btn btn-primary" (click)="navigateToNew()">
              <i class="fas fa-plus me-2"></i>
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" *ngIf="isLoading">
        <div class="col-12">
          <div class="d-flex justify-content-center align-items-center py-5">
            <div class="text-center">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="text-muted">Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div class="row" *ngIf="hasError">
        <div class="col-12">
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <div class="flex-grow-1">
              <strong>Error:</strong> {{ errorMessage || 'Error al cargar los productos' }}
            </div>
            <button class="btn btn-outline-danger btn-sm" (click)="refreshProducts()">
              <i class="fas fa-redo me-1"></i>
              Reintentar
            </button>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="row" *ngIf="!isLoading && !hasError">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="fas fa-list me-2"></i>
                  Productos ({{ products.length }})
                </h5>
                <div class="btn-group" role="group">
                  <button class="btn btn-outline-secondary btn-sm" (click)="refreshProducts()">
                    <i class="fas fa-sync-alt me-1"></i>
                    Actualizar
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <!-- Desktop Table -->
              <div class="table-responsive d-none d-lg-block">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th scope="col" class="border-0">ID</th>
                      <th scope="col" class="border-0">Nombre</th>
                      <th scope="col" class="border-0">Categoría</th>
                      <th scope="col" class="border-0 text-end">Precio</th>
                      <th scope="col" class="border-0 text-center">Stock</th>
                      <th scope="col" class="border-0 text-center">Estado</th>
                      <th scope="col" class="border-0 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let product of products; trackBy: trackByProductId">
                      <td class="align-middle">
                        <span class="badge bg-secondary">#{{ product.id }}</span>
                      </td>
                      <td class="align-middle">
                        <div>
                          <strong>{{ product.name }}</strong>
                          <small class="text-muted d-block" *ngIf="product.description">
                            {{ product.description | slice:0:50 }}{{ product.description.length > 50 ? '...' : '' }}
                          </small>
                        </div>
                      </td>
                      <td class="align-middle">
                        <span class="badge bg-info" *ngIf="product.category; else noCategory">
                          {{ product.category }}
                        </span>
                        <ng-template #noCategory>
                          <span class="text-muted">Sin categoría</span>
                        </ng-template>
                      </td>
                      <td class="align-middle text-end">
                        <strong class="text-success">{{ product.price | currency:'EUR':'symbol':'1.2-2' }}</strong>
                      </td>
                      <td class="align-middle text-center">
                        <span class="badge" 
                              [class.bg-success]="product.stock > 10"
                              [class.bg-warning]="product.stock > 0 && product.stock <= 10"
                              [class.bg-danger]="product.stock === 0">
                          {{ product.stock }}
                        </span>
                      </td>
                      <td class="align-middle text-center">
                        <span class="badge" 
                              [class.bg-success]="product.stock > 0"
                              [class.bg-danger]="product.stock === 0">
                          {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
                        </span>
                      </td>
                      <td class="align-middle text-center">
                        <div class="btn-group" role="group">
                          <button class="btn btn-outline-primary btn-sm" 
                                  (click)="viewProduct(product.id)"
                                  title="Ver detalles">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-warning btn-sm" 
                                  (click)="editProduct(product.id)"
                                  title="Editar">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-danger btn-sm" 
                                  (click)="deleteProduct(product.id)"
                                  title="Eliminar">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="d-lg-none">
                <div class="p-3" *ngFor="let product of products; trackBy: trackByProductId">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title mb-0">{{ product.name }}</h6>
                        <span class="badge bg-secondary">#{{ product.id }}</span>
                      </div>
                      
                      <p class="card-text text-muted small mb-2" *ngIf="product.description">
                        {{ product.description | slice:0:80 }}{{ product.description.length > 80 ? '...' : '' }}
                      </p>
                      
                      <div class="row mb-3">
                        <div class="col-6">
                          <small class="text-muted">Categoría:</small>
                          <div>
                            <span class="badge bg-info" *ngIf="product.category; else noCategoryMobile">
                              {{ product.category }}
                            </span>
                            <ng-template #noCategoryMobile>
                              <span class="text-muted small">Sin categoría</span>
                            </ng-template>
                          </div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Stock:</small>
                          <div>
                            <span class="badge" 
                                  [class.bg-success]="product.stock > 10"
                                  [class.bg-warning]="product.stock > 0 && product.stock <= 10"
                                  [class.bg-danger]="product.stock === 0">
                              {{ product.stock }} {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="d-flex justify-content-between align-items-center">
                        <strong class="text-success h5 mb-0">
                          {{ product.price | currency:'EUR':'symbol':'1.2-2' }}
                        </strong>
                        <div class="btn-group" role="group">
                          <button class="btn btn-outline-primary btn-sm" 
                                  (click)="viewProduct(product.id)"
                                  title="Ver">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-warning btn-sm" 
                                  (click)="editProduct(product.id)"
                                  title="Editar">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-danger btn-sm" 
                                  (click)="deleteProduct(product.id)"
                                  title="Eliminar">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="row" *ngIf="!isLoading && !hasError && products.length === 0">
        <div class="col-12">
          <div class="text-center py-5">
            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">No hay productos disponibles</h4>
            <p class="text-muted mb-4">Comienza creando tu primer producto</p>
            <button class="btn btn-primary" (click)="navigateToNew()">
              <i class="fas fa-plus me-2"></i>
              Crear primer producto
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table td {
      vertical-align: middle;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .btn-group .btn {
      border-radius: 0.375rem;
      margin: 0 1px;
    }

    .btn-group .btn:first-child {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }

    .btn-group .btn:last-child {
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }

    .card {
      border: 1px solid #e9ecef;
      transition: all 0.15s ease-in-out;
    }

    .card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    .table-hover tbody tr:hover {
      background-color: rgba(0, 123, 255, 0.05);
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
    }

    .alert {
      border-radius: 0.5rem;
    }

    .btn {
      transition: all 0.15s ease-in-out;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn:active {
      transform: translateY(0);
    }

    /* Mobile optimizations */
    @media (max-width: 991.98px) {
      .card-body {
        padding: 1rem;
      }
      
      .btn-group .btn {
        padding: 0.375rem 0.5rem;
        font-size: 0.8rem;
      }
    }

    /* Loading animation */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .table tbody tr {
      animation: fadeIn 0.3s ease-in-out;
    }

    .card {
      animation: fadeIn 0.3s ease-in-out;
    }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToProductService();
  }

  private subscribeToProductService(): void {
    // Suscribirse a los observables del ProductService
    this.productService.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe((products: Product[]) => {
        this.products = products;
      });

    this.productService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.isLoading = loading;
      });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products: Product[]) => {
        console.log('✅ Productos cargados:', products);
      },
      error: (error: any) => {
        console.error('❌ Error cargando productos:', error);
        this.errorMessage = 'Error al cargar los productos';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToNew(): void {
    this.router.navigate(['/products/new']);
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          console.log('✅ Producto eliminado exitosamente');
          // El ProductService ya actualiza automáticamente la lista
        },
        error: (error: any) => {
          console.error('❌ Error eliminando producto:', error);
          this.errorMessage = 'Error al eliminar el producto';
        }
      });
    }
  }

  refreshProducts(): void {
    this.productService.getAll({}, true).subscribe(); // Force reload
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }
}