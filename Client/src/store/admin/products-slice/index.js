import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const email = sessionStorage.getItem("email");
    const result = await axios.get(
      `http://localhost:5000/api/admin/products/get?adminid=${email}`
    );

    return result?.data;
  }
);

// ===== Updated editProduct thunk: accept a payload that contains id + other fields.
// We destructure id and send the rest as the request body.
export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async (payload) => {
    // payload expected: { id: "...", title: "...", price: ..., image: "...", adminid: "..." }
    const { id, ...formData } = payload;
    const result = await axios.put(
      `http://localhost:5000/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });

    // (optional) Add cases for add/edit/delete to update local state quickly if desired:
    builder
      .addCase(addNewProduct.fulfilled, (state, action) => {
        // you can push new product to state.productList if backend returns created product
        if (action.payload?.data) {
          state.productList.unshift(action.payload.data);
        }
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const updated = action.payload.data;
          const idx = state.productList.findIndex((p) => p._id === updated._id);
          if (idx !== -1) state.productList[idx] = updated;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // optional: handle delete locally
        if (action.meta?.arg) {
          state.productList = state.productList.filter(
            (p) => p._id !== action.meta.arg
          );
        }
      });
  },
});

export default AdminProductsSlice.reducer;
