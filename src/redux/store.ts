import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/redux/slices/authSlice";
import pensumReducer from "@/redux/slices/pensumSlice";

const store = configureStore({
  reducer: { auth: authReducer, pensum: pensumReducer },
});

export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
