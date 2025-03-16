import { createContext, useContext } from "react";

import { ConfirmDialogState } from "@/hooks/use-confirm-dialog-state";

export const ConfirmDialogContext = createContext<ConfirmDialogState | undefined>(undefined);

export default function useConfirmDialog(): ConfirmDialogState {
  return useContext(ConfirmDialogContext)!;
}
