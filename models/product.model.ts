export interface Product {
  id: number;
  name: string;
  price: number;
  seller_id: number;
  seller_name: string;
}

export interface ProductFormInput {
  id?: number;
  name?: string;
  price?: number;
}
