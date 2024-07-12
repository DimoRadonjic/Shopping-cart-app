import { createReducer, on } from '@ngrx/store';
import {
  setProducts,
  setTotalProducts,
  addInCartProducts,
  removeFromCartProducts,
  clearCart,
} from '../actions/product.actions';
import { ProductArray, CartItemArray } from 'src/app/types/types';

export const productsInitialState = {
  products: [] as ProductArray,
  displayedProducts: [] as ProductArray,
  inCart: [] as CartItemArray,
  totalCartProducts: 0,
  totalCartPrice: 0,
  totalProducts: 0,
};

export const productReducer = createReducer(
  productsInitialState,
  on(setProducts, (state, { productsArr }) => ({
    ...state,
    products: productsArr,
  })),
  on(setTotalProducts, (state, { totalProductsNum }) => ({
    ...state,
    totalProducts: totalProductsNum,
  })),

  //Cart

  on(addInCartProducts, (state, { inCartProduct, quantity }) => {
    const updatedInCart = state.inCart.find(
      ({ product }) => product.id === inCartProduct.id
    )
      ? state.inCart.map((item) =>
          item.product.id === inCartProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...state.inCart, { product: inCartProduct, quantity: quantity }];

    return {
      ...state,
      inCart: updatedInCart,
      totalCartProducts: state.totalCartProducts + quantity,
      totalCartPrice: updatedInCart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    };
  }),

  on(clearCart, (state) => {
    return {
      ...state,
      inCart: [],

      totalCartProducts: 0,
      totalCartPrice: 0,
    };
  }),
  on(removeFromCartProducts, (state, { toRemoveProductId }) => {
    const found = state.inCart.find(
      (item) => item.product.id === toRemoveProductId
    );
    const updatedInCart = state.inCart
      .map((item) =>
        item.product.id === toRemoveProductId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    return {
      ...state,
      inCart: updatedInCart,
      totalCartProducts:
        state.totalCartProducts > 0 ? state.totalCartProducts - 1 : 0,
      totalCartPrice: updatedInCart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    };
  })
);
