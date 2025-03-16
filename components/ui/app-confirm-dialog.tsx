import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";

import colors from "@/constants/colors";
import useConfirmDialog from "@/stores/confirm-dialog.context";

export default function AppConfirmDialog(): React.JSX.Element {
  const {
    hideDialog,
    isDialogVisible,
    state: { title, body, confirmButtonTitle, onConfirm },
  } = useConfirmDialog();
  const { t } = useTranslation();

  function onPressedConfirm() {
    onConfirm();
    hideDialog();
  }

  return (
    <Portal>
      <Dialog onDismiss={hideDialog} visible={isDialogVisible} style={{ borderRadius: 5, backgroundColor: "#eee" }}>
        <Dialog.Title className="flex-grow">
          <Text className="text-black">{title}</Text>
        </Dialog.Title>
        {body && (
          <Dialog.Content>
            <Text className="text-black">{body}</Text>
          </Dialog.Content>
        )}
        <Dialog.Actions>
          <Button textColor="gray" onPress={hideDialog}>
            {t("cancel")}
          </Button>
          <Button textColor={colors.brand.blue} onPress={onPressedConfirm}>
            {confirmButtonTitle}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
