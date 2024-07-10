import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../components/product/product.model';
@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  fetchProductsPerPage(
    currentPage: number,
    pageSize: number
  ): Observable<{ allProducts: Product[]; totalItems: number }> {
    const skip = (currentPage - 1) * pageSize;
    const productsUrl = `${this.apiUrl}?limit=${pageSize}&skip=${skip}`;

    return this.http
      .get<{ products: Product[]; total: number }>(productsUrl)
      .pipe(
        map((data) => ({
          allProducts: data.products,
          totalItems: data.total,
        }))
      );
  }

  fetchProductsSearch(
    searchText: string
  ): Observable<{ allProducts: Product[]; totalItems: number }> {
    const searchUrl = `https://dummyjson.com/products/search?q=${searchText}`;

    return this.http
      .get<{ products: Product[]; total: number }>(searchUrl)
      .pipe(
        map((data) => ({
          allProducts: data.products,
          totalItems: data.total,
        }))
      );
  }

  // updateDisplayedProducts() {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   console.log(this.allProducts);
  //   this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
  // }
}
