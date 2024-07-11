import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../product/product.model';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  filter$: Observable<{
    searchText: string;
    pageSize: number;
    currentPage: number;
  }>;
  productStore$: Observable<{
    products: Product[];
    displayedProducts: Product[];
    totalProducts: number;
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
        totalProducts: number;
      };
    }>,
    config: NgbPaginationConfig
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
      this.displayedProducts = state.products;
      this.totalItems = state.totalProducts;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchProductsFromStore();
  }
}
