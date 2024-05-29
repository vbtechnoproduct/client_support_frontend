/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance, apiInstanceFetch } from "../../api/axiosApi";
import jwt_decode from "jwt-decode";
import { SetDevKey, setToken } from "../../utils/setAuth";
import { key } from "../../utils/config";
import { DangerRight, Success } from "../../api/toastServices";
import axios from "axios";

const initialState = {
    clientAdminData: [],
    totalClientAdmin:0,
    isLoading: false,
};


export const getAllClient = createAsyncThunk("client/getClients", async (payload) => {
    return apiInstanceFetch.get(`client/getClients?start=${payload?.start}&limit=${payload?.limit}`);
});

const clientSlice = createSlice({
    name: "clientSlice",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllClient.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getAllClient.fulfilled, (state, action) => {
            state.isLoading = false;
            state.clientAdminData = action.payload.data
            state.totalClientAdmin = action.payload.total
        });


        builder.addCase(getAllClient.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});
export default clientSlice.reducer;
