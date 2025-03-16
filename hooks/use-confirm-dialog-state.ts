import { useState } from "react";

export interface ConfirmDialogProps {
  title: string;
  body?: string;
  onConfirm: () => void;
  confirmButtonTitle: string;
}

export interface ConfirmDialogState {
  hideDialog: () => void;
  isDialogVisible: boolean;
  state: ConfirmDialogProps;
  showDialog: (newValue: ConfirmDialogProps) => void;
}

const defaultValue: ConfirmDialogProps = {
  title: "",
  onConfirm: () => {},
  confirmButtonTitle: "",
};

/**
 * Use value in the parent component to pass it to the `ConfirmDialogContext.Provider`.
 *
 * @see useConfirmDialog Use this in the child components to access the confirm dialog state.
 */
export function useConfirmDialogState(): ConfirmDialogState {
  const [state, setState] = useState<ConfirmDialogProps>(defaultValue);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const hideDialog = () => {
    setState(defaultValue);
    setIsDialogVisible(false);
  };

  const showDialog = (newValue: ConfirmDialogProps) => {
    setState(newValue);
    setIsDialogVisible(true);
  };

  return { state, isDialogVisible, showDialog, hideDialog };
}
