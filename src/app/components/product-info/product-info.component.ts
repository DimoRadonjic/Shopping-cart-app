import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../product/product.model';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent implements OnInit {
  @Input() product!: Product;

  constructor() {}

  ngOnInit(): void {}

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }
}
