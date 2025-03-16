export const apiLogin: string = "/login";
export const apiSignUp: string = "/sign-up";
export const apiGetMyDetails: string = "/me";
export const apiRenewToken: string = "/renew-token";

export const apiProductsGet: string = "/products";
export const apiAddProduct: string = "/product/add";
export const apiUpdateProduct: string = "/product/update";

export const apiOrderHistoryGet: string = "/order-history";
export const apiOrderGetById = (id: string): string => `/order/${id}`;

export const apiCartGet: string = "/cart";
export const apiCartUpdate: string = "/cart/update";
export const apiCartPlaceOrder: string = "/cart/place-order";
