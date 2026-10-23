# ShopKart — React + Redux Toolkit demo

## Run it
1. Install Node.js (LTS).
2. Extract this folder and open it in VS Code.
3. Open the terminal in this folder.
4. Run `npm install`
5. Run `npm run dev`
6. Open the local URL printed by Vite.

## Screens
- `/` product listing, search, category filters, sorting, loading/error states
- `/product/:id` product details and quantity selection
- `/cart` quantity controls, remove/clear, shipping, promo codes and totals
- `/wishlist` saved favourites and empty state
- `/offers` apply `SHOP10` (10%) or `WELCOME15` (15%)
- `/login` and registration demo; no backend authentication
- `/checkout` frontend-only order confirmation; no payment is collected

## Redux structure
- `src/store.js`: Redux store + redux-persist
- `src/features/productsSlice.js`: `createAsyncThunk` loads Fake Store API data
- `src/features/cartSlice.js`: add, increase, decrease, remove, clear, selectors
- `src/features/wishlistSlice.js`: toggle/remove favourites
- `src/features/promoSlice.js`: apply/remove demo coupon

## Notes
- Product data uses `https://fakestoreapi.com/products`.
- Cart, wishlist and coupon are persisted in localStorage by redux-persist.
- Demo login status is stored locally only and is not real authentication.
- Fake Store API data/prices are demo data. The 15% old-price display is visual only.
