import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './features/mode/modeSlice';
import userReducer from './features/user/userSlice';
import toastReducer from './features/toast/toastSlice';

export const store = configureStore({
    reducer: {
        mode: modeReducer,
        user: userReducer,
        toast: toastReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
