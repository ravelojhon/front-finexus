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
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
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
