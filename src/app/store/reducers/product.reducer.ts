import { createReducer, on } from '@ngrx/store';
import {
  setProducts,
  setTotalProducts,
  addInCartProducts,
  removeFromCartProducts,
  totalCartProducts,
} from '../actions/product.actions';
import { Product } from 'src/app/components/product/product.model';

export const productsInitialState = {
  products: [] as Product[],
  displayedProducts: [] as Product[],
  inCart: [] as { product: Product; quantity: number }[],
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
      products: state.products.map((product) =>
        product.id === inCartProduct.id
          ? { ...product, stock: product.stock - quantity }
          : product
      ),
      totalCartProducts: state.totalCartProducts + quantity,
      totalCartPrice: updatedInCart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
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

    const updatedProducts =
      found && found.quantity >= 1
        ? state.products.map((product) =>
            product.id === toRemoveProductId
              ? { ...product, stock: product.stock + 1 }
              : product
          )
        : state.products;

    return {
      ...state,
      inCart: updatedInCart,
      products: updatedProducts,
      totalCartProducts:
        state.totalCartProducts > 0 ? state.totalCartProducts - 1 : 0,
      totalCartPrice: updatedInCart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    };
  })
);
