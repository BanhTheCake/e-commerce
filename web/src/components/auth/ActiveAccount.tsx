'use client';

import { activeMutation } from '@/ky/auth.ky';
import { Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useToast } from '../Toaster';

interface ActiveAccountProps {
    token: string;
}

const ActiveAccount: FC<ActiveAccountProps> = ({ token }) => {
    const router = useRouter();
    const toast = useToast();

    const { mutate, isError, isSuccess } = useMutation({
        mutationFn: activeMutation,
    });
    if (!token) {
        throw new Error('Invalid token');
    }

    useEffect(() => {
        mutate(token, {
            onSuccess(data) {
                toast({
                    message: data.message,
                    type: 'success',
                });
                router.push('/login');
            },
        });
    }, [token]);

    if (isError) {
        return (
            <Typography variant="h5">
                Link has been expired or invalid!
            </Typography>
        );
    }

    if (isSuccess) {
        return <Typography variant="h5">Active success!</Typography>;
    }

    return (
        <Typography variant="h5">
            Please wait while we activate your account ...
        </Typography>
    );
};

export default ActiveAccount;
