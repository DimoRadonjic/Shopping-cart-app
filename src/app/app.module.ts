import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ProductComponent,
  ProductListComponent,
  CartComponent,
  CartModalComponent,
  ProductInfoComponent,
  ProductModalComponent,
  RatingComponent,
  ListOptionsComponent,
  StockOperationsButtonsComponent,
  CheckoutComponent,
  ToastsContainer,
} from './components';
import {
  NgbModalModule,
  NgbModule,
  NgbPaginationModule,
  NgbRatingModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProductListService, ToastService } from './services';
import { StoreModule } from '@ngrx/store';
import { filterReducer } from './store/reducers/filter.reducer';
import { GlobalProductService } from './global-product.service';
import { productReducer } from './store/reducers/product.reducer';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyFormatPipe } from './pipes';
import { storageSyncMetaReducer } from 'ngrx-store-persist';
@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductListComponent,
    ProductModalComponent,
    ProductInfoComponent,
    RatingComponent,
    CartComponent,
    CartModalComponent,
    ListOptionsComponent,
    CheckoutComponent,
    StockOperationsButtonsComponent,
    CurrencyFormatPipe,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbRatingModule,
    ToastsContainer,
    ReactiveFormsModule,

    StoreModule.forRoot(
      { filter: filterReducer, products: productReducer },
      {
        metaReducers: [storageSyncMetaReducer],
      }
    ),
  ],
  providers: [
    ProductListService,
    GlobalProductService,
    ToastService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
