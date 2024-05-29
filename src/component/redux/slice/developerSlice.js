/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance, apiInstanceFetch } from "../../api/axiosApi";
import jwt_decode from "jwt-decode";
import { SetDevKey, setToken } from "../../utils/setAuth";
import { key } from "../../utils/config";
import { DangerRight, Success } from "../../api/toastServices";
import axios from "axios";

const initialState = {
    developerAdminData: [],
    totalDeveloperAdmin: 0,
    messageAdminOldChat: [],
    isAuth: false,
    dashboardCount: {},
    isLoading: false,
};


export const updateDeveloper = createAsyncThunk(
    "developer/updatedevloper",
    async (payload) => {
        return apiInstance.patch(`developer/update?developerId=${payload?.id}`, payload?.data);
    }
);


export const getAllDeveloper = createAsyncThunk("developer/getAll", async (payload) => {
    return apiInstanceFetch.get(`developer/getAll?start=${payload?.start}&limit=${payload?.limit}`);
});

export const createDeveloper = createAsyncThunk("developer/create", async (payload) => {
    return apiInstance.post("developer/create", payload?.data);
});

export const deleteDeveloper = createAsyncThunk("developer/delete", async (id) => {
    return apiInstance.delete(`developer/delete?developerId=${id}`)
})

const developerSlice = createSlice({
    name: "developerSlice",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllDeveloper.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getAllDeveloper.fulfilled, (state, action) => {
            state.isLoading = false;
            state.developerAdminData = action.payload.data;
            state.totalDeveloperAdmin = action.payload.total;
        });


        builder.addCase(getAllDeveloper.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createDeveloper.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(createDeveloper.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status) {
                state.developerAdminData.unshift(action.payload?.data);
                Success("Developer Add Successfully")
            } else {
                DangerRight(action.payload?.message)
            }
        });


        builder.addCase(createDeveloper.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteDeveloper.pending, (state, action) => {
            state.isLoading = true;
        })

        builder.addCase(deleteDeveloper.fulfilled, (state, action) => {
            if (action.payload.status) {
                state.developerAdminData = state.developerAdminData.filter((developer) => developer?._id !== action.meta.arg);
                Success("Developer Delete Successfully")
            }
            state.isLoading = false;

        })
        builder.addCase(deleteDeveloper.rejected, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(updateDeveloper.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(updateDeveloper.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.status) {
                Success("Developer Update Successfully")
            }
            if (action.payload.status) {
                const developerId = state.developerAdminData.findIndex((developer) => developer?._id === action?.meta?.arg?.id);
                if (developerId !== -1) {
                    state.developerAdminData[developerId] = { ...state.developerAdminData[developerId], ...action.payload?.data };
                }

            } else {
                DangerRight(action?.payload?.message)
            }
        });

        builder.addCase(updateDeveloper.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});
export default developerSlice.reducer;
