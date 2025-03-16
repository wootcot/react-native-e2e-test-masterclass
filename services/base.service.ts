import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

import { apiRenewToken } from "@/constants/api-end-points";
import { secureStorageService } from "./secure-storage.service";

const axiosInstance = axios.create({
  timeout: 1000,
  baseURL: Platform.OS === "android" ? "http://10.0.2.2:9009/api" : "http://localhost:9009/api",
});

function getCustomDateTime(): number {
  const dt = new Date();
  dt.setSeconds(dt.getSeconds() + 2);
  return dt.getTime();
}

axiosInstance.interceptors.request.use(
  async function (config) {
    let accessToken = await secureStorageService.getAccessToken();
    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      if (getCustomDateTime() >= exp! * 1000) {
        const resp = await axios.get(`${axiosInstance.defaults.baseURL}${apiRenewToken}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        accessToken = resp.data;
        await secureStorageService.updateAccessToken(accessToken!);
      }
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
