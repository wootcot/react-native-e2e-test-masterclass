import { createContext, useContext } from "react";

import { User } from "@/models/user.model";
import { SetAuthAction } from "@/hooks/use-auth-state";

interface AuthProps {
  isLoading: boolean;
  onLogin: SetAuthAction;
  user?: User | undefined;
  onLogout: () => Promise<void>;
}

const initialValue: AuthProps = {
  user: undefined,
  isLoading: false,
  onLogin: () => Promise.resolve(),
  onLogout: () => Promise.resolve(),
};

const AuthContext = createContext<AuthProps>(initialValue);

/**
 * Use this to access or modify `AuthProps`.
 */
function useAuthSession(): AuthProps {
  const authState = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!authState) {
      throw new Error("useAuthSession must be wrapped in a <AuthContext.Provider />");
    }
  }
  return authState;
}

export { AuthContext, useAuthSession };
