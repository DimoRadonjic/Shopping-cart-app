import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  static getProducts() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<{ products: Product[] }>(this.apiUrl)
      .pipe(map((response) => response.products));
  }
}
