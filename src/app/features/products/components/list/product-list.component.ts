import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

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
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-list-container">
      <div class="header">
        <h2>Lista de Productos</h2>
        <button class="btn btn-primary" (click)="navigateToNew()">
          Nuevo Producto
        </button>
      </div>

      <div class="loading-spinner" *ngIf="isLoading">
        <div class="spinner"></div>
        <p class="loading-text">Cargando productos...</p>
      </div>

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
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Los datos vienen del resolver, no necesitamos cargar manualmente
    this.route.data.subscribe(data => {
      if (data['products']) {
        this.products = data['products'];
        this.isLoading = false;
      }
    });
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