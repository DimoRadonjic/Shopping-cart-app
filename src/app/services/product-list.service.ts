import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import {
  map,
  switchMap,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Product } from 'src/app/interfaces/interfaces';
import {
  setCurrentPage,
  setPageSize,
  setSearchText,
} from '../store/actions/filter.actions';
import {
  addInCartProducts,
  clearCart,
  removeFromCartProducts,
  setProducts,
  setTotalProducts,
} from '../store/actions/product.actions';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private apiUrl = 'https://dummyjson.com/products';

  private searchTextSubject = new BehaviorSubject<string>('');
  private pageSizeSubject = new BehaviorSubject<number>(5);
  private currentPageSubject = new BehaviorSubject<number>(1);

  searchText$ = this.searchTextSubject.asObservable();
  pageSize$ = this.pageSizeSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();

  products$!: Observable<Product[]>;
  totalProducts$!: Observable<number>;

  constructor(
    private http: HttpClient,
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
    }>
  ) {
    this.initializeDataStreams();
  }

  private initializeDataStreams() {
    const filter$ = combineLatest([
      this.searchText$,
      this.pageSize$,
      this.currentPage$,
    ]).pipe(
      debounceTime(300),
      distinctUntilChanged(
        (prev, curr) =>
          prev[0] === curr[0] && prev[1] === curr[1] && prev[2] === curr[2]
      )
    );

    const response$ = filter$.pipe(
      switchMap(([searchText, pageSize, currentPage]) =>
        this.fetchProducts(searchText, pageSize, currentPage)
      )
    );

    this.products$ = response$.pipe(map((response) => response.products));
    this.totalProducts$ = response$.pipe(map((response) => response.total));

    this.products$.subscribe((products) => {
      this.store.dispatch(setProducts({ productsArr: products }));
    });

    this.totalProducts$.subscribe((total) => {
      this.store.dispatch(setTotalProducts({ totalProductsNum: total }));
    });
  }

  private fetchProducts(
    searchText: string,
    pageSize: number,
    currentPage: number
  ): Observable<any> {
    const skip = (currentPage - 1) * pageSize;
    let url = `${this.apiUrl}?limit=${pageSize}&skip=${skip}`;

    if (searchText) {
      url = `${this.apiUrl}/search?q=${searchText}&limit=${pageSize}&skip=${skip}`;
    }

    return this.http.get<any>(url);
  }

  setSearchText(searchText: string) {
    this.searchTextSubject.next(searchText);
    this.store.dispatch(setSearchText({ searchString: searchText }));
    this.setCurrentPage(1);
  }

  setPageSize(pageSize: number) {
    this.pageSizeSubject.next(pageSize);
    this.store.dispatch(setPageSize({ size: pageSize }));
    this.setCurrentPage(1);
  }

  setCurrentPage(page: number) {
    this.currentPageSubject.next(page);
    this.store.dispatch(setCurrentPage({ page }));
  }
}
