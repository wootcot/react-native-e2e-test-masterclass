import React from "react";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Redirect, Tabs, useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import Colors from "@/constants/colors";
import { Text } from "@/components/ui/themed";
import { useAuthSession } from "@/stores/auth.context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import useConfirmDialog from "@/stores/confirm-dialog.context";
import { useClientOnlyValue } from "@/hooks/use-client-only-value";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome5>["name"]; color: string }) {
  return <FontAwesome5 size={20} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { showDialog } = useConfirmDialog();
  const { user, isLoading, onLogout } = useAuthSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(auth)" />;
  }

  async function onConfirmLogout() {
    await onLogout();
    router.replace("/(auth)");
  }

  function onShowDialog() {
    showDialog({
      title: t("areYouSure"),
      onConfirm: onConfirmLogout,
      confirmButtonTitle: t("logout"),
    });
  }

  const headerRightAction = (
    <Pressable onPress={onShowDialog}>
      {({ pressed }) => (
        <FontAwesome5
          size={20}
          name="sign-out-alt"
          color={Colors[colorScheme ?? "light"].text}
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );

  const isSeller = user.account_type === "seller";

  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: true, // headerShown: useClientOnlyValue(false, true), <-- issue on the Web.
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        headerTitleStyle: { letterSpacing: 1, fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => headerRightAction,
          title: isSeller ? t("myInventory") : t("home"),
          tabBarIcon: ({ color }) =>
            isSeller ? <TabBarIcon name="box" color={color} /> : <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="order-history"
        options={{
          title: t("orderHistory"),
          headerRight: () => headerRightAction,
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
    </Tabs>
  );
}
