import * as Yup from "yup";
import { AxiosResponse } from "axios";
import { useEffect, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

import useSnackBar from "@/stores/snack-bar.context";
import { productsService } from "@/services/products.service";
import { Product, ProductFormInput } from "@/models/product.model";
import { View, AppButton, TextInput } from "@/components/ui/themed";

export default function ProductUploadFormScreen() {
  const snackBar = useSnackBar();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const formik = useRef<FormikProps<ProductFormInput>>(null);

  const isUpdate = params?.id;
  const initialFormValues: ProductFormInput = {
    id: undefined,
    name: undefined,
    price: undefined,
  };

  const addMutation = useMutation({
    onError,
    onSuccess,
    mutationKey: ["product/add"],
    mutationFn: productsService.add,
  });

  const updateMutation = useMutation({
    onError,
    onSuccess,
    mutationKey: ["product/update"],
    mutationFn: productsService.update,
  });

  useEffect(() => {
    if (isUpdate) {
      navigation.setOptions({ title: t("updateProduct") });
      formik.current?.setValues({
        id: Number(params.id),
        price: Number(params.price),
        name: params.name as string,
      });
    }
  }, [params?.id]);

  function onError(error: Error, _: ProductFormInput, __: unknown) {
    snackBar.showApiError(error);
  }

  async function onSuccess(resp: AxiosResponse<Product, any>, __: ProductFormInput, ___: unknown) {
    formik.current?.resetForm();
    snackBar?.show({ type: "success", message: isUpdate ? t("productUpdateSuccess") : t("productUploadSuccess") });
    handleLocalUpdate(resp.data);
    navigation.goBack();
  }

  async function handleLocalUpdate(updates: Product) {
    const queryKey = ["get-inventories"];
    queryClient.setQueryData(queryKey, (oldCache: Product[]) => {
      const newList = [...(oldCache ?? [])];
      if (isUpdate) {
        const index = newList.findIndex((cp) => cp.id === updates.id);
        newList[index] = updates;
      } else {
        newList.push(updates);
      }
      return newList;
    });
  }

  function formValidatorSchema() {
    return Yup.object({
      name: Yup.string().min(3).required(t("thisFieldIsRequired")),
      price: Yup.number().min(0.1).required(t("thisFieldIsRequired")).typeError(t("invalidPrice")),
    });
  }

  return (
    <KeyboardAvoidingView className="flex-1 dark:bg-black" behavior="padding">
      <SafeAreaView className="flex-1" edges={{ top: "off" }}>
        <ScrollView
          bounces={false}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName={Platform.OS === "android" ? "pb-8" : "pb-36"} // padding mimicking height of the app bar.
        >
          <Formik
            innerRef={formik}
            initialValues={initialFormValues}
            validationSchema={formValidatorSchema}
            onSubmit={(values) => (isUpdate ? updateMutation.mutate(values) : addMutation.mutate(values))}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <View className="flex-1">
                <TextInput
                  value={values.name}
                  error={errors.name}
                  autoCapitalize="words"
                  placeholder={t("name")}
                  onChangeText={handleChange("name")}
                />
                <TextInput
                  error={errors.price}
                  autoCapitalize="none"
                  placeholder={t("price")}
                  keyboardType="decimal-pad"
                  onChangeText={handleChange("price")}
                  value={values.price && values.price >= 0 ? `${values.price}` : ""}
                />
                <AppButton
                  onPress={() => handleSubmit()}
                  title={isUpdate ? t("update") : t("submit")}
                  isLoading={addMutation.isPending || updateMutation.isPending}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
