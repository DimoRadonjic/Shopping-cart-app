import { Component, Input } from '@angular/core';
import { Product } from '../product/product.model';
import { ProductListService } from 'src/app/services';

@Component({
  selector: 'app-stock-operations-buttons',
  templateUrl: './stock-operations-buttons.component.html',
  styleUrl: './stock-operations-buttons.component.scss',
})
export class StockOperationsButtonsComponent {
  @Input() product!: Product;

  constructor(private productListService: ProductListService) {}

  ngOnInit(): void {}

  addToCart() {
    if (this.product) {
      this.productListService.addInCartProducts(this.product);
    }

    console.log('Item added to cart');
  }

  removeFromCart() {
    if (this.product.id) {
      this.productListService.removeFromCart(this.product);
    }
  }
}
