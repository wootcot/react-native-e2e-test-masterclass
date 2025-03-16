import { Pressable, useColorScheme } from "react-native";

import { Text, View } from "../ui/themed";
import { Product } from "@/models/product.model";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

interface ProductBlockProps {
  product: Product;
  cartItemCount?: number;
  orderItemCount?: number;
  showCartActions?: boolean;
  onPress?: (product: Product) => void;
  onPressAdd?: (product: Product) => void;
  onPressSubtract?: (product: Product) => void;
}

export default function ProductBlock(props: ProductBlockProps): React.JSX.Element {
  const colorScheme = useColorScheme();
  const { product, onPressAdd, showCartActions, cartItemCount, onPressSubtract, onPress, orderItemCount } = props;
  const block = (
    <View className="flex-col border-b border-b-gray-300 dark:border-b-gray-800">
      <View className="mb-2 flex-row p-5 xl:p-3 items-center">
        <FontAwesome5
          size={20}
          name="shopping-basket"
          color={colorScheme === "light" ? "#444" : "#ddd"}
          className="border-2 border-black/25 dark:border-white/25 rounded-full p-3"
        />
        <View className="flex-col p-4 flex-grow">
          <Text className="text-xl font-bold tracking-wide">{product.name}</Text>
          <Text className="opacity-50 tracking-wider text-sm">{product.seller_name}</Text>
        </View>
        {orderItemCount && <Text className="mr-3 text-lg tracking-wide">{orderItemCount} x</Text>}
        <Text className="text-2xl font-bold tracking-wider">${product.price}</Text>
      </View>

      {showCartActions && (
        <View className="mb-2 flex-row p-5 xl:p-3 items-center justify-end">
          {cartItemCount && (
            <>
              <Pressable
                onPress={() => onPressSubtract!(product)}
                className="bg-app-blue border-2 border-black/25 dark:border-white/25 rounded-full p-2"
              >
                <FontAwesome5 name="minus" color="#ddd" />
              </Pressable>
              <Text className="w-24 text-center font-black tracking-wide">{cartItemCount}</Text>
            </>
          )}
          <Pressable
            onPress={() => onPressAdd!(product)}
            className="bg-app-blue border-2 border-black/25 dark:border-white/25 rounded-full p-2"
          >
            <FontAwesome5 name="plus" color="#ddd" />
          </Pressable>
        </View>
      )}
    </View>
  );

  if (onPress) return <Pressable onPress={() => onPress(product)}>{block}</Pressable>;
  return block;
}
