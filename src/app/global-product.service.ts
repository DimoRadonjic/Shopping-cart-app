import { Injectable } from '@angular/core';
import { ProductListService } from './services/product-list.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalProductService {
  constructor(private productListService: ProductListService) {}
}
