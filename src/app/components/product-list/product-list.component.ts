import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/interfaces/interfaces';
import { ProductListService } from 'src/app/services';
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
    products: Product[];
    displayedProducts: Product[];
    totalProducts: number;
    inCart: { product: Product; quantity: number }[];
  }>;
  displayedProducts: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
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
        inCart: { product: Product; quantity: number }[];
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
    if (!this.inCart) {
      this.productStore$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
        this.displayedProducts = state.products;
        this.totalItems = state.totalProducts;
      });
    } else {
      this.productStore$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
        this.displayedProducts = state.inCart;
        this.totalItems = state.inCart.length;
      });
    }
  }

  onPageChange(page: number) {
    this.productListService.setCurrentPage(page);
    this.fetchProductsFromStore();
  }
}
