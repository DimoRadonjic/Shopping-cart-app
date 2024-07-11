import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces/interfaces';
import { Store } from '@ngrx/store';
import { clearCart } from 'src/app/store/actions/product.actions';
import { ToastService } from 'src/app/services';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
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
  @ViewChild('successCheckoutTpl', { static: true })
  successCheckoutTpl!: TemplateRef<any>;
  @ViewChild('failedCheckoutTpl', { static: true })
  failedCheckoutTpl!: TemplateRef<any>;
  @ViewChild('emptyCartTpl', { static: true })
  emptyCartTpl!: TemplateRef<any>;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal,
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
    private toastService: ToastService
  ) {
    this.cart$ = this.store.select('products');
  }

  ngOnInit() {
    this.fetchProductsFromStore();
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('\\+?[0-9]+')]],
    });
  }

  fetchProductsFromStore() {
    this.cart$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.totalCartProducts = state.totalCartProducts;
      this.totalCartPrice = state.totalCartPrice;
      this.inCartProducts = state.inCart;
    });
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      if (this.inCartProducts.length === 0 || this.totalCartProducts === 0) {
        this.showError(this.emptyCartTpl);
        return;
      }
      const payload = {
        ...this.checkoutForm.value,
        items: this.inCartProducts,
      };

      this.http.post('https://dummyjson.com/http/200', payload).subscribe(
        (response) => {
          console.log('Success:', response);
          this.activeModal.close(response);
          this.store.dispatch(clearCart());
          this.showSuccess(this.successCheckoutTpl);
        },
        (error) => {
          console.error('Error:', error);
          this.showSuccess(this.failedCheckoutTpl);
        }
      );
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-success text-light',
      delay: 1500,
    });
  }

  showError(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-danger text-light',
      delay: 1500,
    });
  }
}
