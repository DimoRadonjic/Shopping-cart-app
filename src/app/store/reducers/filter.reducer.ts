import { createReducer, on } from '@ngrx/store';
import {
  setCurrentPage,
  setPageSize,
  setSearchText,
} from '../actions/filter.actions';

export const filterInitialState = {
  pageSize: 5,
  searchText: '',
  currentPage: 1,
};

export const filterReducer = createReducer(
  filterInitialState,
  on(setSearchText, (state, { searchString }) => ({
    ...state,
    searchText: searchString,
  })),
  on(setPageSize, (state, { size }) => ({
    ...state,
    pageSize: size,
  })),
  on(setCurrentPage, (state, { page }) => ({
    ...state,
    currentPage: page,
  }))
);
