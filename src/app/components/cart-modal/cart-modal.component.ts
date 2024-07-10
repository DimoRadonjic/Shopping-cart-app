// src/app/product-modal/product-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {
  @Input() productId!: number;
  product: any;
  loading = true;

  constructor(private http: HttpClient, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.fetchProductDetails();
  }

  fetchProductDetails() {
    this.loading = true;
    this.http.get(`https://dummyjson.com/products/${this.productId}`).subscribe(
      (data: any) => {
        this.product = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching product details:', error);
        this.loading = false;
      }
    );
  }
}
