import { createSlice } from "@reduxjs/toolkit";

const promoSlice = createSlice({
  name: "promo",
  initialState: { code: "", discount: 0, message: "" },
  reducers: {
    applyPromo(state, action) {
      const code = action.payload.trim().toUpperCase();
      if (code === "SHOP10") {
        state.code = code; state.discount = 0.10; state.message = "SHOP10 applied — you saved 10%!";
      } else if (code === "WELCOME15") {
        state.code = code; state.discount = 0.15; state.message = "WELCOME15 applied — you saved 15%!";
      } else {
        state.code = ""; state.discount = 0; state.message = "That code isn't valid. Try SHOP10 or WELCOME15.";
      }
    },
    removePromo(state) { state.code = ""; state.discount = 0; state.message = "Offer removed."; }
  }
});
export const { applyPromo, removePromo } = promoSlice.actions;
export default promoSlice.reducer;