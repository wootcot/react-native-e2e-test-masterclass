export interface User {
  id: number;
  name: string;
  email: string;
  account_type: "seller" | "buyer";
}
