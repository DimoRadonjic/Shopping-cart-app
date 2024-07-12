import { TemplateRef } from '@angular/core';
import { CartItemArray, ProductArray, ToastType } from '../types/types';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface CheckoutForm {
  name: string;
  address: string;
  email: string;
  telephone: string;
}

export interface CheckoutPayload extends CheckoutForm {
  items: Item[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

export interface Toast {
  template: TemplateRef<any>;
  type: ToastType;
  delay?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  products: ProductArray;
  displayedProducts: ProductArray;
  totalProducts: number;
  inCart: CartItemArray;
  totalCartPrice: number;
  totalCartProducts: number;
}
