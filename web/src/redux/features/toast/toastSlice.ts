'use client';
import { AlertColor } from '@mui/material';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ToastSlice {
    isOpen: boolean;
    type: AlertColor | undefined;
    message: string;
}

const initState: ToastSlice = {
    isOpen: false,
    type: 'success',
    message: '',
};

export const toastSlice = createSlice({
    name: 'toast',
    initialState: initState,
    reducers: {
        open: (state, action: PayloadAction<Omit<ToastSlice, 'isOpen'>>) => {
            state.isOpen = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        close: (state) => {
            state.isOpen = false;
        },
    },
});

export const { open, close } = toastSlice.actions;
export default toastSlice.reducer;
