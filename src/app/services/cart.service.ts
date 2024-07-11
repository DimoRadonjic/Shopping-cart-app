import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Product } from '../interfaces/interfaces';
import {
  addInCartProducts,
  clearCart,
  removeFromCartProducts,
  setProducts,
} from '../store/actions/product.actions';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$: Observable<{
    products: Product[];
    displayedProducts: Product[];
    totalProducts: number;
    inCart: { product: Product; quantity: number }[];
    totalCartPrice: number;
    totalCartProducts: number;
  }>;
  totalCartProducts: number = 0;
  totalCartPrice: number = 0;
  products: Product[] = [];
  inCart: { product: Product; quantity: number }[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<{
      products: {
        products: Product[];
        displayedProducts: Product[];
        totalProducts: number;
        inCart: { product: Product; quantity: number }[];
        totalCartPrice: number;
        totalCartProducts: number;
      };
    }>
  ) {
    this.cart$ = this.store.select((state) => state.products);
    this.fetchFromCart();
  }

  fetchFromCart() {
    this.cart$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.totalCartProducts = state.totalCartProducts;
      this.products = state.products;
      this.totalCartPrice = state.totalCartPrice;
      this.inCart = state.inCart;
    });
  }

  addInCartProducts(inCartProduct: Product) {
    this.updateCurrentInCartProducts(true, inCartProduct);
    this.updateProducts(true, inCartProduct);
    this.store.dispatch(addInCartProducts({ inCartProduct, quantity: 1 }));
  }

  clearCart() {
    this.store.dispatch(clearCart());
  }

  updateProducts(add: boolean, newProduct: Product) {
    const productAvailable = this.products.find(
      (product) => product.id === newProduct.id && product.stock > 0
    )
      ? true
      : false;

    let updatedProducts: Product[] = [];

    if (add) {
      if (productAvailable) {
        updatedProducts = this.products.map((product) =>
          product.id === newProduct.id
            ? { ...product, stock: product.stock - 1 }
            : product
        );
      } else {
        updatedProducts = this.products.filter((product) => product.stock > 0);
      }
    } else {
      updatedProducts = this.products.map((product) =>
        product.id === newProduct.id
          ? { ...product, stock: product.stock + 1 }
          : product
      );
    }
  }

  updateCurrentInCartProducts(add: boolean, newProduct: Product): void {
    let updatedCart: { product: Product; quantity: number }[] = [];

    const found = this.inCart.find(
      ({ product }) => product.id === newProduct.id
    );

    if (add) {
      if (found) {
        console.log('found', found);
        updatedCart = [
          ...this.inCart,
          { product: newProduct, quantity: found.quantity + 1 },
        ];
      } else {
        updatedCart = [...this.inCart, { product: newProduct, quantity: 1 }];
      }
    } else {
      if (found) {
        updatedCart = [
          ...this.inCart,
          { product: newProduct, quantity: found.quantity - 1 },
        ];
        if (found.quantity === 0) {
          updatedCart = this.inCart.filter(
            (item) => item.product.id !== newProduct.id
          );
        }
      } else {
        updatedCart = this.inCart.filter(
          (item) => item.product.id !== newProduct.id
        );
      }
    }
  }

  removeFromCart(productToRemove: Product) {
    this.updateCurrentInCartProducts(false, productToRemove);
    this.updateProducts(false, productToRemove);
    this.store.dispatch(
      removeFromCartProducts({ toRemoveProductId: productToRemove.id })
    );
  }

  isEmpty() {
    return this.inCart.length === 0;
  }

  isInCart(productId: number) {
    return this.inCart.find(({ product }) => product.id === productId)
      ? true
      : false;
  }
}
