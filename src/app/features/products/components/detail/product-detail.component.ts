import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-product-detail',
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

      <app-loading-spinner 
        [isLoading]="isLoading" 
        message="Cargando producto...">
      </app-loading-spinner>

      <div class="product-detail" *ngIf="!isLoading && product">
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
                  <span>{{ product.createdAt | dateFormat:'short' }}</span>
                </div>
                <div class="info-item">
                  <label>Actualizado:</label>
                  <span>{{ product.updatedAt | dateFormat:'short' }}</span>
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
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id));
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    // TODO: Implementar carga de producto por ID
    setTimeout(() => {
      this.product = {
        id: id,
        name: 'Producto de Ejemplo',
        description: 'Descripción detallada del producto de ejemplo que muestra toda la información disponible.',
        price: 29.99,
        category: 'Categoría A',
        stock: 5,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      };
      this.isLoading = false;
    }, 1000);
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }

  deleteProduct(): void {
    // TODO: Implementar confirmación y eliminación
    console.log('Eliminar producto:', this.product?.id);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
