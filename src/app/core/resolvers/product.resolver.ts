import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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

// Resolver para la lista de productos
export const productsResolver: ResolveFn<Product[]> = (route, state): Observable<Product[]> => {
  // Simular carga de datos desde API
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Producto de Ejemplo 1',
      description: 'Descripción del producto de ejemplo 1',
      price: 29.99,
      category: 'Categoría A',
      stock: 10,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 2,
      name: 'Producto de Ejemplo 2',
      description: 'Descripción del producto de ejemplo 2',
      price: 49.99,
      category: 'Categoría B',
      stock: 5,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-21')
    }
  ];

  return of(mockProducts).pipe(delay(500)); // Simular delay de red
};

// Resolver para un producto específico
export const productResolver: ResolveFn<Product> = (route, state): Observable<Product> => {
  const id = route.paramMap.get('id');
  
  if (!id || isNaN(Number(id))) {
    throw new Error('ID de producto inválido');
  }

  // Simular carga de producto específico
  const mockProduct: Product = {
    id: Number(id),
    name: `Producto ${id}`,
    description: `Descripción detallada del producto ${id}`,
    price: 29.99,
    category: 'Categoría A',
    stock: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  };

  return of(mockProduct).pipe(delay(300));
};
