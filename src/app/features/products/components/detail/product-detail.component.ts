import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../../../core/services/product.service';
import { Product, LoadingState } from '../../../../core/models/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id));
    } else {
      this.errorMessage = 'ID de producto no válido';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.productService.getById(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.isLoading = false;
        console.log('✅ Producto cargado:', product);
      },
      error: (error: any) => {
        console.error('❌ Error cargando producto:', error);
        this.errorMessage = this.getErrorMessage(error);
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
      this.productService.delete(this.product.id).subscribe({
        next: () => {
          console.log('✅ Producto eliminado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (error: any) => {
          console.error('❌ Error eliminando producto:', error);
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  getDaysSinceCreation(): number {
    if (!this.product) return 0;
    const created = new Date(this.product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (error?.status === 404) {
      return 'Producto no encontrado';
    }
    if (error?.status === 400) {
      return 'ID de producto inválido';
    }
    if (error?.status >= 500) {
      return 'Error del servidor. Intenta nuevamente';
    }
    return 'Error inesperado al cargar el producto';
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
