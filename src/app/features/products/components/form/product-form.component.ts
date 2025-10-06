import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../../../core/services/product.service';
import { Product, CreateProduct, UpdateProduct, LoadingState } from '../../../../core/models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-6">
          <!-- Header -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-0">
                  <i class="fas fa-{{ isEditMode ? 'edit' : 'plus' }} me-2"></i>
                  {{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}
                </h2>
                <button class="btn btn-outline-secondary" (click)="goBack()">
                  <i class="fas fa-arrow-left me-1"></i>
                  Volver
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div class="card shadow-sm" *ngIf="isLoading">
            <div class="card-body text-center py-5">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="text-muted">{{ isEditMode ? 'Cargando producto...' : 'Preparando formulario...' }}</p>
            </div>
          </div>

          <!-- Error State -->
          <div class="alert alert-danger" *ngIf="hasError" role="alert">
            <div class="d-flex align-items-center">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <div class="flex-grow-1">
                <strong>Error:</strong> {{ errorMessage }}
              </div>
              <button class="btn btn-outline-danger btn-sm" (click)="clearError()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Success Message -->
          <div class="alert alert-success" *ngIf="successMessage" role="alert">
            <div class="d-flex align-items-center">
              <i class="fas fa-check-circle me-2"></i>
              <div class="flex-grow-1">
                <strong>Éxito:</strong> {{ successMessage }}
              </div>
              <button class="btn btn-outline-success btn-sm" (click)="clearSuccess()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="card shadow-sm" *ngIf="!isLoading">
            <div class="card-body p-4">
              <form [formGroup]="productForm" (ngSubmit)="onSubmit()" novalidate>
                <!-- Nombre -->
                <div class="mb-4">
                  <label for="name" class="form-label">
                    <i class="fas fa-tag me-1"></i>
                    Nombre del Producto <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    formControlName="name" 
                    class="form-control"
                    [class.is-invalid]="isFieldInvalid('name')"
                    [class.is-valid]="isFieldValid('name')"
                    placeholder="Ingresa el nombre del producto"
                    autocomplete="off">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                    <i class="fas fa-exclamation-circle me-1"></i>
                    {{ getFieldError('name') }}
                  </div>
                  <div class="valid-feedback" *ngIf="isFieldValid('name')">
                    <i class="fas fa-check-circle me-1"></i>
                    Nombre válido
                  </div>
                </div>

                <!-- Descripción -->
                <div class="mb-4">
                  <label for="description" class="form-label">
                    <i class="fas fa-align-left me-1"></i>
                    Descripción
                    <small class="text-muted">(Opcional)</small>
                  </label>
                  <textarea 
                    id="description" 
                    formControlName="description" 
                    class="form-control"
                    rows="4"
                    placeholder="Describe las características del producto"
                    [class.is-valid]="isFieldValid('description')">
                  </textarea>
                  <div class="form-text">
                    <i class="fas fa-info-circle me-1"></i>
                    Proporciona detalles adicionales sobre el producto
                  </div>
                </div>

                <!-- Precio y Stock -->
                <div class="row mb-4">
                  <div class="col-md-6">
                    <label for="price" class="form-label">
                      <i class="fas fa-euro-sign me-1"></i>
                      Precio <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">€</span>
                      <input 
                        type="number" 
                        id="price" 
                        formControlName="price" 
                        class="form-control"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        [class.is-invalid]="isFieldInvalid('price')"
                        [class.is-valid]="isFieldValid('price')">
                      <div class="invalid-feedback" *ngIf="isFieldInvalid('price')">
                        <i class="fas fa-exclamation-circle me-1"></i>
                        {{ getFieldError('price') }}
                      </div>
                      <div class="valid-feedback" *ngIf="isFieldValid('price')">
                        <i class="fas fa-check-circle me-1"></i>
                        Precio válido
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="stock" class="form-label">
                      <i class="fas fa-boxes me-1"></i>
                      Stock <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="number" 
                      id="stock" 
                      formControlName="stock" 
                      class="form-control"
                      min="0"
                      placeholder="0"
                      [class.is-invalid]="isFieldInvalid('stock')"
                      [class.is-valid]="isFieldValid('stock')">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('stock')">
                      <i class="fas fa-exclamation-circle me-1"></i>
                      {{ getFieldError('stock') }}
                    </div>
                    <div class="valid-feedback" *ngIf="isFieldValid('stock')">
                      <i class="fas fa-check-circle me-1"></i>
                      Stock válido
                    </div>
                  </div>
                </div>

                <!-- Categoría -->
                <div class="mb-4">
                  <label for="category" class="form-label">
                    <i class="fas fa-folder me-1"></i>
                    Categoría
                    <small class="text-muted">(Opcional)</small>
                  </label>
                  <select 
                    id="category" 
                    formControlName="category" 
                    class="form-select"
                    [class.is-invalid]="isFieldInvalid('category')"
                    [class.is-valid]="isFieldValid('category')">
                    <option value="">Seleccionar categoría</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Toys">Toys</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('category')">
                    <i class="fas fa-exclamation-circle me-1"></i>
                    {{ getFieldError('category') }}
                  </div>
                  <div class="valid-feedback" *ngIf="isFieldValid('category')">
                    <i class="fas fa-check-circle me-1"></i>
                    Categoría válida
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="d-flex gap-3 justify-content-end">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    (click)="goBack()"
                    [disabled]="isLoading">
                    <i class="fas fa-times me-1"></i>
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-warning" 
                    (click)="resetForm()"
                    [disabled]="isLoading || productForm.pristine">
                    <i class="fas fa-undo me-1"></i>
                    Limpiar
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="productForm.invalid || isLoading">
                    <i class="fas fa-{{ isLoading ? 'spinner fa-spin' : (isEditMode ? 'save' : 'plus') }} me-1"></i>
                    {{ isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .form-control, .form-select {
      border-radius: 0.5rem;
      border: 1px solid #ced4da;
      transition: all 0.15s ease-in-out;
    }

    .form-control:focus, .form-select:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .form-control.is-invalid, .form-select.is-invalid {
      border-color: #dc3545;
    }

    .form-control.is-valid, .form-select.is-valid {
      border-color: #198754;
    }

    .invalid-feedback {
      display: block;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .valid-feedback {
      display: block;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-text {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }

    .input-group-text {
      background-color: #f8f9fa;
      border: 1px solid #ced4da;
      color: #495057;
      font-weight: 500;
    }

    .btn {
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.15s ease-in-out;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }

    .btn:active {
      transform: translateY(0);
    }

    .card {
      border: 1px solid #e9ecef;
      border-radius: 0.75rem;
    }

    .card-header {
      border-bottom: 1px solid #e9ecef;
      border-radius: 0.75rem 0.75rem 0 0 !important;
    }

    .alert {
      border-radius: 0.5rem;
      border: none;
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
    }

    // Animaciones
    @keyframes fadeIn {
      from { 
        opacity: 0; 
        transform: translateY(10px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

    .card {
      animation: fadeIn 0.3s ease-in-out;
    }

    // Responsive
    @media (max-width: 768px) {
      .d-flex.gap-3 {
        flex-direction: column;
        gap: 0.5rem !important;
      }
      
      .d-flex.gap-3 .btn {
        width: 100%;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  productId: number | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        this.noWhitespaceValidator
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]],
      price: [null, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(999999.99),
        this.decimalValidator
      ]],
      stock: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(99999),
        Validators.pattern(/^\d+$/)
      ]],
      category: ['']
    });
  }

  // Validadores personalizados
  private noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  private decimalValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && !/^\d+(\.\d{1,2})?$/.test(control.value.toString())) {
      return { decimal: true };
    }
    return null;
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
    this.clearMessages();
    
    this.productService.getById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock: product.stock,
          category: product.category || ''
        });
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

  onSubmit(): void {
    if (this.productForm.valid) {
      this.clearMessages();
      const formData = this.productForm.value;
      
      if (this.isEditMode && this.productId) {
        this.updateProduct(this.productId, formData);
      } else {
        this.createProduct(formData);
      }
    } else {
      this.productForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrige los errores en el formulario';
    }
  }

  private createProduct(productData: CreateProduct): void {
    this.isLoading = true;
    
    this.productService.create(productData).subscribe({
      next: (newProduct: Product) => {
        console.log('✅ Producto creado:', newProduct);
        this.successMessage = 'Producto creado exitosamente';
        this.isLoading = false;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.goBack();
        }, 2000);
      },
      error: (error: any) => {
        console.error('❌ Error creando producto:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  private updateProduct(id: number, productData: UpdateProduct): void {
    this.isLoading = true;
    
    this.productService.update(id, productData).subscribe({
      next: (updatedProduct: Product) => {
        console.log('✅ Producto actualizado:', updatedProduct);
        this.successMessage = 'Producto actualizado exitosamente';
        this.isLoading = false;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.goBack();
        }, 2000);
      },
      error: (error: any) => {
        console.error('❌ Error actualizando producto:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  // Métodos de utilidad para validaciones
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;
    
    if (errors['required']) {
      return 'Este campo es obligatorio';
    }
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    if (errors['min']) {
      return `Valor mínimo: ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Valor máximo: ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return 'Formato inválido';
    }
    if (errors['whitespace']) {
      return 'No puede contener solo espacios en blanco';
    }
    if (errors['decimal']) {
      return 'Formato decimal inválido (ej: 10.50)';
    }
    
    return 'Valor inválido';
  }

  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (error?.status === 400) {
      return 'Datos inválidos. Verifica la información ingresada';
    }
    if (error?.status === 404) {
      return 'Producto no encontrado';
    }
    if (error?.status === 409) {
      return 'Ya existe un producto con este nombre';
    }
    if (error?.status >= 500) {
      return 'Error del servidor. Intenta nuevamente';
    }
    return 'Error inesperado. Intenta nuevamente';
  }

  resetForm(): void {
    this.productForm.reset();
    this.clearMessages();
  }

  clearError(): void {
    this.errorMessage = '';
  }

  clearSuccess(): void {
    this.successMessage = '';
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get hasSuccess(): boolean {
    return !!this.successMessage;
  }
}
