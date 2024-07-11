import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/interfaces';
import {
  addInCartProducts,
  clearCart,
  removeFromCartProducts,
} from '../store/actions/product.actions';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private currentInCartProducts = new BehaviorSubject<
    { product: Product[]; quantity: number }[]
  >([]);
  currentInCartProducts$ = this.currentInCartProducts.asObservable();

  constructor(private store: Store) {}

  addInCartProducts(inCartProduct: Product) {
    this.updateCurrentInCartProducts(true, inCartProduct);

    this.store.dispatch(addInCartProducts({ inCartProduct, quantity: 1 }));
  }

  clearCart() {
    this.currentInCartProducts.next([]);
    this.store.dispatch(clearCart());
  }

  updateCurrentInCartProducts(add: boolean, newProduct: Product): void {
    let updatedCart = this.currentInCartProducts.value;

    let found = updatedCart.find(({ product: products }) =>
      products.find((item) => item.id === newProduct.id)
    );

    if (add) {
      if (found) {
        found.quantity++;
      } else {
        updatedCart = [...updatedCart, { product: [newProduct], quantity: 1 }];
      }
    } else {
      if (found) {
        found.quantity--;
        if (found.quantity === 0) {
          updatedCart = updatedCart.filter(
            (item) => !item.product.some((p) => p.id === newProduct.id)
          );
        }
      } else {
        updatedCart = updatedCart.filter(
          (item) => item.product[0].id !== newProduct.id
        );
      }
    }
    this.currentInCartProducts.next(updatedCart);
  }

  removeFromCart(productToRemove: Product) {
    this.updateCurrentInCartProducts(false, productToRemove);
    this.store.dispatch(
      removeFromCartProducts({ toRemoveProductId: productToRemove.id })
    );
  }

  isEmpty() {
    return this.currentInCartProducts.value.length === 0;
  }

  isInCart(productId: number) {
    return this.currentInCartProducts.value.find(({ product }) =>
      product.find((p) => p.id === productId)
    )
      ? true
      : false;
  }
}
