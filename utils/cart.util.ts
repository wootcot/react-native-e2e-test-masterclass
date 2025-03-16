import { Cart } from "@/models/cart.model";
import { OrderHistory } from "@/models/order_history.model";

function cartTotal(cart: Cart): number {
  let total = 0;
  for (let item of cart.items) {
    total += item.quantity * item.product.price;
  }
  return Math.floor(total * 100) / 100;
}

function orderTotal(order: OrderHistory): number {
  let total = 0;
  for (let item of order.items) {
    total += item.quantity * item.product.price;
  }
  return Math.floor(total * 100) / 100;
}

export const cartUtil = {
  cartTotal,
  orderTotal,
};
