import { useEffect, useCallback, useState } from "react";

import { Auth } from "@/models/auth.model";
import { User } from "@/models/user.model";
import { authService } from "@/services/auth.service";
import { secureStorageService } from "@/services/secure-storage.service";

type Error = any;
type AuthState<T> = [boolean, T | undefined];
export type SetAuthAction = (value: Auth | undefined) => Promise<void>;

type UseAuthState = [AuthState<User>, SetAuthAction, Error];

/**
 * This is the mutable state of the AuthContext.
 *
 * Use this in the parent component to pass the state of this hook to the `AuthContext.Provider`.
 */
export function useAuthState(): UseAuthState {
  const [error, setError] = useState<any>(undefined);
  const [authState, setAuthState] = useState<AuthState<User>>([true, undefined]);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const setAuthSession = useCallback(async (data: Auth | undefined): Promise<void> => {
    if (data) {
      await secureStorageService.save(data);
      await fetchUserDetails();
      return;
    }
    await secureStorageService.clear();
    setAuthState([false, undefined]);
  }, []);

  async function checkIfLoggedIn() {
    const token = await secureStorageService.getAccessToken();
    if (token) {
      await fetchUserDetails();
    } else {
      setAuthState([false, undefined]);
    }
  }

  async function fetchUserDetails() {
    try {
      const resp = await authService.getMyDetails();
      setAuthState([false, resp.data]);
    } catch (e) {
      setError(e);
    }
  }

  return [authState, setAuthSession, error];
}
