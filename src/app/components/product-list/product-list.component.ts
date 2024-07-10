import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { ProductListService } from 'src/app/services/product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  allProducts: any[] = [];
  displayedProducts: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  searchText = '';

  constructor(
    private productListService: ProductListService,
    private modalService: NgbModal,
    config: NgbPaginationConfig
  ) {
    config.pageSize = this.pageSize;
  }

  ngOnInit(): void {
    this.productListService
      .fetchProductsPerPage(this.currentPage, this.pageSize)
      .subscribe((data) => {
        this.allProducts = data.allProducts;
        this.totalItems = data.totalItems;
        this.displayedProducts = this.allProducts;
      });
  }

  openProductModal(productId: number) {
    const modalRef = this.modalService.open(ProductModalComponent);
    modalRef.componentInstance.productId = productId;
  }

  fetchProducts() {
    if (this.searchText.trim().length === 0) {
      this.productListService
        .fetchProductsPerPage(this.currentPage, this.pageSize)
        .subscribe((data) => {
          this.allProducts = data.allProducts;
          this.totalItems = data.totalItems;
          this.displayedProducts = this.allProducts;
        });
    } else {
      this.productListService
        .fetchProductsSearch(this.searchText)
        .subscribe((data) => {
          this.allProducts = data.allProducts;
          this.totalItems = data.totalItems;
          this.displayedProducts = this.allProducts;
          this.currentPage = 1;
        });
    }
  }

  applyFilter() {
    this.currentPage = 1;
    this.fetchProducts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.searchText.trim().length === 0) {
      this.fetchProducts();
    } else {
      this.updateDisplayedProducts();
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    if (this.searchText.trim().length === 0) {
      this.fetchProducts();
    } else {
      this.updateDisplayedProducts();
    }
  }

  updateDisplayedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
  }
}
