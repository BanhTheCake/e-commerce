'use client';

import { RootState } from '@/redux/store';
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';

export enum UserRoles {
    USER = 'user',
    ADMIN = 'admin',
}

export interface User {
    id: string;
    username: string;
    email: string;
    address: string;
    avatar: string;
    created_at: Date;
    updated_at: Date;
    role: UserRoles;
}

export type UserState = User | null;

const initState: UserState = null as UserState;

export const userSlice = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<UserState>) {
            state = action.payload;
        },
    },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
