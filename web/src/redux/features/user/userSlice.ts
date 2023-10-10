'use client';

import { RootState } from '@/redux/store';
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';

export enum UserRoles {
    USER = 'user',
    ADMIN = 'admin',
}

export interface UserState {
    id: string;
    username: string;
    email: string;
    address?: string;
    avatar?: string;
    created_at?: Date;
    updated_at?: Date;
    role: UserRoles;
}

const initState: UserState = {
    id: '',
    username: '',
    email: '',
    role: UserRoles.USER,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<UserState>) {
            return action.payload;
        },
        resetUser() {
            return initState;
        },
    },
});

export const { setCurrentUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
