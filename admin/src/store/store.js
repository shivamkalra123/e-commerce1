// admin/src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import currencyReducer from "./currency-slice";

const store = configureStore({
  reducer: {
    currency: currencyReducer,
  },
});

export default store; // 👈 important: default export
