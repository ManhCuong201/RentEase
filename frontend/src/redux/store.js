import servicesReducer from "./slices/servicesSlice"; // Đảm bảo đường dẫn đúng
import furnitureReducer from "./slices/furnituresSlice"; // Đảm bảo đường dẫn đúng
import userReducer from "./slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    services: servicesReducer,
    furniture: furnitureReducer,
    user: userReducer,
  },
});

export default store;
