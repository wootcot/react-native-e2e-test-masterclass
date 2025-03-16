import * as Yup from "yup";
import { Formik } from "formik";
import { AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, ScrollView, Switch } from "react-native";

import colors from "@/constants/colors";
import useSnackBar from "@/stores/snack-bar.context";
import { authService } from "@/services/auth.service";
import { SignUpFormInput } from "@/models/auth.model";
import { View, Text, AppButton, TextInput } from "@/components/ui/themed";

export default function SignUpScreen() {
  const router = useRouter();
  const snackBar = useSnackBar();
  const { t } = useTranslation();
  const initialFormValues: SignUpFormInput = {
    name: "",
    email: "",
    password: "",
    retype_password: "",
    account_type: "buyer",
  };

  const { mutate, isPending } = useMutation({
    mutationFn: authService.signUp,
    onSuccess: (_: AxiosResponse, __: SignUpFormInput, ___: unknown) => {
      snackBar?.show({ message: t("signUpSuccess"), type: "success" });
      router.dismiss();
    },
    onError: (error: Error, _: SignUpFormInput, __: unknown) => snackBar.showApiError(error),
  });

  function formValidatorSchema() {
    return Yup.object({
      name: Yup.string().required(t("thisFieldIsRequired")),
      password: Yup.string().required(t("thisFieldIsRequired")),
      retype_password: Yup.string().required(t("thisFieldIsRequired")),
      email: Yup.string().email(t("invalidEmail")).required(t("thisFieldIsRequired")),
    });
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white dark:bg-black" behavior="padding">
      <SafeAreaView className="flex-1 xl:w-2/4 xl:self-center" edges={{ top: "off" }}>
        <ScrollView
          bounces={false}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName={Platform.OS === "android" ? "pb-8" : "pb-36"} // padding mimicking height of the app bar.
        >
          <Formik onSubmit={mutate} initialValues={initialFormValues} validationSchema={formValidatorSchema}>
            {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
              <View className="flex-1">
                <TextInput
                  value={values.name}
                  error={errors.name}
                  autoCapitalize="words"
                  placeholder={t("name")}
                  onChangeText={handleChange("name")}
                />
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
                <TextInput
                  secureTextEntry
                  autoCapitalize="none"
                  error={errors.retype_password}
                  value={values.retype_password}
                  placeholder={t("retypePassword")}
                  onChangeText={handleChange("retype_password")}
                />
                <View className="flex-row mx-8 my-5 justify-between">
                  <Text className="text-lg">{t("iamSeller")}</Text>
                  <Switch
                    value={values.account_type === "seller"}
                    onValueChange={(setSeller: boolean) => {
                      setFieldValue("account_type", setSeller ? "seller" : "buyer");
                    }}
                    trackColor={{ true: colors.light.tabIconDefault, false: colors.light.tabIconDefault }}
                    thumbColor={
                      values.account_type === "seller" ? colors.brand.orange : colors.light.secondaryBackground
                    }
                  />
                </View>
                <AppButton title={t("submit")} onPress={() => handleSubmit()} isLoading={isPending} />
              </View>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
