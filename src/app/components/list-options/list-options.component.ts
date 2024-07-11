import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductListService } from 'src/app/services';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Product } from '../product/product.model';

@Component({
  selector: 'app-list-options',
  templateUrl: './list-options.component.html',
  styleUrls: ['./list-options.component.scss'],
})
export class ListOptionsComponent implements OnInit, OnDestroy {
  searchText: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  products$: Observable<Product[]>;
  totalProducts$: Observable<number>;

  private destroy$ = new Subject<void>();

  constructor(
    private productListService: ProductListService,
    private store: Store<{
      filter: {
        searchText: string;
        pageSize: number;
        currentPage: number;
      };
    }>
  ) {
    this.products$ = this.productListService.products$;
    this.totalProducts$ = this.productListService.totalProducts$;
  }

  ngOnInit(): void {
    this.productListService.searchText$
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchText) => (this.searchText = searchText));

    this.productListService.pageSize$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageSize) => (this.pageSize = pageSize));

    this.productListService.currentPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentPage) => (this.currentPage = currentPage));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(value: string) {
    this.productListService.setSearchText(value);
  }

  onPageSizeChange(pageSize: number) {
    this.productListService.setPageSize(pageSize);
  }

  onPageChange(page: number) {
    this.productListService.setCurrentPage(page);
  }
}
