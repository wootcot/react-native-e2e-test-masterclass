import { CartItem } from "./cart.model";

export interface OrderHistory {
  id: number;
  buyer_id: number;
  seller_id: number;
  items: CartItem[];
  buyer_name: string;
  seller_name: string;
}
