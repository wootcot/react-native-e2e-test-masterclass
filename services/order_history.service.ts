import { AxiosResponse } from "axios";

import axiosInstance from "./base.service";
import { OrderHistory } from "@/models/order_history.model";
import { apiOrderGetById, apiOrderHistoryGet } from "@/constants/api-end-points";

async function get(): Promise<AxiosResponse<OrderHistory[]>> {
  return axiosInstance.get<OrderHistory[]>(apiOrderHistoryGet);
}

async function getById(id: string): Promise<AxiosResponse<OrderHistory>> {
  return axiosInstance.get<OrderHistory>(apiOrderGetById(id));
}

export const orderHistoryService = {
  get,
  getById,
};
