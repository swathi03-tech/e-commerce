import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import productsReducer from "./features/productsSlice";
import cartReducer from "./features/cartSlice";
import wishlistReducer from "./features/wishlistSlice";
import promoReducer from "./features/promoSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  promo: promoReducer
});
const persistedReducer = persistReducer(
  { key: "shopkart", version: 1, storage, whitelist: ["cart", "wishlist", "promo"] },
  rootReducer
);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
export const persistor = persistStore(store);