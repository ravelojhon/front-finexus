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
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
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