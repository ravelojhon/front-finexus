import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
}

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list-container">
      <div class="header">
        <h2>Lista de Productos</h2>
        <button class="btn btn-primary" (click)="navigateToNew()">
          Nuevo Producto
        </button>
      </div>

      <app-loading-spinner 
        [isLoading]="isLoading" 
        message="Cargando productos...">
      </app-loading-spinner>

      <div class="products-grid" *ngIf="!isLoading">
        <div class="product-card" *ngFor="let product of products">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <div class="product-details">
              <span class="price">{{ product.price | currency:'EUR' }}</span>
              <span class="category">{{ product.category }}</span>
              <span class="stock">Stock: {{ product.stock }}</span>
            </div>
          </div>
          <div class="product-actions">
            <button class="btn btn-sm btn-outline" (click)="viewProduct(product.id)">
              Ver
            </button>
            <button class="btn btn-sm btn-primary" (click)="editProduct(product.id)">
              Editar
            </button>
            <button class="btn btn-sm btn-danger" (click)="deleteProduct(product.id)">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!isLoading && products.length === 0">
        <p>No hay productos disponibles</p>
        <button class="btn btn-primary" (click)="navigateToNew()">
          Crear primer producto
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .description {
      color: #666;
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .price {
      font-weight: bold;
      color: #2c5aa0;
      font-size: 1.1rem;
    }

    .category, .stock {
      font-size: 0.9rem;
      color: #666;
    }

    .product-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-outline {
      background-color: transparent;
      border: 1px solid #007bff;
      color: #007bff;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-state p {
      margin-bottom: 1rem;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    // TODO: Implementar servicio para cargar productos
    setTimeout(() => {
      this.products = [
        {
          id: 1,
          name: 'Producto de Ejemplo',
          description: 'Descripción del producto de ejemplo',
          price: 29.99,
          category: 'Categoría A',
          stock: 10,
          createdAt: new Date()
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  navigateToNew(): void {
    this.router.navigate(['/products/new']);
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products/detail', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    // TODO: Implementar confirmación y eliminación
    console.log('Eliminar producto:', id);
  }
}
