'use client';
import { createSlice } from '@reduxjs/toolkit';

export interface ModeState {
    mode: 'dark' | 'light';
}

const initState: ModeState = {
    mode: 'light',
};

export const modeSlice = createSlice({
    name: 'mode',
    initialState: initState,
    reducers: {
        toggle: (state) => {
            state.mode === 'dark'
                ? (state.mode = 'light')
                : (state.mode = 'dark');
        },
    },
});

export const { toggle } = modeSlice.actions;
export default modeSlice.reducer;
