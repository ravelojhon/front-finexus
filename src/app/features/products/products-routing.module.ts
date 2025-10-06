import { Routes } from '@angular/router';
import { productGuard, productFormGuard } from '../../core/guards/product.guard';
import { productsResolver, productResolver } from '../../core/resolvers/product.resolver';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/list/product-list.component').then(m => m.ProductListComponent),
    title: 'Lista de Productos',
    canActivate: [productGuard],
    resolve: { products: productsResolver },
    data: { preload: true, priority: 'high' }
  },
  {
    path: 'new',
    loadComponent: () => import('./components/form/product-form.component').then(m => m.ProductFormComponent),
    title: 'Nuevo Producto',
    canActivate: [productGuard],
    data: { preload: false, priority: 'medium' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/form/product-form.component').then(m => m.ProductFormComponent),
    title: 'Editar Producto',
    canActivate: [productFormGuard],
    resolve: { product: productResolver },
    data: { preload: false, priority: 'medium' }
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./components/detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Detalle del Producto',
    canActivate: [productGuard],
    resolve: { product: productResolver },
    data: { preload: true, priority: 'high' }
  },
  {
    path: ':id',
    loadComponent: () => import('./components/detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Detalle del Producto',
    canActivate: [productGuard],
    resolve: { product: productResolver },
    data: { preload: true, priority: 'high' }
  }
];
