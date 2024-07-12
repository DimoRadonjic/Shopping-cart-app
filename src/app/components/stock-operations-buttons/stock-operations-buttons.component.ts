import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/interfaces';
import { CartService } from 'src/app/services/cart.service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-stock-operations-buttons',
  templateUrl: './stock-operations-buttons.component.html',
  styleUrl: './stock-operations-buttons.component.scss',
})
export class StockOperationsButtonsComponent {
  @Input() product!: Product;
  @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;
  @ViewChild('failedTpl', { static: true }) dangerTpl!: TemplateRef<any>;
  @ViewChild('successCheckoutTpl', { static: true })
  successCheckoutTpl!: TemplateRef<any>;
  @ViewChild('failedCheckoutTpl', { static: true })
  failedCheckoutTpl!: TemplateRef<any>;

  isCartEmpty = this.cartService.isEmpty();

  isProductInCart = false;
  private cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
      this.isProductInCart = cart.inCart.some(
        (item) => item.product.id === this.product.id
      );
      this.isCartEmpty = cart.inCart.length === 0;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addInCartProducts(this.product);
      this.isProductInCart = this.cartService.isInCart(this.product.id);
      this.showSuccess(this.successTpl);
    }
  }

  removeFromCart() {
    if (this.product.id && !this.isCartEmpty) {
      this.cartService.removeFromCart(this.product);
      this.isProductInCart = this.cartService.isInCart(this.product.id);
      this.showDanger(this.dangerTpl);
    }
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-success text-light',
      delay: 1500,
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
