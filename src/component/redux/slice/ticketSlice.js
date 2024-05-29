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
    ticketTotalAdmin: 0,
    ticketAdminData: [],
    ticketDevAdmin: 0,
    ticketDevData: [],
    isLoading: false,
};


export const updateDeveloper = createAsyncThunk(
    "developer/update",
    async (payload) => {
        return apiInstance.patch(`developer/update?developerId=${payload?.id}`, payload?.data);
    }
);


export const getAllDeveloper = createAsyncThunk("developer/getAll", async (payload) => {
    return apiInstanceFetch.get(`developer/getAll`);
});

export const getTicket = createAsyncThunk("ticket/getTickets", async (payload) => {
    return apiInstanceFetch.get(`ticket/getTickets?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&status=${payload?.status}`);
});

export const getDevTicket = createAsyncThunk("ticket/getTicketsOfDeveloper", async (payload) => {
    return apiInstanceFetch.get(`ticket/getTicketsOfDeveloper?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&status=${payload?.status}&developer=${payload?.developer}`);
});
export const createTicket = createAsyncThunk("ticket/createTicket", async (payload) => {
    return apiInstance.post("ticket/createTicket", payload?.data);
});

export const reopenTicket = createAsyncThunk(
    "ticket/reOpenTicket?ticket",
    async (payload) => {
        return apiInstance.patch(`ticket/reOpenTicket?ticket=${payload?.id}&client=${payload?.clientId}`, payload?.data);
    }
);
export const updateTicketDeveloper = createAsyncThunk(
    "/ticket/assignedToDeveloper",
    async (payload) => {
        return apiInstance.patch(`ticket/assignedToDeveloper?ticket=${payload?.data?.ticket}&developer=${payload?.data?.developer}`);
    }
);

export const deleteDeveloper = createAsyncThunk("developer/delete", async (id) => {
    return apiInstance.delete(`developer/delete?developerId=${id}`)
})

const ticketSlice = createSlice({
    name: "ticketSlice",
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
        });


        builder.addCase(getAllDeveloper.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(getTicket.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ticketAdminData = action.payload.data;
            state.ticketTotalAdmin = action.payload.total;
        });


        builder.addCase(getTicket.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(getDevTicket.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getDevTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ticketDevData = action.payload.data;
            state.ticketDevAdmin = action.payload.total;
        });


        builder.addCase(getDevTicket.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createTicket.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(createTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status) {
                state.ticketAdminData.unshift(action.payload?.data);
                Success("Ticket Add Successfully")
            } else {
                DangerRight(action.payload?.message)
            }
        });


        builder.addCase(createTicket.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteDeveloper.pending, (state, action) => {
            state.isLoading = true;
        })

        builder.addCase(deleteDeveloper.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.status) {
                state.developerAdminData = state.developerAdminData.filter((developer) => developer?._id !== action.meta.arg);
                Success("Developer Delete Successfully")
            }
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
                const developerId = state.developerAdminData.findIndex((developer) => developer?._id === action?.meta?.arg?.id);
                if (developerId !== -1) {
                    state.developerAdminData[developerId] = { ...state.developerAdminData[developerId], ...action.payload?.data };
                }
                Success("Developer Update Successfully")
            } else {
                DangerRight(action?.payload?.message)
            }
        });

        builder.addCase(updateDeveloper.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(updateTicketDeveloper.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(updateTicketDeveloper.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.status) {
                const ticketId = state.ticketAdminData.findIndex((ticket) => ticket?._id === action?.meta?.arg?.data?.ticket);
                if (ticketId !== -1) {
                    state.ticketAdminData[ticketId] = { ...state.ticketAdminData[ticketId], ...action.payload?.data };
                }
                Success("change Developer Ticket Successfully")
            } else {
                DangerRight(action?.payload?.message)
            }
        });

        builder.addCase(updateTicketDeveloper.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(reopenTicket.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(reopenTicket.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.status) {
                const ticketId = state.ticketAdminData.findIndex((ticket) => ticket?._id === action?.meta?.arg?.id);
                if (ticketId !== -1) {
                    state.ticketAdminData[ticketId] = { ...state.ticketAdminData[ticketId], ...action.payload?.data };
                }
                Success("Reopen Ticket Successfully")
            } else {
                DangerRight(action?.payload?.message)
            }
        });

        builder.addCase(reopenTicket.rejected, (state, action) => {
            state.isLoading = false;
        });

    },
});
export default ticketSlice.reducer;
