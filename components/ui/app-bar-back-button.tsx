import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { useColorScheme } from "@/hooks/use-color-scheme.web";

export default function AppBarBackButton(): React.JSX.Element {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <Pressable onPress={router.back}>
      <FontAwesome
        size={30}
        name="angle-left"
        className="pr-4 py-1.5"
        color={colorScheme === "dark" ? "black" : "white"}
      />
    </Pressable>
  );
}
