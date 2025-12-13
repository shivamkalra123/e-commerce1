// admin/src/store/currency-slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCurrency: "USD",
  supportedCurrencies: [
    { code: "USD", symbol: "$", label: "US Dollar" },
    { code: "EUR", symbol: "€", label: "Euro" },
    { code: "GBP", symbol: "£", label: "British Pound" },
    { code: "ZAR", symbol: "R", label: "South African Rand" },
    { code: "GHS", symbol: "₵", label: "Ghanaian Cedi" },
  ],
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency(state, action) {
      state.selectedCurrency = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;

// 👇 This is what store.js will import
export default currencySlice.reducer;
