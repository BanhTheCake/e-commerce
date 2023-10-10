'use client';

import { FC } from 'react';
import { Stack, TextField, FormHelperText, Button } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
    TResetPasswordValidate,
    resetPasswordSchema,
} from '@/validate/resetPassword.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import TextFieldPassword from '../Password';
import { useMutation } from '@tanstack/react-query';
import { resetForgotPasswordMutation } from '@/ky/auth.ky';
import { useToast } from '../Toaster';
import { useRouter } from 'next/navigation';

interface ResetPasswordProps {
    token: string;
    id: string;
}

const ResetPassword: FC<ResetPasswordProps> = ({ token, id }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<TResetPasswordValidate>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const toast = useToast();
    const router = useRouter();

    const { mutate, isLoading } = useMutation({
        mutationFn: resetForgotPasswordMutation,
    });

    const onSubmit: SubmitHandler<TResetPasswordValidate> = (data) => {
        mutate(
            {
                token,
                userId: id,
                password: data.password,
            },
            {
                onSuccess(data) {
                    toast({
                        message: data.message,
                        type: 'success',
                    });
                    router.push('/login');
                },
                onError() {
                    toast({
                        message: 'Link has been expired or invalid!',
                        type: 'error',
                    });
                },
            }
        );
    };

    return (
        <Stack
            component={'form'}
            spacing={4}
            p={3}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Stack position={'relative'}>
                <TextFieldPassword
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder="Mật khẩu"
                    {...register('password')}
                />
                <FormHelperText
                    sx={{
                        color: 'primary.main',
                        top: '100%',
                        position: 'absolute',
                    }}
                >
                    {errors?.password && errors?.password.message}
                </FormHelperText>
            </Stack>
            <Stack position={'relative'}>
                <TextFieldPassword
                    variant="outlined"
                    fullWidth
                    size="medium"
                    placeholder="Nhập lại mật khẩu"
                    {...register('confirmPassword')}
                />
                <FormHelperText
                    sx={{
                        color: 'primary.main',
                        top: '100%',
                        position: 'absolute',
                    }}
                >
                    {errors?.confirmPassword && errors?.confirmPassword.message}
                </FormHelperText>
            </Stack>
            <Button
                sx={{ textTransform: 'uppercase' }}
                variant="contained"
                type="submit"
                disabled={isLoading}
            >
                Tiếp theo
            </Button>
        </Stack>
    );
};

export default ResetPassword;
