import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartModalComponent } from '../cart-modal/cart-modal.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartOpen: boolean = false;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openCartModal(cartOpen: boolean) {
    const modalRef = this.modalService.open(CartModalComponent);
    modalRef.componentInstance.cartOpen = !this.cartOpen;
  }
}
