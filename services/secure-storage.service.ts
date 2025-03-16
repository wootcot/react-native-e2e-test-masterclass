import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { Auth } from "@/models/auth.model";

const ACCESS_TOKEN_KEY = "access-token-key";
const REFRESH_TOKEN_KEY = "refresh-token-key";

async function save(auth: Auth): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.access_token);
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, auth.access_token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, auth.refresh_token);
  }
}

async function updateAccessToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }
}

async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

async function clear(): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export const secureStorageService = {
  save,
  clear,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
};
