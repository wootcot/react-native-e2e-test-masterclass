import { useAuthSession } from "@/stores/auth.context";
import MyInventory from "@/components/home/my-inventory";
import ProductsList from "@/components/home/products-list";

export default function TabOneScreen() {
  const { user } = useAuthSession();
  return user?.account_type === "seller" ? <MyInventory /> : <ProductsList />;
}
