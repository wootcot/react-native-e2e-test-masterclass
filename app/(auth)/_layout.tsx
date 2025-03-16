import { Redirect, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import Colors from "@/constants/colors";
import { Text } from "@/components/ui/themed";
import { useAuthSession } from "@/stores/auth.context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import colors from "@/constants/colors";

export default function AuthLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const { user, isLoading } = useAuthSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="sign-up"
        options={{
          headerTitle: t("signUp"),
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: Colors[colorScheme ?? "dark"].tint,
          headerStyle: { backgroundColor: Colors[colorScheme ?? "dark"].background },
        }}
      />
    </Stack>
  );
}
