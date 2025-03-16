import { Image } from "expo-image";
import { Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";

import { ErrorText, View } from "./ui/themed";
import { handleApiError } from "@/utils/api-error-handler";

export default function SplashView({ error }: { error?: any }): React.JSX.Element {
  const imageWidth = Dimensions.get("window").width * 0.55;
  return (
    <View className="flex-1">
      <View className="flex-1 items-end justify-center flex-grow-[3]" />
      <ProgressBar indeterminate className="mb-5" color="#10375c" />
      {error && <ErrorText className="p-4 font-bold">Error: {handleApiError(error)}</ErrorText>}
      <View className="flex-1 items-end pr-8">
        <Image
          transition={1000}
          contentFit="contain"
          source={require("@/assets/images/wootcot-logo/image.png")}
          style={{ width: imageWidth, maxWidth: 200, height: 70 }}
        />
      </View>
    </View>
  );
}
