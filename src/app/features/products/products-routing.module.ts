import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './components/list/product-list.component';
import { ProductFormComponent } from './components/form/product-form.component';
import { ProductDetailComponent } from './components/detail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    title: 'Lista de Productos'
  },
  {
    path: 'new',
    component: ProductFormComponent,
    title: 'Nuevo Producto'
  },
  {
    path: 'edit/:id',
    component: ProductFormComponent,
    title: 'Editar Producto'
  },
  {
    path: 'detail/:id',
    component: ProductDetailComponent,
    title: 'Detalle del Producto'
  },
  {
    path: ':id',
    component: ProductDetailComponent,
    title: 'Detalle del Producto'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
