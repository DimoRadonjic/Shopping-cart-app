import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutPayload } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = 'https://dummyjson.com/http/200';

  constructor(private http: HttpClient) {}

  submitCheckout(payload: CheckoutPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
