import { AxiosResponse } from "axios";

import axiosInstance from "./base.service";
import { Product, ProductFormInput } from "@/models/product.model";
import { apiAddProduct, apiProductsGet, apiUpdateProduct } from "@/constants/api-end-points";

async function get(): Promise<Product[]> {
  const resp = await axiosInstance.get<Product[]>(apiProductsGet);
  return resp.data;
}

async function add(payload: ProductFormInput): Promise<AxiosResponse<Product>> {
  return axiosInstance.post<Product>(apiAddProduct, payload);
}

async function update(payload: ProductFormInput): Promise<AxiosResponse<Product>> {
  return axiosInstance.put<Product>(apiUpdateProduct, payload);
}

export const productsService = {
  get,
  add,
  update,
};
