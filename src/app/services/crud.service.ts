import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environmen';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductCategory } from '../models/productCategory.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  // Productos
  getProducts(): Observable<any> {
    const url = `${base_url}/productos`;
    return this.http.get<any>(url);
  }

  addProduct(product: Product): Observable<any> {
    const url = `${base_url}/productos`;
    return this.http.post<any>(url, product);
  }

  updateProduct(id: number, product: Product): Observable<any> {
    const url = `${base_url}/productos/${id}`;
    return this.http.put<any>(url, product);
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${base_url}/productos/${id}`;
    return this.http.delete<any>(url);
  }

  // Categorias
  getCategories(): Observable<any> {
    const url = `${base_url}/categorias`;
    return this.http.get<any>(url);
  }

  addCategories(category: Category): Observable<any> {
    const url = `${base_url}/categorias`;
    return this.http.post<any>(url, category);
  }

  updateCategories(id: number, category: Category): Observable<any> {
    const url = `${base_url}/categorias/${id}`;
    return this.http.put<any>(url, category);
  }

  deleteCategories(id: number): Observable<any> {
    const url = `${base_url}/categorias/${id}`;
    return this.http.delete<any>(url);
  }

  // Productos Categoria
  getProductsCategories(): Observable<any> {
    const url = `${base_url}/productos_categorias`;
    return this.http.get<any>(url);
  }

  addProductsCategories(productCategory: ProductCategory): Observable<any> {
    const url = `${base_url}/productos_categorias`;
    return this.http.post<any>(url, productCategory);
  }

  updateProductsCategories(id: number, productCategory: ProductCategory): Observable<any> {
    const url = `${base_url}/productos_categorias/${id}`;
    return this.http.put<any>(url, productCategory);
  }

  deleteProductsCategories(id: number): Observable<any> {
    const url = `${base_url}/productos_categorias/${id}`;
    return this.http.delete<any>(url);
  }

  // Inventario
  getInventario(): Observable<any> {
    const url = `${base_url}/movimientos_inventario`;
    return this.http.get<any>(url);
  }

  deleteInventario(id: number): Observable<any> {
    const url = `${base_url}/movimientos_inventario/${id}`;
    return this.http.delete<any>(url);
  }
}

