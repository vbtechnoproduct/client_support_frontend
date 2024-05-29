/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance, apiInstanceFetch } from "../../api/axiosApi";
import jwt_decode from "jwt-decode";
import { SetDevKey, setToken } from "../../utils/setAuth";
import { key } from "../../utils/config";
import { DangerRight, Success } from "../../api/toastServices";
import axios from "axios";

const initialState = {
    messageClient: [],
    messageDevOldChatData: [],
    totalClientOldChat: 0,
    isLoading: false,
};

export const getMessageDataClient = createAsyncThunk("chat/getChatList", async (payload) => {
    return apiInstanceFetch.get(`chat/getChatList?start=${payload?.start}&limit=${payload?.limit}`);
});

export const getMessageOldChatClient = createAsyncThunk("chat/getOldChat", async (payload) => {
    return apiInstanceFetch.get(`chat/getOldChat?chatTopic=${payload?.id}&receiver=${payload?.receiver}&start=${payload?.start}&limit=${payload?.limit}`);
});

export const closeTicketDeveloper = createAsyncThunk(
    "ticket/ticketSolved",
    async (payload) => {
        return apiInstance.patch(`ticket/ticketSolved?ticket=${payload?.id}&developer=${payload?.developerId}`);
    }
);

export const sendChatImage = createAsyncThunk("/chat/createChat", async (payload) => {
    return apiInstance.post(`/chat/createChat`, payload.data);
});

export const updateClient = createAsyncThunk(
    "client/updatefcmToken",
    async (payload) => {
        return apiInstance.patch(`/client/updatefcmToken`, payload?.data);
    }
);


export const updateDeveloperClient = createAsyncThunk(
    "developer/updatedeveloper",
    async (payload) => {
        return apiInstance.patch(`developer/update?developerId=${payload?.id}`, payload?.data);
    }
);




const messageClientSlice = createSlice({
    name: "messageClientSlice",
    initialState,
    reducers: {
        setMessageLoader(state, action) {
            if (action.payload?.loader) {
                state.isLoading = true
            } else {
                state.isLoading = false
            }
        },
        closeMessageLoader(state, action) {
            state.isLoading = false
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMessageDataClient.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getMessageDataClient.fulfilled, (state, action) => {
            state.isLoading = false;
            state.messageClient = action.payload.data
        });


        builder.addCase(getMessageDataClient.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(updateDeveloperClient.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(updateDeveloperClient.fulfilled, (state, action) => {
            state.isLoading = false;
        });


        builder.addCase(updateDeveloperClient.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(getMessageOldChatClient.pending, (state, action) => {
            state.isLoading = action.meta.arg.loader
        });
        builder.addCase(getMessageOldChatClient.fulfilled, (state, action) => {
            state.isLoading = false;
            state.messageClientOldChat = action.payload.data
            state.totalClientOldChat = action.payload.total
        });


        builder.addCase(getMessageOldChatClient.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});
export default messageClientSlice.reducer;
export const { setMessageLoader } = messageClientSlice.actions;

