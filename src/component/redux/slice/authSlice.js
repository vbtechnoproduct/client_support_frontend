/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance, apiInstanceFetch } from "../../api/axiosApi";
import jwt_decode from "jwt-decode";
import { SetDevKey, setToken } from "../../utils/setAuth";
import { key } from "../../utils/config";
import { DangerRight, Success } from "../../api/toastServices";
import axios from "axios";

const initialState = {
  admin: {},
  isAuth: false,
  dashboardCount: {},
  isLoading: false,
};

export const signUp = createAsyncThunk("admin/signUp", async (payload) => {

  return apiInstance.post("admin/signUp", payload);
});
export const updateCode = createAsyncThunk(
  "admin/updateCode",
  async (payload) => {
    return apiInstance.patch("admin/updateCode", payload);
  }
);

export const login = createAsyncThunk("admin/login", async (payload) => {
  return apiInstance.post("admin/login", payload);
});

export const getAdmin = createAsyncThunk("admin/profile", async () => {
  return apiInstanceFetch.get("admin/profile");
});

export const getDashboardCount = createAsyncThunk("dashboard/dashboardCount", async (payload) => {
  return apiInstanceFetch.get(`dashboard/dashboardCount?startDate=${payload.startDate}&endDate=${payload?.endDate}`);
});


export const updateAdmin = createAsyncThunk("admin/updateProfile", async (payload) => {
  return apiInstance.patch("admin/updateProfile", payload?.data);
});

export const updateAdminPassword = createAsyncThunk(
  "admin/updatePassword",
  async (payload) => {
    return apiInstance.patch("admin/updatePassword", payload?.data);
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setOldAdmin(state, action) {
      let token = action.payload;
      state.admin = token;
      state.isAuth = true;
      SetDevKey(key);
      setToken(token);
    },
    logout(state, action) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("admin_");
      sessionStorage.removeItem("key");
      sessionStorage.removeItem("isAuth");
      state.admin = {};
      state.isAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload && action.payload.status !== false) {
        let token_ = jwt_decode(action.payload.data);
        state.flag = action.payload.flag;
        state.admin = token_;
        state.isAuth = true;
        // state.isLoading = false;
        SetDevKey(key);
        setToken(action.payload.data);
        sessionStorage.setItem("token", action.payload.data);
        sessionStorage.setItem("key", key ? key : undefined);
        sessionStorage.setItem("isAuth", true);
        sessionStorage.setItem("user", JSON.stringify("admin"))
        sessionStorage.setItem("admin", JSON.stringify(token_));
        window.location.href = "/admin/dashboard"
        Success("Login successfully");
        // state.isLoading = false;
      } else {
        DangerRight(action?.payload?.message);
        // state.isLoading = false;
      }
      state.isLoading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getAdmin.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.admin = {
        ...state.admin,
        _id: action.payload?.data?._id,
        flag: action.payload?.data?.flag,
        name: action.payload?.data?.name,
        email: action.payload?.data?.email,
        image: action.payload?.data?.image,
      };
    });

    builder.addCase(getAdmin.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updateAdmin.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(updateAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.admin = {
        ...state.admin,
        name: action.payload?.data?.name,
        email: action.payload?.data?.email,
        image: action.payload?.data?.image,
      };
      state.isLoading = false;
      Success("Admin Updated Successfully");
    });

    builder.addCase(updateAdmin.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updateAdminPassword.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(updateAdminPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.admin = action?.payload?.admin;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("key");
      sessionStorage.removeItem("isAuth");
      setToken();
      SetDevKey();
      state.admin = {};
      state.isAuth = false;

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      Success("Admin Updated Successfully");
    });

    builder.addCase(updateAdminPassword.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(signUp.pending, (state, action) => {

      state.isLoading = true;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {

      if (action?.payload?.status) {
        Success("Admin Create Successfully");
      }
      state.isLoading = false;
    });
    builder.addCase(signUp.rejected, (state, action) => {

      state.isLoading = false;
    });
    builder.addCase(updateCode.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(updateCode.fulfilled, (state, action) => {
      state.isLoading = false;
      Success("Code Update Successfully");
      setTimeout(() => {
        window.location.href = "/login";
      }, 10);
    });
    builder.addCase(updateCode.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getDashboardCount.pending, (state, action) => {

      state.isLoading = true;
    });

    builder.addCase(getDashboardCount.fulfilled, (state, action) => {
      state.dashboardCount = action.payload.data
      state.isLoading = false;
    });
    builder.addCase(getDashboardCount.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
export default authSlice.reducer;
export const { setOldAdmin, logout } = authSlice.actions;
