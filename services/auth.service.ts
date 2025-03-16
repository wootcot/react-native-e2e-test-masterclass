import { AxiosResponse } from "axios";

import axiosInstance from "./base.service";
import { User } from "@/models/user.model";
import { Auth, LoginFormInput, SignUpFormInput } from "@/models/auth.model";
import { apiGetMyDetails, apiLogin, apiSignUp } from "@/constants/api-end-points";

async function login(payload: LoginFormInput): Promise<AxiosResponse<Auth>> {
  return axiosInstance.post<Auth>(apiLogin, payload);
}

async function signUp(payload: SignUpFormInput): Promise<AxiosResponse<boolean>> {
  return axiosInstance.post<boolean>(apiSignUp, payload);
}

async function getMyDetails(): Promise<AxiosResponse<User>> {
  return axiosInstance.get<User>(apiGetMyDetails);
}

export const authService = {
  login,
  signUp,
  getMyDetails,
};
