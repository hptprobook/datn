import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import TimetablesService from "../services/timetables.service";

export const fetchAllTimetables = createAsyncThunk(
    "timetables/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await TimetablesService.all();
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
);
export const createTimetable = createAsyncThunk(
    "timetables/createTimetable",
    async (data, { rejectWithValue }) => {
        try {
            const response = await TimetablesService.create(data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
);
export const deleteTimetable = createAsyncThunk(
    "timetables/deleteTimetable",
    async (id, { rejectWithValue }) => {
        try {
            const response = await TimetablesService.delete(id);
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
);
export const updateTimetable = createAsyncThunk(
    "timetables/updateTimetable",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await TimetablesService.update(id, data);
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
);

const initialState = {
    timetables: [],
    timetable: null,
    status: "idle",
    statusDelete: "idle",
    statusUpdate: "idle",
    statusCreate: "idle",
    statusGet: "idle",
    error: null,
};

export const setStatus = createAction('timetables/setStatus');

const timetableSlices = createSlice({
    name: "timetables",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTimetables.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllTimetables.fulfilled, (state, action) => {
                state.status = "successful";
                state.timetables = action.payload;
            })
            .addCase(fetchAllTimetables.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createTimetable.pending, (state) => {
                state.statusCreate = "loading";
            })
            .addCase(createTimetable.fulfilled, (state, action) => {
                state.statusCreate = "successful";
            })
            .addCase(createTimetable.rejected, (state, action) => {
                state.statusCreate = "failed";
                state.error = action.payload;
            })
            .addCase(deleteTimetable.pending, (state) => {
                state.statusDelete = "loading";
            })
            .addCase(deleteTimetable.fulfilled, (state, action) => {
                state.statusDelete = "successful";
            })
            .addCase(deleteTimetable.rejected, (state, action) => {
                state.statusDelete = "failed";
                state.error = action.payload;
            })
            .addCase(updateTimetable.pending, (state) => {
                state.statusUpdate = "loading";
            })
            .addCase(updateTimetable.fulfilled, (state, action) => {
                state.statusUpdate = "successful";
            })
            .addCase(updateTimetable.rejected, (state, action) => {
                state.statusUpdate = "failed";
                state.error = action.payload;
            })
            .addCase(setStatus, (state, action) => {
                const { key, value } = action.payload; // Destructure key and value from payload
                if (state[key] !== undefined) {
                    state[key] = value; // Update the status field dynamically
                }
            })
    },
});

export default timetableSlices.reducer;
