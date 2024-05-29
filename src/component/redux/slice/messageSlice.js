/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance, apiInstanceFetch } from "../../api/axiosApi";
import jwt_decode from "jwt-decode";
import { SetDevKey, setToken } from "../../utils/setAuth";
import { key } from "../../utils/config";
import { DangerRight, Success } from "../../api/toastServices";
import axios from "axios";

const initialState = {
    messageAdmin: [],
    totalMessageAdmin: 0,
    adminGrupeUserName: {},
    messageAdminOldChat: [],
    totalAdminOldChat: 0,
    isAuth: false,
    dashboardCount: {},
    isLoading: false,
};

export const imgUploadAdminChat = createAsyncThunk("chat/createChatByAdmin", async (payload) => {
    return apiInstance.post(`chat/createChatByAdmin`, payload?.data);
});

export const getMessageData = createAsyncThunk("chat/getChatList", async (payload) => {
    return apiInstanceFetch.get(`chat/getChatList?start=${payload?.start}&limit=${payload?.limit}`);
});

export const closeTicket = createAsyncThunk(
    "ticket/ticketClose?ticket",
    async (payload) => {
        return apiInstance.patch(`ticket/ticketClose?ticket=${payload?.id}`);
    }
);

export const getMessageOldChat = createAsyncThunk("chat/getOldChatAdmin", async (payload) => {
    return apiInstanceFetch.get(`chat/getOldChatAdmin?chatTopic=${payload?.id}&start=${payload?.start}&limit=${payload?.limit}`);
});

export const getGrupeUserName = createAsyncThunk("chat/getRoomMember", async (payload) => {
    return apiInstanceFetch.get(`chat/getRoomMember?chatTopic=${payload?.id}`);
});

const messageSlice = createSlice({
    name: "messageSlice",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getMessageData.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getMessageData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.messageAdmin = action.payload.data
            state.totalMessageAdmin = action.payload.total

        });

        builder.addCase(getMessageData.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(getMessageOldChat.pending, (state, action) => {
            state.isLoading = action.meta.arg.loader;
        });
        builder.addCase(getMessageOldChat.fulfilled, (state, action) => {
            state.isLoading = false;
            state.messageAdminOldChat = action.payload.data
            state.totalAdminOldChat = action.payload.total
        });

        builder.addCase(getMessageOldChat.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(closeTicket.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(closeTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status) {
                Success("closed Ticket")
            } else {
                DangerRight(action?.payload?.message)
            }
        });

        builder.addCase(closeTicket.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(getGrupeUserName.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getGrupeUserName.fulfilled, (state, action) => {
            state.adminGrupeUserName = action.payload.data
        });


        builder.addCase(getGrupeUserName.rejected, (state, action) => {
            state.isLoading = false;
        });

    },
});
export default messageSlice.reducer;
