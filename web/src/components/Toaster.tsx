'use client';

import { ToastSlice, close, open } from '@/redux/features/toast/toastSlice';
import { RootState } from '@/redux/store';
import { Alert, Box, Snackbar } from '@mui/material';
import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useToast = () => {
    const dispatch = useDispatch();
    const toast = (data: Omit<ToastSlice, 'isOpen'>) => {
        dispatch(open(data));
    };
    return toast;
};

const Toaster = () => {
    const id = useId();
    const { isOpen, message, type } = useSelector<
        RootState,
        RootState['toast']
    >((state) => state.toast);

    const dispatch = useDispatch();
    const onClose = () => {
        dispatch(close());
    };
    return (
        <Box minWidth={500}>
            <Snackbar
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
                open={isOpen}
                onClose={onClose}
                autoHideDuration={6000}
                key={id}
            >
                <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Toaster;
