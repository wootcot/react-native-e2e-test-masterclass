import { View, Text } from "react-native";
import { Snackbar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import colors from "@/constants/colors";
import useSnackBar from "@/stores/snack-bar.context";

export default function AppSnackBar(): React.JSX.Element {
  const {
    dismiss,
    state: { message, type },
  } = useSnackBar();
  const { t } = useTranslation();

  function generateIcon(): React.JSX.Element {
    switch (type) {
      case "info":
        return <FontAwesome size={20} name="info-circle" color="white" />;
      case "success":
        return <FontAwesome size={20} name="check-circle" color="white" />;
      case "error":
        return <FontAwesome size={20} name="warning" color="white" />;
      default:
        return <></>;
    }
  }

  return (
    <Snackbar
      onDismiss={dismiss}
      visible={message != undefined}
      action={{ label: t("close"), onPress: dismiss, labelStyle: { color: "#ccc" } }}
      style={{ backgroundColor: type === "error" ? "#a30000" : colors.dark.secondaryBackground }}
    >
      <View className="flex-row items-center">
        {generateIcon()}
        <Text className="text-white mx-3 font-medium">{message}</Text>
      </View>
    </Snackbar>
  );
}
