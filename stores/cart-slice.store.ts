import { createAsyncThunk, createSlice, GetThunkAPI } from "@reduxjs/toolkit";

import { RootState } from "./main.store";
import { Product } from "@/models/product.model";
import { Cart, CartItem } from "@/models/cart.model";
import { cartService } from "@/services/cart.service";

interface CartState {
  error: any;
  cart: Cart | undefined;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: CartState = {
  error: null,
  status: "idle",
  cart: undefined,
};

const fetchCart = createAsyncThunk("cart/get", async () => {
  const response = await cartService.get();
  return response.data;
});

/**
 * This condition stops subsequent button press if previous update process is still pending.
 */
const condition = (
  updateCartArg: Product,
  { getState }: Pick<GetThunkAPI<any>, "extra" | "getState">
): boolean | undefined => {
  const { cart } = getState() as { cart: CartState };
  if (cart.status === "pending") return false;
};

function findProductInCart(state: CartState, p: Product): CartItem | undefined {
  if (!state.cart?.items) return undefined;
  return state.cart?.items.find((i) => i.product.id === p.id);
}

const addToCart = createAsyncThunk<Cart, Product>(
  "cart/add",
  async (product, { getState }) => {
    const { cart } = getState() as { cart: CartState };
    const cartItem = findProductInCart(cart, product);
    const quantity = (cartItem?.quantity ?? 0) + 1;
    return await cartService.update({ productId: product.id, quantity });
  },
  { condition }
);

const subtractFromCart = createAsyncThunk<Cart, Product>(
  "cart/subtract",
  async (product, { getState }) => {
    const { cart } = getState() as { cart: CartState };
    const cartItem = findProductInCart(cart, product);
    const quantity = (cartItem?.quantity ?? 1) - 1;
    return await cartService.update({ productId: product.id, quantity });
  },
  { condition }
);

const placeOrder = createAsyncThunk<Cart, void>(
  "cart/place-order",
  async () => {
    await cartService.placeOrder();
    return {} as Cart;
  },
  {
    condition: (_, { getState }): boolean | undefined => {
      const { cart } = getState() as { cart: CartState };
      if (cart.status === "pending") return false;
    },
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase("onLogout", (_, __) => initialState);

    builder
      .addCase(fetchCart.pending, (state, _) => {
        state.status = "pending";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });

    builder
      .addCase(addToCart.pending, (state, _) => {
        state.status = "pending";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });

    builder
      .addCase(subtractFromCart.pending, (state, _) => {
        state.status = "pending";
      })
      .addCase(subtractFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(subtractFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });

    builder
      .addCase(placeOrder.pending, (state, _) => {
        state.status = "pending";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

const selectCartState = (state: RootState) => state.cart;

export { fetchCart, selectCartState, findProductInCart, addToCart, subtractFromCart, placeOrder };

export default cartSlice;
