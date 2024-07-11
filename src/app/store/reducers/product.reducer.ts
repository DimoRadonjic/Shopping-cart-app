import { createReducer, on } from '@ngrx/store';
import {
  setProducts,
  setTotalProducts,
  addInCartProducts,
  removeFromCartProducts,
} from '../actions/product.actions';
import { Product } from 'src/app/components/product/product.model';

export const productsInitialState = {
  products: [] as Product[],
  displayedProducts: [] as Product[],
  inCart: [] as { product: Product; quantity: number }[],
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
  on(addInCartProducts, (state, { inCartProduct, quantity }) => ({
    ...state,
    inCart: state.inCart.find(({ product }) => product.id === inCartProduct.id)
      ? state.inCart.map((item) =>
          item.product.id === inCartProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...state.inCart, { product: inCartProduct, quantity: quantity }],
  })),

  on(removeFromCartProducts, (state, { toRemoveProductId }) => {
    console.log('cart', state.inCart);
    return {
      ...state,
      inCart: state.inCart.filter(
        ({ product }) => product.id !== toRemoveProductId
      ),
    };
  })
);
