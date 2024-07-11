import { createAction, props } from '@ngrx/store';

export const setSearchText = createAction(
  '[List Options] Search',
  props<{ searchString: string }>()
);

export const setPageSize = createAction(
  '[List Options] Page Size',
  props<{ size: number }>()
);

export const setCurrentPage = createAction(
  '[List Options] Current Page',
  props<{ page: number }>()
);
