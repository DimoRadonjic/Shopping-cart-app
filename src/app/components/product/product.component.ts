import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from '..';
import { Product } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;
  @Input() inCart: boolean = false;
  @Input() quantity: number = 0;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openProductModal(productId: number) {
    this.modalService.open(ProductModalComponent).componentInstance.productId =
      productId;
  }
}
