import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product, CreateProduct, UpdateProduct } from '../../../../core/models/product.interface';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 100.50,
    stock: 10,
    category: 'Test Category',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getById', 'create', 'update'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.productForm).toBeDefined();
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.productForm.get('description')?.value).toBe('');
      expect(component.productForm.get('price')?.value).toBeNull();
      expect(component.productForm.get('stock')?.value).toBeNull();
      expect(component.productForm.get('category')?.value).toBe('');
    });

    it('should be invalid when form is empty', () => {
      expect(component.productForm.valid).toBeFalsy();
    });

    it('should be invalid when required fields are empty', () => {
      component.productForm.patchValue({
        name: '',
        price: null,
        stock: null
      });

      expect(component.productForm.valid).toBeFalsy();
      expect(component.productForm.get('name')?.hasError('required')).toBeTruthy();
      expect(component.productForm.get('price')?.hasError('required')).toBeTruthy();
      expect(component.productForm.get('stock')?.hasError('required')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should be valid with all required fields filled', () => {
      component.productForm.patchValue({
        name: 'Test Product',
        price: 100.50,
        stock: 10
      });

      expect(component.productForm.valid).toBeTruthy();
    });

    it('should validate name field', () => {
      const nameControl = component.productForm.get('name');

      // Test required validation
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBeTruthy();

      // Test minLength validation
      nameControl?.setValue('A');
      expect(nameControl?.hasError('minlength')).toBeTruthy();

      // Test maxLength validation
      nameControl?.setValue('A'.repeat(101));
      expect(nameControl?.hasError('maxlength')).toBeTruthy();

      // Test whitespace validation
      nameControl?.setValue('   ');
      expect(nameControl?.hasError('whitespace')).toBeTruthy();

      // Test valid value
      nameControl?.setValue('Valid Product Name');
      expect(nameControl?.valid).toBeTruthy();
    });

    it('should validate price field', () => {
      const priceControl = component.productForm.get('price');

      // Test required validation
      priceControl?.setValue(null);
      expect(priceControl?.hasError('required')).toBeTruthy();

      // Test min validation
      priceControl?.setValue(0);
      expect(priceControl?.hasError('min')).toBeTruthy();

      // Test max validation
      priceControl?.setValue(1000000);
      expect(priceControl?.hasError('max')).toBeTruthy();

      // Test decimal validation
      priceControl?.setValue(10.123);
      expect(priceControl?.hasError('decimal')).toBeTruthy();

      // Test valid value
      priceControl?.setValue(100.50);
      expect(priceControl?.valid).toBeTruthy();
    });

    it('should validate stock field', () => {
      const stockControl = component.productForm.get('stock');

      // Test required validation
      stockControl?.setValue(null);
      expect(stockControl?.hasError('required')).toBeTruthy();

      // Test min validation
      stockControl?.setValue(-1);
      expect(stockControl?.hasError('min')).toBeTruthy();

      // Test max validation
      stockControl?.setValue(100000);
      expect(stockControl?.hasError('max')).toBeTruthy();

      // Test pattern validation (integers only)
      stockControl?.setValue(10.5);
      expect(stockControl?.hasError('pattern')).toBeTruthy();

      // Test valid value
      stockControl?.setValue(10);
      expect(stockControl?.valid).toBeTruthy();
    });

    it('should validate description field (optional)', () => {
      const descriptionControl = component.productForm.get('description');

      // Test maxLength validation
      descriptionControl?.setValue('A'.repeat(501));
      expect(descriptionControl?.hasError('maxlength')).toBeTruthy();

      // Test valid value (empty is allowed)
      descriptionControl?.setValue('');
      expect(descriptionControl?.valid).toBeTruthy();

      // Test valid value (with content)
      descriptionControl?.setValue('Valid description');
      expect(descriptionControl?.valid).toBeTruthy();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
      mockProductService.getById.and.returnValue(of(mockProduct));
    });

    it('should load product data in edit mode', () => {
      component.ngOnInit();

      expect(component.isEditMode).toBeTruthy();
      expect(component.productId).toBe(1);
      expect(mockProductService.getById).toHaveBeenCalledWith(1);
    });

    it('should patch form with product data', () => {
      component.ngOnInit();

      expect(component.productForm.get('name')?.value).toBe(mockProduct.name);
      expect(component.productForm.get('description')?.value).toBe(mockProduct.description);
      expect(component.productForm.get('price')?.value).toBe(mockProduct.price);
      expect(component.productForm.get('stock')?.value).toBe(mockProduct.stock);
      expect(component.productForm.get('category')?.value).toBe(mockProduct.category);
    });

    it('should handle error when loading product', () => {
      const error = { status: 404, message: 'Product not found' };
      mockProductService.getById.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(component.errorMessage).toBe('Product not found');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.productForm.patchValue({
        name: 'Test Product',
        description: 'Test Description',
        price: 100.50,
        stock: 10,
        category: 'Test Category'
      });
    });

    it('should create product when form is valid and not in edit mode', () => {
      const createData: CreateProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100.50,
        stock: 10,
        category: 'Test Category'
      };

      mockProductService.create.and.returnValue(of(mockProduct));

      component.onSubmit();

      expect(mockProductService.create).toHaveBeenCalledWith(createData);
    });

    it('should update product when form is valid and in edit mode', () => {
      component.isEditMode = true;
      component.productId = 1;

      const updateData: UpdateProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100.50,
        stock: 10,
        category: 'Test Category'
      };

      mockProductService.update.and.returnValue(of(mockProduct));

      component.onSubmit();

      expect(mockProductService.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should not submit when form is invalid', () => {
      component.productForm.patchValue({
        name: '', // Invalid: empty name
        price: null, // Invalid: null price
        stock: null // Invalid: null stock
      });

      component.onSubmit();

      expect(mockProductService.create).not.toHaveBeenCalled();
      expect(mockProductService.update).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Por favor, corrige los errores en el formulario');
    });

    it('should handle create success', () => {
      mockProductService.create.and.returnValue(of(mockProduct));

      component.onSubmit();

      expect(component.successMessage).toBe('Producto creado exitosamente');
    });

    it('should handle update success', () => {
      component.isEditMode = true;
      component.productId = 1;
      mockProductService.update.and.returnValue(of(mockProduct));

      component.onSubmit();

      expect(component.successMessage).toBe('Producto actualizado exitosamente');
    });

    it('should handle create error', () => {
      const error = { status: 400, message: 'Validation error' };
      mockProductService.create.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorMessage).toBe('Validation error');
    });

    it('should handle update error', () => {
      component.isEditMode = true;
      component.productId = 1;
      const error = { status: 404, message: 'Product not found' };
      mockProductService.update.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorMessage).toBe('Product not found');
    });
  });

  describe('Form Utilities', () => {
    it('should check if field is invalid', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(component.isFieldInvalid('name')).toBeTruthy();
    });

    it('should check if field is valid', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('Valid Name');
      nameControl?.markAsTouched();

      expect(component.isFieldValid('name')).toBeTruthy();
    });

    it('should get field error message', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      const errorMessage = component.getFieldError('name');
      expect(errorMessage).toBe('Este campo es obligatorio');
    });

    it('should reset form', () => {
      component.productForm.patchValue({
        name: 'Test Product',
        price: 100.50
      });

      component.resetForm();

      // After reset, form should return to initial values
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.productForm.get('price')?.value).toBeNull();
      expect(component.productForm.get('description')?.value).toBe('');
      expect(component.productForm.get('stock')?.value).toBeNull();
      expect(component.productForm.get('category')?.value).toBe('');
    });

    it('should clear error message', () => {
      component.errorMessage = 'Test error';
      component.clearError();
      expect(component.errorMessage).toBe('');
    });

    it('should clear success message', () => {
      component.successMessage = 'Test success';
      component.clearSuccess();
      expect(component.successMessage).toBe('');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to products list', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});
