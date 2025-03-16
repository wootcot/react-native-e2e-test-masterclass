import { useEffect } from "react";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import { ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";

import ListIsEmpty from "../empty-list";
import { FlashList } from "@shopify/flash-list";
import { Product } from "@/models/product.model";
import useSnackBar from "@/stores/snack-bar.context";
import ProductBlock from "../products/product-block";
import { ShadowView, View } from "@/components/ui/themed";
import { productsService } from "@/services/products.service";

export default function MyInventory() {
  const router = useRouter();
  const snackBar = useSnackBar();
  const { isFetching, data, error, refetch } = useQuery({
    queryFn: productsService.get,
    queryKey: ["get-inventories"],
  });

  useEffect(() => {
    if (error) snackBar.showApiError(error);
  }, [error]);

  if (isFetching) return <ActivityIndicator className="flex-1" />;

  function onPressAddProduct(): void {
    router.push("/product/upload");
  }

  function onPressEdit(product: Product): void {
    router.push({ pathname: "/product/upload", params: { ...product } });
  }

  return (
    <View className="flex-1 justify-center">
      <FlashList
        data={data}
        onRefresh={refetch}
        refreshing={isFetching}
        estimatedItemSize={105}
        contentContainerClassName="pb-28"
        ListEmptyComponent={() => <ListIsEmpty />}
        centerContent={Object.keys(data ?? {}).length === 0}
        renderItem={({ item }) => <ProductBlock product={item} onPress={onPressEdit} />}
      />
      <ShadowView className="absolute right-5 bottom-5 bg-app-orange rounded-full">
        <IconButton size={30} icon="plus" iconColor="white" onPress={onPressAddProduct} />
      </ShadowView>
    </View>
  );
}
