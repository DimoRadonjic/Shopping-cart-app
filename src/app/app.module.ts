import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {
  ProductComponent,
  ProductListComponent,
  CartComponent,
  CartModalComponent,
  ProductInfoComponent,
  ProductModalComponent,
  RatingComponent,
  ListOptionsComponent,
} from './components';
import {
  NgbModalModule,
  NgbModule,
  NgbPaginationModule,
  NgbRatingModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProductListService } from './services';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbRatingModule,
  ],
  providers: [ProductListService],
  bootstrap: [AppComponent],
})
export class AppModule {}
