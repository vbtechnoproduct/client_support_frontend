/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance, apiInstanceFetch } from "../../api/axiosApi";
import jwt_decode from "jwt-decode";
import { SetDevKey, setToken } from "../../utils/setAuth";
import { key } from "../../utils/config";
import { DangerRight, Success } from "../../api/toastServices";
import axios from "axios";

const initialState = {
    messageDev: [],
    totalMessageDev: 0,
    messageDevOldChat: [],
    totalMessageDevOldChat: 0,
    isLoading: false,
};

export const getMessageDataDev = createAsyncThunk("chat/getChatListForDeveloper", async (payload) => {
    return apiInstanceFetch.get(`chat/getChatListForDeveloper?start=${payload?.start}&limit=${payload?.limit}&developerId=${payload?.developerId}`);
});

export const getMessageOldChatDev = createAsyncThunk("chat/getOldChat", async (payload) => {
    return apiInstanceFetch.get(`chat/getOldChat?chatTopic=${payload?.id}&receiver=${payload?.receiverId}&start=${payload?.start}&limit=${payload?.limit}`);
});

export const closeTicketDev = createAsyncThunk(
    "ticket/ticketClose?ticket",
    async (payload) => {
        return apiInstance.patch(`ticket/ticketClose?ticket=${payload?.id}`);
    }
);

export const imgUploadDevChat = createAsyncThunk("/chat/createChat", async (payload) => {
    return apiInstance.post(`/chat/createChat`, payload?.data);
});


export const getGrupeUserNameDev = createAsyncThunk("chat/getRoomMember", async (payload) => {
    return apiInstanceFetch.get(`chat/getRoomMember?chatTopic=${payload?.id}`);
});

const devMessageSlice = createSlice({
    name: "devMessageSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getMessageDataDev.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getMessageDataDev.fulfilled, (state, action) => {
            state.isLoading = false;
            state.messageDev = action.payload.data
            state.totalMessageDev = action.payload.total
        });


        builder.addCase(getMessageDataDev.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(getMessageOldChatDev.pending, (state, action) => {
            state.isLoading = action.meta.arg.loader;
        });
        builder.addCase(getMessageOldChatDev.fulfilled, (state, action) => {
            state.isLoading = false;
            state.messageDevOldChat = action.payload.data
            state.totalMessageDevOldChat = action.payload.total
        });


        builder.addCase(getMessageOldChatDev.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(closeTicketDev.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(closeTicketDev.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status) {
                Success("closed Ticket")
            } else {
                DangerRight(action?.payload?.message)
            }
        });

        builder.addCase(closeTicketDev.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(getGrupeUserNameDev.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getGrupeUserNameDev.fulfilled, (state, action) => {
            state.adminGrupeUserName = action.payload.data
        });


        builder.addCase(getGrupeUserNameDev.rejected, (state, action) => {
            state.isLoading = false;
        });

    },
});
export default devMessageSlice.reducer;
