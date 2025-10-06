import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ProductService } from './product.service';
import { Product, CreateProduct, UpdateProduct } from '../models/product.interface';
import { environment } from '../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return products from API', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Test Product',
          description: 'Test Description',
          price: 100.50,
          stock: 10,
          category: 'Test Category',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      ];

      service.getAll().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle API errors', (done) => {
      const errorMessage = 'Server error';

      service.getAll().subscribe({
        next: () => {
          fail('should have failed');
          done();
        },
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should use cache when available', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Cached Product',
          description: 'Cached Description',
          price: 50.00,
          stock: 5,
          category: 'Cached Category',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      ];

      // First call - should hit API
      service.getAll().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req1 = httpMock.expectOne(`${baseUrl}/products`);
      req1.flush(mockProducts);

      // Second call - should use cache
      service.getAll().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      // Should not make another HTTP request
      httpMock.expectNone(`${baseUrl}/products`);
    });
  });

  describe('getById', () => {
    it('should return product by ID', () => {
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

      service.getById(1).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/products/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle 404 error for non-existent product', (done) => {
      service.getById(999).subscribe({
        next: () => {
          fail('should have failed');
          done();
        },
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create new product', () => {
      const newProduct: CreateProduct = {
        name: 'New Product',
        description: 'New Description',
        price: 75.00,
        stock: 15,
        category: 'New Category'
      };

      const createdProduct: Product = {
        id: 2,
        name: 'New Product',
        description: 'New Description',
        price: 75.00,
        stock: 15,
        category: 'New Category',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      service.create(newProduct).subscribe(product => {
        expect(product).toEqual(createdProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(createdProduct);
    });

    it('should handle validation errors', () => {
      const invalidProduct: CreateProduct = {
        name: '', // Invalid: empty name
        price: -10, // Invalid: negative price
        stock: -5, // Invalid: negative stock
        category: 'Test Category'
      };

      service.create(invalidProduct).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      req.flush('Validation Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should update existing product', () => {
      const productId = 1;
      const updateData: UpdateProduct = {
        name: 'Updated Product',
        price: 150.00
      };

      const updatedProduct: Product = {
        id: 1,
        name: 'Updated Product',
        description: 'Test Description',
        price: 150.00,
        stock: 10,
        category: 'Test Category',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z'
      };

      service.update(productId, updateData).subscribe(product => {
        expect(product).toEqual(updatedProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/products/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedProduct);
    });

    it('should handle update errors', () => {
      const productId = 1;
      const updateData: UpdateProduct = {
        name: 'Updated Product'
      };

      service.update(productId, updateData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products/${productId}`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('delete', () => {
    it('should delete product', () => {
      const productId = 1;

      service.delete(productId).subscribe(response => {
        expect(response).toBeNull(); // DELETE returns null
      });

      const req = httpMock.expectOne(`${baseUrl}/products/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
    });

    it('should handle delete errors', () => {
      const productId = 1;

      service.delete(productId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products/${productId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('checkHealth', () => {
    it('should check API health', () => {
      const healthResponse = { message: 'API OK' };

      service.checkHealth().subscribe(response => {
        expect(response).toEqual(healthResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(healthResponse);
    });
  });

  describe('checkDatabase', () => {
    it('should check database connection', () => {
      const dbResponse = { count: 5 };

      service.checkDatabase().subscribe(response => {
        expect(response).toEqual(dbResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/products/test`);
      expect(req.request.method).toBe('GET');
      req.flush(dbResponse);
    });
  });

  describe('utility methods', () => {
    it('should clear cache', () => {
      service.clearCache();
      expect(service.getCurrentProducts()).toEqual([]);
    });

    it('should return current products', () => {
      const products = service.getCurrentProducts();
      expect(Array.isArray(products)).toBeTruthy();
    });

    it('should check loading state', () => {
      const isLoading = service.isLoading();
      expect(typeof isLoading).toBe('boolean');
    });
  });
});
