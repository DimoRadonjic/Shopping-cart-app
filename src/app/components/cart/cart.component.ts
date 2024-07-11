import { Component, OnInit } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbPaginationConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces/interfaces';
import { ToastService } from 'src/app/services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartOpen: boolean = false;

  cart$: Observable<{
    products: Product[];
    displayedProducts: Product[];
    totalProducts: number;
    inCart: { product: Product; quantity: number }[];
    totalCartPrice: number;
    totalCartProducts: number;
  }>;
  totalCartProducts: number = 0;
  totalCartPrice: number = 0;
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
    private modalService: NgbModal,
    private toastService: ToastService
  ) {
    this.cart$ = this.store.select('products');
  }

  ngOnInit(): void {
    this.fetchProductsFromStore();
  }

  fetchProductsFromStore() {
    this.cart$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.totalCartProducts = state.totalCartProducts;
      this.totalCartPrice = state.totalCartPrice;
    });
  }

  openCartModal() {
    this.toastService.clear();
    const modalRef = this.modalService.open(CartModalComponent);
    modalRef.componentInstance.cartOpen = !this.cartOpen;
  }
}
