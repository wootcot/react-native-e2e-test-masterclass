import {
  addListener,
  configureStore,
  TypedAddListener,
  ListenerEffectAPI,
  TypedStartListening,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import cartSlice from "./cart-slice.store";

const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error,
});

export const reduxStore = configureStore({
  reducer: {
    [cartSlice.name]: cartSlice.reducer,
  },
  middleware: (gDM) => gDM().prepend(listenerMiddlewareInstance.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export type AppDispatch = typeof reduxStore.dispatch;

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>;

// @see https://redux-toolkit.js.org/api/createListenerMiddleware#typescript-usage
export type AppAddListener = TypedAddListener<RootState, AppDispatch>;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const addAppListener = addListener as AppAddListener;
export const startAppListening = listenerMiddlewareInstance.startListening as AppStartListening;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
