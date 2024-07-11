import { createAction, props } from '@ngrx/store';
import { Product } from 'src/app/components/product/product.model';

export const setProducts = createAction(
  '[Product API] Set Products',
  props<{ productsArr: Product[] }>()
);

export const addInCartProducts = createAction(
  '[Cart Component] Add In Cart Products',
  props<{ inCartProduct: Product; quantity: number }>()
);

export const removeFromCartProducts = createAction(
  '[Cart Component] Remove From Cart Products',
  props<{ toRemoveProductId: number }>()
);

export const setTotalProducts = createAction(
  '[Product API] Set Total Products',
  props<{ totalProductsNum: number }>()
);
