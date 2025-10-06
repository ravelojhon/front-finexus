import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../core/models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="product-form-container">
      <div class="header">
        <h2>{{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
        <button class="btn btn-secondary" (click)="goBack()">
          Volver
        </button>
      </div>

      <div class="error-message" *ngIf="hasError">
        <p>{{ errorMessage || 'Error al procesar la solicitud' }}</p>
      </div>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-group">
          <label for="name">Nombre del Producto *</label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            class="form-control"
            [class.error]="productForm.get('name')?.invalid && productForm.get('name')?.touched">
          <div class="error-message" *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched">
            El nombre es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea 
            id="description" 
            formControlName="description" 
            class="form-control"
            rows="4">
          </textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Precio *</label>
            <input 
              type="number" 
              id="price" 
              formControlName="price" 
              class="form-control"
              step="0.01"
              min="0"
              [class.error]="productForm.get('price')?.invalid && productForm.get('price')?.touched">
            <div class="error-message" *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched">
              El precio es requerido y debe ser mayor a 0
            </div>
          </div>

          <div class="form-group">
            <label for="stock">Stock *</label>
            <input 
              type="number" 
              id="stock" 
              formControlName="stock" 
              class="form-control"
              min="0"
              [class.error]="productForm.get('stock')?.invalid && productForm.get('stock')?.touched">
            <div class="error-message" *ngIf="productForm.get('stock')?.invalid && productForm.get('stock')?.touched">
              El stock es requerido y debe ser mayor o igual a 0
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="category">Categoría *</label>
          <select 
            id="category" 
            formControlName="category" 
            class="form-control"
            [class.error]="productForm.get('category')?.invalid && productForm.get('category')?.touched">
            <option value="">Seleccionar categoría</option>
            <option value="Categoría A">Categoría A</option>
            <option value="Categoría B">Categoría B</option>
            <option value="Categoría C">Categoría C</option>
          </select>
          <div class="error-message" *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched">
            La categoría es requerida
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="goBack()">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="productForm.invalid || isLoading">
            {{ isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .product-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn:hover:not(:disabled) {
      opacity: 0.9;
    }
  `]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  productId: number | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = parseInt(id);
      this.loadProduct(this.productId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.http.get<Product>(`${environment.apiUrl}/products/${id}`).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock: product.stock,
          category: product.category || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando producto:', error);
        this.errorMessage = 'Error al cargar el producto';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      
      if (this.isEditMode && this.productId) {
        this.updateProduct(this.productId, formData);
      } else {
        this.createProduct(formData);
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  private createProduct(productData: any): void {
    this.isLoading = true;
    this.http.post<Product>(`${environment.apiUrl}/products`, productData).subscribe({
      next: (newProduct) => {
        console.log('✅ Producto creado:', newProduct);
        this.isLoading = false;
        this.goBack();
      },
      error: (error) => {
        console.error('❌ Error creando producto:', error);
        this.errorMessage = 'Error al crear el producto';
        this.isLoading = false;
      }
    });
  }

  private updateProduct(id: number, productData: any): void {
    this.isLoading = true;
    this.http.put<Product>(`${environment.apiUrl}/products/${id}`, productData).subscribe({
      next: (updatedProduct) => {
        console.log('✅ Producto actualizado:', updatedProduct);
        this.isLoading = false;
        this.goBack();
      },
      error: (error) => {
        console.error('❌ Error actualizando producto:', error);
        this.errorMessage = 'Error al actualizar el producto';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }
}
