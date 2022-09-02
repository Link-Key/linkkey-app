import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import WalletReducer from "./reducer/wallet";

const rootReducer = combineReducers({
  walletInfo: WalletReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
export default store;
