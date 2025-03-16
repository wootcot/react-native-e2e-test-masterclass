import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cartUtil } from "@/utils/cart.util";
import * as _ from "@/stores/cart-slice.store";
import { FlashList } from "@shopify/flash-list";
import { Product } from "@/models/product.model";
import ListIsEmpty from "@/components/empty-list";
import useSnackBar from "@/stores/snack-bar.context";
import { AppButton, Text, View } from "@/components/ui/themed";
import ProductBlock from "@/components/products/product-block";
import useConfirmDialog from "@/stores/confirm-dialog.context";
import { useAppDispatch, useAppSelector } from "@/stores/main.store";

export default function CartScreen() {
  const router = useRouter();
  const snackBar = useSnackBar();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { showDialog } = useConfirmDialog();
  const cartState = useAppSelector(_.selectCartState);

  useEffect(() => {
    if (!cartState.cart) dispatch(_.fetchCart());
  }, []);

  useEffect(() => {
    if (cartState.error) snackBar.showApiError(cartState.error);
  }, [cartState.error]);

  useEffect(() => {
    if (typeof cartState.cart === "object" && Object.keys(cartState.cart).length === 0) {
      router.dismissTo("/(tabs)");
    }
  }, [cartState.cart]);

  function onPressAdd(product: Product): void {
    dispatch(_.addToCart(product));
  }

  function onPressSubtract(product: Product): void {
    dispatch(_.subtractFromCart(product));
  }

  async function onPlaceOrder(): Promise<void> {
    showDialog({
      title: t("areYouSure"),
      onConfirm: onConfirmPlaceOrder,
      confirmButtonTitle: t("placeOrder"),
    });
  }

  async function onConfirmPlaceOrder(): Promise<void> {
    await dispatch(_.placeOrder());
    if (!cartState.error) snackBar.show({ message: t("placeOrderSuccess"), type: "success" });
  }

  const isEmptyCart = Object.keys(cartState.cart ?? {}).length === 0;

  return (
    <View className="flex-1 justify-center pb-4" style={{ paddingBottom: insets.bottom + 18 }}>
      <FlashList
        extraData={cartState}
        estimatedItemSize={105}
        centerContent={isEmptyCart}
        data={cartState.cart?.items}
        contentContainerClassName="pb-28"
        ListEmptyComponent={() => <ListIsEmpty />}
        keyExtractor={(item, index) => `${index}-${item.product.id}`}
        renderItem={({ item }) => {
          const cartItemCount = _.findProductInCart(cartState, item.product)?.quantity;
          return (
            <ProductBlock
              product={item.product}
              showCartActions
              onPressAdd={onPressAdd}
              cartItemCount={cartItemCount}
              onPressSubtract={onPressSubtract}
            />
          );
        }}
      />
      <View className="flex-row items-end justify-center mt-3">
        <Text className="text-center mr-1 mb-1 text-xl tracking-wider">{t("total")}:</Text>
        <Text className="text-center font-bold text-4xl tracking-wider">
          ${isEmptyCart ? "-" : cartUtil.cartTotal(cartState.cart!)}
        </Text>
      </View>
      <AppButton title={t("placeOrder")} onPress={onPlaceOrder} isLoading={cartState.status === "pending"} />
    </View>
  );
}
