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
  deletingProductId: number | null = null; // Para mostrar estado de eliminación
  
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
    // Buscar el producto para mostrar información en la confirmación
    const product = this.products.find(p => p.id === id);
    if (!product) {
      console.error('❌ Producto no encontrado para eliminar');
      return;
    }

    // Diálogo de confirmación mejorado con información del producto
    const priceFormatted = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(product.price);
    
    const confirmMessage = `¿Estás seguro de que quieres eliminar el producto "${product.name}"?\n\n` +
                          `ID: #${product.id}\n` +
                          `Precio: ${priceFormatted}\n` +
                          `Stock: ${product.stock} unidades\n\n` +
                          `Esta acción no se puede deshacer.`;

    if (confirm(confirmMessage)) {
      this.deletingProductId = id; // Marcar como eliminando
      this.clearError(); // Limpiar errores previos

      this.productService.delete(id).subscribe({
        next: () => {
          console.log('✅ Producto eliminado exitosamente:', product.name);
          this.deletingProductId = null; // Limpiar estado de eliminación
          // El ProductService ya actualiza automáticamente la lista
        },
        error: (error: any) => {
          console.error('❌ Error eliminando producto:', error);
          this.deletingProductId = null; // Limpiar estado de eliminación
          this.errorMessage = this.getDeleteErrorMessage(error, product.name);
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

  isDeletingProduct(id: number): boolean {
    return this.deletingProductId === id;
  }

  private clearError(): void {
    this.errorMessage = '';
  }

  private getDeleteErrorMessage(error: any, productName: string): string {
    if (error?.message) {
      return `Error al eliminar "${productName}": ${error.message}`;
    }
    if (error?.status === 404) {
      return `El producto "${productName}" no existe o ya fue eliminado`;
    }
    if (error?.status === 403) {
      return `No tienes permisos para eliminar el producto "${productName}"`;
    }
    if (error?.status >= 500) {
      return `Error del servidor al eliminar "${productName}". Intenta nuevamente`;
    }
    return `Error inesperado al eliminar "${productName}". Intenta nuevamente`;
  }
}