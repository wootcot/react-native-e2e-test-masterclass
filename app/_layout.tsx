import i18next from "i18next";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocales } from "expo-localization";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, Platform } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import colors from "@/constants/colors";
import { Text } from "@/components/ui/themed";
import { reduxStore } from "@/stores/main.store";
import SplashView from "@/components/splash-view";
import { AuthContext } from "@/stores/auth.context";
import { useAuthState } from "@/hooks/use-auth-state";
import AppSnackBar from "@/components/ui/app-snack-bar";
import useSnackBarState from "@/hooks/use-snack-bar-state";
import { SnackBarContext } from "@/stores/snack-bar.context";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { useClientOnlyValue } from "@/hooks/use-client-only-value";
import { ConfirmDialogContext } from "@/stores/confirm-dialog.context";
import { useConfirmDialogState } from "@/hooks/use-confirm-dialog-state";

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

export const unstable_settings = { initialRouteName: "index" };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [error, setError] = useState<any>(null);
  const [appLoaded, setAppLoaded] = useState<boolean>(false);
  const [[isLoading, user], setAuthSession, authError] = useAuthState();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        await loadLocale();
        await Font.loadAsync({
          SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
          ...FontAwesome.font,
        });
      } catch (e) {
        setError(e);
      } finally {
        setAppLoaded(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appLoaded) SplashScreen.hide();
  }, [appLoaded]);

  async function loadLocale() {
    if (Platform.OS === "web") return; // Use browser language detector.
    let savedLanguage = null; // Load from AsyncStorage
    if (!savedLanguage) {
      savedLanguage = getLocales().at(0)?.languageCode ?? "en";
    }
    if (savedLanguage) await i18next.changeLanguage(savedLanguage);
  }

  if (!appLoaded || isLoading) return <SplashView error={authError} />;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        onLogin: setAuthSession,
        onLogout: () => setAuthSession(undefined),
      }}
    >
      <RootLayoutNav />
    </AuthContext.Provider>
  );
}

// DO NOT create this inside of a component. This will un-stabilize the query client,
// and bring unexpected behaviors when performing certain actions.
// For example: On request success, manually updating cache data will set the cache to be undefined.
const queryClient = new QueryClient();

function RootLayoutNav(): React.JSX.Element {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const snackBarState = useSnackBarState();
  const confirmDialogState = useConfirmDialogState();

  const theme = colors[colorScheme ?? "dark"];

  return (
    <>
      <StatusBar style={colorScheme == "light" ? "dark" : "light"} />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <ConfirmDialogContext.Provider value={confirmDialogState}>
            <PaperProvider settings={{ rippleEffectEnabled: Platform.OS !== "ios" }}>
              <SnackBarContext.Provider value={snackBarState}>
                <Provider store={reduxStore}>
                  <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen
                      name="product/upload"
                      options={{
                        title: t("productUpload"),
                        headerShadowVisible: false,
                        headerTintColor: theme.tint,
                        headerBackButtonDisplayMode: "minimal",
                        headerShown: useClientOnlyValue(false, true),
                        headerStyle: { backgroundColor: theme.background },
                      }}
                    />
                    <Stack.Screen
                      name="cart"
                      options={{
                        headerTintColor: theme.tint,
                        headerBackButtonDisplayMode: "minimal",
                        headerShown: useClientOnlyValue(false, true),
                        headerStyle: { backgroundColor: theme.background },
                        headerTitle: () => <Text className="tracking-wider font-bold text-lg">{t("cart")}</Text>,
                      }}
                    />
                    <Stack.Screen
                      name="order/[id]"
                      options={{
                        title: "",
                        headerTintColor: theme.tint,
                        headerBackButtonDisplayMode: "minimal",
                        headerShown: useClientOnlyValue(false, true),
                      }}
                    />
                  </Stack>
                </Provider>
                <AppSnackBar />
              </SnackBarContext.Provider>
              <AppConfirmDialog />
            </PaperProvider>
          </ConfirmDialogContext.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
