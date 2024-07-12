import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductListService } from 'src/app/services';
import { ProductArray, CartItemArray } from 'src/app/types/types';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  @Input() inCart: boolean = false;

  filter$: Observable<{
    searchText: string;
    pageSize: number;
    currentPage: number;
  }>;
  productStore$: Observable<{
    products: ProductArray;
    displayedProducts: ProductArray;
    totalProducts: number;
    inCart: CartItemArray;
  }>;
  displayedProducts: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  private destroy$ = new Subject<void>();

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<{
      filter: {
        searchText: string;
        pageSize: number;
        currentPage: number;
      };
      products: {
        products: ProductArray;
        displayedProducts: ProductArray;
        inCart: CartItemArray;
        totalProducts: number;
      };
    }>,
    config: NgbPaginationConfig,
    private productListService: ProductListService
  ) {
    this.filter$ = this.store.select('filter');
    this.productStore$ = this.store.select('products');
    config.pageSize = this.pageSize;
  }

  ngOnInit(): void {
    this.fetchProductsFromStore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchProductsFromStore() {
    this.productStore$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (!this.inCart) {
        this.displayedProducts = state.products;
        this.totalItems = state.totalProducts;
      } else {
        this.displayedProducts = state.inCart;
        this.totalItems = state.inCart.length - 1;
      }
    });
  }

  paginate(array: ProductArray, page: number, pageSize: number): ProductArray {
    return array.slice((page - 1) * pageSize, page * pageSize);
  }

  onPageChange(page: number) {
    this.productListService.setCurrentPage(page);
    this.fetchProductsFromStore();
  }
}
