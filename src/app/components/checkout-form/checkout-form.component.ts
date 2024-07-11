import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  selectedItems: Item[] = []; // You might want to initialize this with some items for testing

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('\\+?[0-9]+')]],
    });

    // Initialize selectedItems for testing
    this.selectedItems = [
      { id: 1, name: 'Item 1', quantity: 2, price: 10 },
      { id: 2, name: 'Item 2', quantity: 1, price: 15 },
    ];
  }

  updateItemQuantity(item: Item, newQuantity: number) {
    item.quantity = newQuantity;
  }

  removeItem(item: Item) {
    this.selectedItems = this.selectedItems.filter((i) => i !== item);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const payload = {
        ...this.checkoutForm.value,
        items: this.selectedItems,
      };

      this.http.post('https://dummyjson.com/http/200', payload).subscribe(
        (response) => {
          console.log('Success:', response);
          this.activeModal.close(response);
        },
        (error) => {
          console.error('Error:', error);
          // Handle error (e.g., show error message)
        }
      );
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  get total(): number {
    return this.selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }
}
