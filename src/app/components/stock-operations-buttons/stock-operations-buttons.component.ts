import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Product } from 'src/app/interfaces/interfaces';
import { ProductListService } from 'src/app/services';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-stock-operations-buttons',
  templateUrl: './stock-operations-buttons.component.html',
  styleUrl: './stock-operations-buttons.component.scss',
})
export class StockOperationsButtonsComponent {
  @Input() product!: Product;
  @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl', { static: true }) dangerTpl!: TemplateRef<any>;

  constructor(
    private productListService: ProductListService,
    private toastService: ToastService
  ) {}

  addToCart() {
    if (this.product) {
      this.productListService.addInCartProducts(this.product);
      this.showSuccess(this.successTpl);
    }
    console.log('Item added to cart');
  }

  removeFromCart() {
    if (this.product.id) {
      this.productListService.removeFromCart(this.product);
      this.showDanger(this.dangerTpl);
    }
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-success text-light',
      delay: 15000,
    });
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-danger text-light',
      delay: 1500,
    });
  }
}
