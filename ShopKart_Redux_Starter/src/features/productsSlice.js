import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) throw new Error(`Could not load products (${response.status})`);
  return response.json();
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"; state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"; state.error = action.error.message || "Something went wrong.";
      });
  }
});
export default productsSlice.reducer;