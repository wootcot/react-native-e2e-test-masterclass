import { useTranslation } from "react-i18next";

import { Text, View } from "@/components/ui/themed";

export default function ListIsEmpty() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 mt-14 justify-center items-center opacity-50">
      <Text className="tracking-widest uppercase w-full text-center">{t("listIsEmpty")}</Text>
    </View>
  );
}
