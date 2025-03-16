import { useState } from "react";

import { handleApiError } from "@/utils/api-error-handler";

export interface SnackBarProps {
  message?: string;
  type?: "success" | "info" | "error";
}

export interface SnackBarState {
  dismiss: () => void;
  state: SnackBarProps;
  showApiError: (error: any) => void;
  show: (state: SnackBarProps) => void;
}

const defaultState: SnackBarProps = { message: undefined, type: undefined };

/**
 * Use value in the parent component to pass it to the `SnackBarContext.Provider`.
 *
 * @see useSnackBar Use this to access the state of the snack bar in the child components.
 */
export default function useSnackBarState(): SnackBarState {
  const [state, show] = useState<SnackBarProps>(defaultState);

  const dismiss = () => show(defaultState);
  const showApiError = (error: any) => show({ message: handleApiError(error), type: "error" });

  return { state, show, showApiError, dismiss };
}
