import { createContext, useContext } from "react";

import { SnackBarProps, SnackBarState } from "@/hooks/use-snack-bar-state";

const initialValue = {
  dismiss: () => {},
  showApiError: (error: any) => {},
  show: (state: SnackBarProps) => {},
  state: { message: undefined, type: undefined },
};

export const SnackBarContext = createContext<SnackBarState>(initialValue);

/**
 * Use this in the child components to get and set snackbar's state.
 */
export default function useSnackBar(): SnackBarState {
  return useContext(SnackBarContext);
}
