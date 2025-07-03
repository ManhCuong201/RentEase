import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const furnitureSlice = createSlice({
  name: "furniture",
  initialState,
  reducers: {
    setFurniture: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setFurniture, setLoading, setError } = furnitureSlice.actions;
export default furnitureSlice.reducer;
