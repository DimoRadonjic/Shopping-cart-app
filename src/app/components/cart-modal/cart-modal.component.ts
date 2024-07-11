// src/app/product-modal/product-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CheckoutComponent } from 'src/app/components/checkout-form/checkout-form.component';
import { Product } from 'src/app/interfaces/interfaces';
import { clearCart } from 'src/app/store/actions/product.actions';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {
  totalCartProducts: number = 0;
  totalCartPrice: number = 0;
  inCartProducts: { product: Product; quantity: number }[] = [];

  cart$: Observable<{
    products: Product[];
    displayedProducts: Product[];
    totalProducts: number;
    inCart: { product: Product; quantity: number }[];
    totalCartPrice: number;
    totalCartProducts: number;
  }>;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<{
      filter: {
        searchText: string;
        pageSize: number;
        currentPage: number;
      };
      products: {
        products: Product[];
        displayedProducts: Product[];
        totalProducts: number;
        inCart: { product: Product; quantity: number }[];
        totalCartProducts: number;
        totalCartPrice: number;
      };
    }>,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.cart$ = this.store.select('products');
  }

  ngOnInit(): void {
    this.fetchProductsFromStore();
  }

  openCheckoutModal(): void {
    this.activeModal.close(CartModalComponent);
    this.modalService.open(CheckoutComponent);
  }

  cancelOrder(): void {
    this.activeModal.dismiss('cancel');
    this.store.dispatch(clearCart());
  }

  fetchProductsFromStore() {
    this.cart$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.totalCartProducts = state.totalCartProducts;
      this.totalCartPrice = state.totalCartPrice;
      this.inCartProducts = state.inCart;
    });
  }
}
