import { Product } from "./product.model";

export interface Cart {
  id: number;
  buyer_id: number;
  items: CartItem[];
  buyer_name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartPayload {
  quantity: number;
  productId: number;
}
