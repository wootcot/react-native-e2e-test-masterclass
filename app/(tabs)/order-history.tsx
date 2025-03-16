import { useEffect } from "react";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";

import * as _ from "@/stores/cart-slice.store";
import { FlashList } from "@shopify/flash-list";
import ListIsEmpty from "@/components/empty-list";
import { Text, View } from "@/components/ui/themed";
import useSnackBar from "@/stores/snack-bar.context";
import { useAuthSession } from "@/stores/auth.context";
import { orderHistoryService } from "@/services/order_history.service";

export default function OrderHistory() {
  const auth = useAuthSession();
  const snackBar = useSnackBar();
  const { t } = useTranslation();

  const { isFetching, data, error, refetch } = useQuery({
    queryKey: ["get-order-history"],
    queryFn: orderHistoryService.get,
  });

  useEffect(() => {
    if (error) snackBar.showApiError(error);
  }, [error]);

  if (isFetching) return <ActivityIndicator className="flex-1" />;

  return (
    <View className="flex-1 justify-center">
      <FlashList
        data={data?.data}
        estimatedItemSize={105}
        refreshing={isFetching}
        onRefresh={() => refetch()}
        contentContainerClassName="pb-28"
        ListEmptyComponent={() => <ListIsEmpty />}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        centerContent={Object.keys(data?.data ?? {}).length === 0}
        renderItem={({ item, index }) => {
          return (
            <Link href={`/order/${item.id}`}>
              <View className="p-5 flex-row items-center border-b border-b-gray-300 dark:border-b-gray-800">
                <Text className="mr-5 font-semibold">{index + 1}</Text>
                <View className="flex-col flex-grow">
                  <Text className="font-semibold tracking-wider text-lg">
                    {auth.user?.account_type === "seller" ? item.buyer_name : item.seller_name}
                  </Text>
                  <Text className="font-medium tracking-wider text-sm">
                    {t("productsInOrder", { count: item.items.length })}
                  </Text>
                </View>
              </View>
            </Link>
          );
        }}
      />
    </View>
  );
}
