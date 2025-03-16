import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { cartUtil } from "@/utils/cart.util";
import * as _ from "@/stores/cart-slice.store";
import { FlashList } from "@shopify/flash-list";
import ListIsEmpty from "@/components/empty-list";
import { Text, View } from "@/components/ui/themed";
import useSnackBar from "@/stores/snack-bar.context";
import { useAuthSession } from "@/stores/auth.context";
import ProductBlock from "@/components/products/product-block";
import { orderHistoryService } from "@/services/order_history.service";

export default function OrderDetailsScreen() {
  const auth = useAuthSession();
  const { t } = useTranslation();
  const snackBar = useSnackBar();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { isFetching, data, error } = useQuery({
    queryKey: ["get-order-by-id"],
    queryFn: () => orderHistoryService.getById(params["id"] as string),
  });

  useEffect(() => {
    if (data?.data) {
      const { buyer_name, seller_name } = data?.data;
      const title = auth.user?.account_type === "seller" ? buyer_name : seller_name;
      navigation.setOptions({ title });
    }
  }, [data?.data, navigation]);

  useEffect(() => {
    if (error) snackBar.showApiError(error);
  }, [error]);

  if (isFetching) return <ActivityIndicator className="flex-1" />;

  return (
    <SafeAreaView className="flex-1" edges={{ top: "off", bottom: "maximum" }}>
      <View className="flex-1 justify-center">
        <FlashList
          data={data?.data.items}
          estimatedItemSize={105}
          contentContainerClassName="pb-28"
          ListEmptyComponent={() => <ListIsEmpty />}
          centerContent={Object.keys(data ?? {}).length === 0}
          keyExtractor={(item, index) => `${index}-${item.product}`}
          renderItem={({ item }) => <ProductBlock product={item.product} orderItemCount={item.quantity} />}
        />
        <View className="flex-row items-end justify-end py-3 px-6">
          <Text className="text-center mr-1 mb-1 text-xl tracking-wider">{t("total")}:</Text>
          <Text className="text-end font-bold text-4xl tracking-wider">${cartUtil.orderTotal(data!.data)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
