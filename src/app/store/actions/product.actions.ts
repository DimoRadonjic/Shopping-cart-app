import { createAction, props } from '@ngrx/store';
import { Product } from 'src/app/interfaces/interfaces';

export const setProducts = createAction(
  '[Product API] Set Products',
  props<{ productsArr: Product[] }>()
);

export const setTotalProducts = createAction(
  '[Product API] Set Total Products',
  props<{ totalProductsNum: number }>()
);

//Cart
export const addInCartProducts = createAction(
  '[Cart Component] Add In Cart Products',
  props<{ inCartProduct: Product; quantity: number }>()
);

export const removeFromCartProducts = createAction(
  '[Cart Component] Remove From Cart Products',
  props<{ toRemoveProductId: number }>()
);

export const totalCartProducts = createAction(
  '[Cart Component] Total Cart Products'
);

export const totalCartPrice = createAction('[Cart Component] Total Cart Price');
