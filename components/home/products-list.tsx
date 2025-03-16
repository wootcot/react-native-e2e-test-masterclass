import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, IconButton } from "react-native-paper";
import { ActivityIndicator, View as DefaultView } from "react-native";

import ListIsEmpty from "../empty-list";
import * as _ from "@/stores/cart-slice.store";
import { FlashList } from "@shopify/flash-list";
import { Product } from "@/models/product.model";
import useSnackBar from "@/stores/snack-bar.context";
import { ShadowView, View } from "@/components/ui/themed";
import { productsService } from "@/services/products.service";
import ProductBlock from "@/components/products/product-block";
import { useAppDispatch, useAppSelector } from "@/stores/main.store";

export default function ProductsList() {
  const router = useRouter();
  const snackBar = useSnackBar();
  const dispatch = useAppDispatch();
  const cartState = useAppSelector(_.selectCartState);

  const { isFetching, data, error } = useQuery({
    queryKey: ["get-products"],
    queryFn: productsService.get,
  });
  const isLoading = cartState.status === "pending";

  useEffect(() => {
    dispatch(_.fetchCart());
  }, []);

  useEffect(() => {
    if (error) snackBar.showApiError(error);
    else if (cartState.error) snackBar.showApiError(cartState.error);
  }, [error, cartState.error]);

  if (isFetching) return <ActivityIndicator className="flex-1" />;

  function onPressAdd(product: Product): void {
    dispatch(_.addToCart(product));
  }

  function onPressSubtract(product: Product): void {
    dispatch(_.subtractFromCart(product));
  }

  function onPressCart(): void {
    router.push("/cart");
  }

  return (
    <View className="flex-1 justify-center">
      <FlashList
        data={data}
        extraData={cartState}
        estimatedItemSize={205}
        contentContainerClassName="pb-28"
        ListEmptyComponent={() => <ListIsEmpty />}
        centerContent={Object.keys(data ?? {}).length === 0}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        renderItem={({ item }) => {
          const cartItemCount = _.findProductInCart(cartState, item)?.quantity;
          return (
            <ProductBlock
              product={item}
              showCartActions
              onPressAdd={onPressAdd}
              cartItemCount={cartItemCount}
              onPressSubtract={onPressSubtract}
            />
          );
        }}
      />
      {((cartState.cart && Object.keys(cartState.cart).length != 0) || isLoading) && (
        <ShadowView className="absolute overflow-visible right-5 bottom-5 bg-app-orange rounded-full h-16 w-16 items-center justify-center">
          <DefaultView className="relative overflow-visible flex items-center justify-center h-14 w-14">
            <DefaultView className="absolute -top-1.5 -right-2 xl:-top-0 xl:-right-0">
              <Badge>{cartState.cart?.items?.length}</Badge>
            </DefaultView>
            {isLoading ? (
              <ActivityIndicator size={30} color="#eee" />
            ) : (
              <IconButton size={28} icon="cart" iconColor="#eee" onPress={onPressCart} />
            )}
          </DefaultView>
        </ShadowView>
      )}
    </View>
  );
}
