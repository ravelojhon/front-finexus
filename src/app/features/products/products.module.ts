import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';

import { ProductListComponent } from './components/list/product-list.component';
import { ProductFormComponent } from './components/form/product-form.component';
import { ProductDetailComponent } from './components/detail/product-detail.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
