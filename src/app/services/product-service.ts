import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/interfaces';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private productSubject = new BehaviorSubject<Product | null>(null);

  loading$ = this.loadingSubject.asObservable();
  product$ = this.productSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchProductDetails(productId: number): void {
    this.loadingSubject.next(true);
    this.http
      .get<Product>(`${this.apiUrl}/${productId}`)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe(
        (data: Product) => {
          this.productSubject.next(data);
        },
        (error) => {
          console.error('Error fetching product details:', error);
          this.productSubject.next(null);
        }
      );
  }
}
