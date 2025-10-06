import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface SimpleProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SimpleProductService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<SimpleProduct[]> {
    return this.http.get<SimpleProduct[]>(`${this.baseUrl}/products`);
  }

  getProductById(id: number): Observable<SimpleProduct> {
    return this.http.get<SimpleProduct>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(product: Omit<SimpleProduct, 'id' | 'createdAt' | 'updatedAt'>): Observable<SimpleProduct> {
    return this.http.post<SimpleProduct>(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<SimpleProduct>): Observable<SimpleProduct> {
    return this.http.put<SimpleProduct>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }
}
