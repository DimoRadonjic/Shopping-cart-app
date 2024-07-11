import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/services/product-service';
import { Product } from 'src/app/interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent implements OnInit {
  @Input() productId!: number;
  product: Product = {} as Product;
  loading = true;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.productService.loading$.subscribe(
        (loading) => (this.loading = loading)
      ),
      this.productService.product$.subscribe((product) => {
        if (product !== null) {
          this.product = product;
        }
      })
    );
    this.productService.fetchProductDetails(this.productId);
  }
}
