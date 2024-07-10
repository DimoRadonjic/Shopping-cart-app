import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-options',
  templateUrl: './list-options.component.html',
  styleUrls: ['./list-options.component.scss'],
})
export class ListOptionsComponent implements OnInit {
  searchText = '';

  constructor() {}

  ngOnInit(): void {}

  applyFilter() {
    this.currentPage = 1;
    this.fetchProducts();
  }
}
