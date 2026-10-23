import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);
      state.items = exists ? state.items.filter((item) => item.id !== product.id) : [...state.items, product];
    },
    removeWishlistItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    }
  }
});
export const { toggleWishlist, removeWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;