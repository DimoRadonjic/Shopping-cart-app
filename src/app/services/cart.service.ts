import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Cart, CartItem, Product } from '../interfaces/interfaces';
import {
  addInCartProducts,
  clearCart,
  removeFromCartProducts,
  setProducts,
} from '../store/actions/product.actions';
import { ProductArray, CartItemArray } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$: Observable<Cart>;
  totalCartProducts: number = 0;
  totalCartPrice: number = 0;
  products: ProductArray = [];
  inCart: CartItemArray = [];
  productsRemovedFromList: number[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<{
      products: {
        products: ProductArray;
        displayedProducts: ProductArray;
        totalProducts: number;
        inCart: CartItemArray;
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
    this.addCartProducts(inCartProduct);
    this.removeProducts(inCartProduct);
    this.store.dispatch(addInCartProducts({ inCartProduct, quantity: 1 }));
  }

  clearCart() {
    this.store.dispatch(clearCart());
  }

  ifAvailableInProducts(productArg: Product) {
    return this.products.find(
      (product) => product.id === productArg.id && product.stock > 0
    )
      ? true
      : false;
  }

  ifAvailableInCart(productArg: Product): CartItem | undefined {
    return this.inCart.find(
      ({ product, quantity }) => product.id === productArg.id && quantity > 0
    );
  }

  addProducts(newProduct: Product) {
    let updatedProducts: ProductArray = [...this.products];

    const existingProductIndex = updatedProducts.findIndex(
      (product) => product.id === newProduct.id
    );

    if (existingProductIndex !== -1) {
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        stock: Math.max(0, updatedProducts[existingProductIndex].stock + 1),
      };
    } else {
      const newProductIndex = updatedProducts.findIndex(
        (product) => product.id > newProduct.id
      );

      if (newProductIndex !== -1) {
        updatedProducts.splice(newProductIndex, 0, { ...newProduct, stock: 1 });
      } else {
        updatedProducts.push({ ...newProduct, stock: 1 });
      }
    }

    const finalArr = updatedProducts.filter((product) => product.stock > 0);

    this.store.dispatch(setProducts({ productsArr: finalArr }));
  }

  removeProducts(newProduct: Product) {
    const updatedProducts = this.products.map((product) =>
      product.id === newProduct.id
        ? { ...product, stock: Math.max(0, product.stock - 1) }
        : product
    );

    const productsIndex = updatedProducts.findIndex(
      (product) => product.id === newProduct.id
    );

    if (updatedProducts[productsIndex].stock === 0) {
      this.productsRemovedFromList.push(productsIndex);
      console.log(
        'productsRemovedFromList added',
        this.productsRemovedFromList
      );
    }
    const finalArr = updatedProducts.filter((product) => product.stock > 0);
    this.store.dispatch(setProducts({ productsArr: finalArr }));
  }

  addCartProducts(newProduct: Product) {
    let updatedCart: CartItemArray = [];
    let found = this.ifAvailableInCart(newProduct);

    if (found) {
      updatedCart = [
        ...this.inCart,
        { product: newProduct, quantity: found.quantity + 1 },
      ];
    } else {
      updatedCart = [...this.inCart, { product: newProduct, quantity: 1 }];
    }
  }

  removeCartProducts(newProduct: Product) {
    let updatedCart: CartItemArray = [];
    let found = this.ifAvailableInCart(newProduct);

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

  removeFromCart(productToRemove: Product) {
    this.removeCartProducts(productToRemove);
    this.addProducts(productToRemove);
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
