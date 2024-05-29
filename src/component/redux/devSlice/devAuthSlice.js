/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance, apiInstanceFetch } from "../../api/axiosApi";
import jwt_decode from "jwt-decode";
import { SetDevKey, setToken } from "../../utils/setAuth";
import { key } from "../../utils/config";
import { DangerRight, Success } from "../../api/toastServices";
import axios from "axios";

const initialState = {
  devLogin: {},
  isAuthDev: false,
  dashboardCount: {},
  isLoading: false,
};



export const devLogin = createAsyncThunk("developer/login", async (payload) => {
  return apiInstance.post(`developer/login?pin=${payload?.pin}`);
});

export const getDev = createAsyncThunk("developer/getDevProfile", async (payload) => {
  return apiInstance.get(`developer/getDevProfile?developerId=${payload}`);
});
export const updateDeveloperDev = createAsyncThunk(
  "developer/devupdate",
  async (payload) => {
    return apiInstance.patch(`developer/update?developerId=${payload?.id}`, payload?.data);
  }
);
export const getDashboardCount = createAsyncThunk("dashboard/dashboardCount", async (payload) => {
  return apiInstanceFetch.get(`dashboard/dashboardCount?startDate=${payload.startDate}&endDate=${payload?.endDate}&developer=${payload?.developer}`);
});


const devAuthSlice = createSlice({
  name: "devAuthSlice",
  initialState,
  reducers: {
    setOldDev(state, action) {
      let token = action.payload;
      state.devLogin = token;
      state.isAuthDev = true;
      SetDevKey(key);
      setToken(token);
    },
    logoutDev(state, action) {
      sessionStorage.removeItem("devToken");
      sessionStorage.removeItem("dev");
      sessionStorage.removeItem("key");
      sessionStorage.removeItem("isAuthDev");
      state.devLogin = {};
      state.isAuthDev = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(devLogin.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(devLogin.fulfilled, (state, action) => {
      if (action.payload && action.payload.status !== false) {
        let token_ = jwt_decode(action.payload?.data?.token);
        state.devLogin = action.payload?.data?.developer;
        state.isAuthDev = true;
        // state.isLoading = false;
        SetDevKey(key);
        setToken(action.payload.data?.token);
        sessionStorage.setItem("devToken", action.payload?.data?.token);
        sessionStorage.setItem("devDetails", JSON.stringify(action.payload?.data?.developer));
        sessionStorage.setItem("key", key ? key : undefined);
        sessionStorage.setItem("user", JSON.stringify("dev"))
        sessionStorage.setItem("isAuthDev", true);
        window.location.href = "/dev/dashboard"

        Success("Developer Login successfully");
        // state.isLoading = false;
      } else {
        DangerRight(action?.payload?.message?.name);
        // state.isLoading = false;
      }
      state.isLoading = false;
    });
    builder.addCase(devLogin.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getDev.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getDev.fulfilled, (state, action) => {
      state.isLoading = false;
      state.devLogin = action.payload?.data
    });

    builder.addCase(getDev.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateDeveloperDev.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(updateDeveloperDev.fulfilled, (state, action) => {
      state.isLoading = false;
      state.devLogin = action.payload?.data
      if (action.payload.status) {
        if(action.meta.arg.shoTost === true){
          Success("Developer Update Successfully")
        }
      } else {
        DangerRight(action.payload.message)
      }
    });

    builder.addCase(updateDeveloperDev.rejected, (state, action) => {
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
export default devAuthSlice.reducer;
export const { setOldAdmin, logout } = devAuthSlice.actions;
