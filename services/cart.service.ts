import { AxiosResponse } from "axios";

import axiosInstance from "./base.service";
import { Cart, CartPayload } from "@/models/cart.model";
import { apiCartGet, apiCartPlaceOrder, apiCartUpdate } from "@/constants/api-end-points";

async function get(): Promise<AxiosResponse<Cart>> {
  return axiosInstance.get<Cart>(apiCartGet);
}

async function update({ productId, quantity }: CartPayload): Promise<Cart> {
  const { data } = await axiosInstance.put<Cart>(apiCartUpdate, { product_id: productId, quantity });
  return data;
}

async function placeOrder(): Promise<AxiosResponse<boolean>> {
  return axiosInstance.put<boolean>(apiCartPlaceOrder);
}

export const cartService = {
  get,
  update,
  placeOrder,
};
