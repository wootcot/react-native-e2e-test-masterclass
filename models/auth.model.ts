export interface Auth {
  access_token: string;
  refresh_token: string;
}

export interface LoginFormInput {
  email: string;
  password: string;
}

export interface SignUpFormInput {
  name: string;
  email: string;
  password: string;
  retype_password: string;
  account_type: "seller" | "buyer";
}
