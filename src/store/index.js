import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import WalletReducer from "./reducer/wallet";

const rootReducer = combineReducers({
  walletInfo: WalletReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

console.log("persistConfig:", persistConfig);

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});
const persistor = persistStore(store);
export { persistor };
export default store;
