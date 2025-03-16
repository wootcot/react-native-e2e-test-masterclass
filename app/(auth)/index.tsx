import * as Yup from "yup";
import { Formik } from "formik";
import { Image } from "expo-image";
import { AxiosResponse } from "axios";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, KeyboardAvoidingView, ScrollView } from "react-native";

import useSnackBar from "@/stores/snack-bar.context";
import { authService } from "@/services/auth.service";
import { useAuthSession } from "@/stores/auth.context";
import { Auth, LoginFormInput } from "@/models/auth.model";
import { View, Text, AppButton, TextInput } from "@/components/ui/themed";

export default function LoginScreen() {
  const router = useRouter();
  const snackBar = useSnackBar();
  const { t } = useTranslation();
  const { onLogin } = useAuthSession();
  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onError: (error: Error, _: LoginFormInput, __: unknown) => snackBar.showApiError(error),
    onSuccess: async (resp: AxiosResponse<Auth, any>, variables: LoginFormInput, context: unknown) => {
      await onLogin(resp.data);
      router.replace("/(tabs)");
    },
  });

  function formValidatorSchema() {
    return Yup.object({
      password: Yup.string().required(t("thisFieldIsRequired")),
      email: Yup.string().email(t("invalidEmail")).required(t("thisFieldIsRequired")),
    });
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white dark:bg-black" behavior="padding">
      <SafeAreaView className="flex-1 xl:w-2/4 xl:self-center">
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerClassName="flex-grow py-8">
          <View className="flex-1 self-center items-end justify-center flex-grow-[8] lg:flex-grow">
            <Image
              transition={1000}
              contentFit="contain"
              source={require("@/assets/images/wootcot-logo/image.png")}
              style={{ width: Dimensions.get("window").width * 0.6, maxWidth: 220, height: 70 }}
            />
            <Text className="text-sm tracking-wider">by Alish Giri</Text>
          </View>

          <View className="items-center w-full flex-1">
            <Text className="tracking-widest font-bold mb-3">{t("pleaseLogin")}</Text>

            <Formik
              onSubmit={mutate}
              validationSchema={formValidatorSchema}
              initialValues={{ email: "", password: "" }}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
                <View className="w-full">
                  <TextInput
                    value={values.email}
                    error={errors.email}
                    autoCapitalize="none"
                    placeholder={t("email")}
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                  />
                  <TextInput
                    secureTextEntry
                    autoCapitalize="none"
                    error={errors.password}
                    value={values.password}
                    placeholder={t("password")}
                    onChangeText={handleChange("password")}
                  />
                  <AppButton title={t("login")} onPress={() => handleSubmit()} isLoading={isPending} />
                </View>
              )}
            </Formik>

            <View className="flex-row mt-8">
              <Text className="text-lg">{t("doNotHaveAnAccount")}</Text>
              <Link href="/(auth)/sign-up" className="ml-2 font-semibold text-xl tracking-wide dark:text-white">
                {t("signUpExclamation")}
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
