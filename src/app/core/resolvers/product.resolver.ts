import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductService } from '../services/product.service';
import { Product } from '../models/product.interface';

// Resolver para la lista de productos
export const productsResolver: ResolveFn<Product[]> = (route, state): Observable<Product[]> => {
  const productService = inject(ProductService);
  const router = inject(Router);

  return productService.getAll().pipe(
    catchError(error => {
      console.error('Error cargando productos:', error);
      router.navigate(['/products']);
      return throwError(() => error);
    })
  );
};

// Resolver para un producto específico
export const productResolver: ResolveFn<Product> = (route, state): Observable<Product> => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  
  if (!id || isNaN(Number(id))) {
    router.navigate(['/products']);
    return throwError(() => new Error('ID de producto inválido'));
  }

  return productService.getById(Number(id)).pipe(
    catchError(error => {
      console.error('Error cargando producto:', error);
      router.navigate(['/products']);
      return throwError(() => error);
    })
  );
};
