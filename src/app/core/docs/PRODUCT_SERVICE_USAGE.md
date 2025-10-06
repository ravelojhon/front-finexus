# 📦 ProductService - Guía de Uso

## Descripción
El `ProductService` es un servicio Angular que proporciona métodos CRUD completos para gestionar productos, consumiendo la API REST de FinExus.

## Características
- ✅ **Métodos CRUD completos** - getAll, getById, create, update, delete
- ✅ **Tipado fuerte** - Interfaces TypeScript para todos los datos
- ✅ **Manejo de errores robusto** - Gestión centralizada de errores
- ✅ **Cache inteligente** - Optimización de rendimiento
- ✅ **Estados reactivos** - BehaviorSubjects para estado global
- ✅ **Logging detallado** - Debugging facilitado
- ✅ **Retry automático** - Reintentos en caso de fallo
- ✅ **Timeout configurable** - Prevención de requests colgados

## Interfaces Principales

### Product
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### CreateProduct
```typescript
interface CreateProduct {
  name: string;
  price: number;
  stock: number;
  category?: string;
}
```

### UpdateProduct
```typescript
interface UpdateProduct {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
}
```

## Métodos Disponibles

### 1. getAll(filters?, forceRefresh?)
```typescript
// Obtener todos los productos
this.productService.getAll().subscribe(products => {
  console.log('Productos:', products);
});

// Con filtros
const filters: ProductFilters = {
  category: 'Electronics',
  minPrice: 100
};
this.productService.getAll(filters).subscribe(products => {
  console.log('Productos filtrados:', products);
});

// Forzar actualización
this.productService.getAll(undefined, true).subscribe(products => {
  console.log('Productos actualizados:', products);
});
```

### 2. getById(id)
```typescript
// Obtener producto por ID
this.productService.getById(1).subscribe(product => {
  console.log('Producto:', product);
});
```

### 3. create(product)
```typescript
// Crear nuevo producto
const newProduct: CreateProduct = {
  name: 'Laptop Gaming',
  price: 1200.50,
  stock: 10,
  category: 'Electronics'
};

this.productService.create(newProduct).subscribe(product => {
  console.log('Producto creado:', product);
});
```

### 4. update(id, product)
```typescript
// Actualizar producto existente
const updates: UpdateProduct = {
  name: 'Laptop Gaming Pro',
  price: 1500.00,
  stock: 8
};

this.productService.update(1, updates).subscribe(product => {
  console.log('Producto actualizado:', product);
});
```

### 5. delete(id)
```typescript
// Eliminar producto
this.productService.delete(1).subscribe(() => {
  console.log('Producto eliminado');
});
```

## Estados Reactivos

### products$ - Observable de productos
```typescript
// Suscribirse a cambios en la lista de productos
this.productService.products$.subscribe(products => {
  console.log('Lista de productos actualizada:', products);
});
```

### loading$ - Observable de estado de carga
```typescript
// Suscribirse al estado de carga
this.productService.loading$.subscribe(loading => {
  if (loading) {
    console.log('Cargando...');
  } else {
    console.log('Carga completada');
  }
});
```

## Utilidades

### Verificar estado de la API
```typescript
this.productService.checkHealth().subscribe(response => {
  console.log('API Status:', response.message);
});
```

### Verificar conexión con BD
```typescript
this.productService.checkDatabase().subscribe(response => {
  console.log('Productos en BD:', response.count);
});
```

### Limpiar cache
```typescript
this.productService.clearCache();
```

### Obtener productos actuales
```typescript
const currentProducts = this.productService.getCurrentProducts();
console.log('Productos actuales:', currentProducts);
```

### Verificar si está cargando
```typescript
const isLoading = this.productService.isLoading();
console.log('Está cargando:', isLoading);
```

## Ejemplo Completo en Componente

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../core/services/product.service';
import { Product, CreateProduct } from '../core/models/product.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  template: `
    <div *ngIf="isLoading">Cargando...</div>
    <div *ngFor="let product of products">
      <h3>{{ product.name }}</h3>
      <p>Precio: {{ product.price | currency }}</p>
      <p>Stock: {{ product.stock }}</p>
      <button (click)="deleteProduct(product.id)">Eliminar</button>
    </div>
  `
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Suscribirse al estado de carga
    this.productService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    // Suscribirse a cambios en productos
    this.productService.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });

    // Cargar productos iniciales
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        console.log('Productos cargados:', products);
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          console.log('Producto eliminado');
        },
        error: (error) => {
          console.error('Error eliminando producto:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Manejo de Errores

El servicio maneja automáticamente diferentes tipos de errores:

- **400 Bad Request** - Datos inválidos
- **404 Not Found** - Producto no encontrado
- **409 Conflict** - Producto ya existe
- **422 Unprocessable Entity** - Error de validación
- **500 Internal Server Error** - Error del servidor
- **0 Network Error** - Sin conexión

```typescript
this.productService.getAll().subscribe({
  next: (products) => {
    // Éxito
  },
  error: (error) => {
    console.error('Error:', error.message);
    console.error('Detalles:', error.details);
    console.error('Status:', error.status);
  }
});
```

## Configuración

### Environment
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api',
  apiTimeout: 10000,
  enableLogging: true
};
```

### Timeout y Retry
- **Timeout**: 10 segundos por defecto
- **Retry**: 2 reintentos automáticos
- **Cache**: 5 minutos de duración

## Mejores Prácticas

1. **Siempre usar takeUntil** para evitar memory leaks
2. **Manejar errores** en todos los suscriptores
3. **Usar estados reactivos** en lugar de variables locales
4. **Limpiar cache** cuando sea necesario
5. **Verificar estado de carga** antes de mostrar UI

## Debugging

El servicio incluye logging detallado cuando `environment.enableLogging` es `true`:

```typescript
// En la consola verás:
[ProductService] ProductService inicializado { baseUrl: "http://localhost:4000/api" }
[ProductService] Obteniendo productos de la API { filters: undefined }
[ProductService] Productos cargados exitosamente { count: 5 }
```

¡El ProductService está listo para usar! 🚀
