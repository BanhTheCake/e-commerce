'use client';

import { FC } from 'react';
import {
    Stack,
    TextField,
    FormHelperText,
    Button,
    Typography,
    Box,
} from '@mui/material';
import TextFieldPassword from '../Password';
import { grey } from '@mui/material/colors';
import GoogleIcon from '@mui/icons-material/Google';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SignupSchema, TSignupValidate } from '@/validate/signup.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signupMutation } from '@/ky/auth.ky';
import { useToast } from '../Toaster';

interface SignupFormProps {}
const defaultValues: TSignupValidate = {
    confirmPassword: '',
    email: '',
    password: '',
    username: '',
};

const SignupForm: FC<SignupFormProps> = ({}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TSignupValidate>({
        resolver: zodResolver(SignupSchema),
        defaultValues: defaultValues,
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: signupMutation,
    });

    const toast = useToast();

    const onSubmit: SubmitHandler<TSignupValidate> = (data) => {
        mutate(data, {
            onSuccess(data) {
                toast({
                    message: data.message,
                    type: 'success',
                });
                reset(defaultValues);
            },
            onError(error) {
                toast({
                    message: error as string,
                    type: 'error',
                });
            },
        });
    };

    return (
        <Stack component={'form'} spacing={4} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3.5}>
                <Stack position={'relative'}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="medium"
                        placeholder="Tên đăng nhập"
                        {...register('username')}
                    />
                    <FormHelperText
                        sx={{
                            color: 'primary.main',
                            top: '100%',
                            position: 'absolute',
                        }}
                    >
                        {errors?.username && errors?.username.message}
                    </FormHelperText>
                </Stack>
                <Stack position={'relative'}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="medium"
                        placeholder="Email/Tên đăng nhập"
                        {...register('email')}
                    />
                    <FormHelperText
                        sx={{
                            color: 'primary.main',
                            top: '100%',
                            position: 'absolute',
                        }}
                    >
                        {errors?.email && errors?.email.message}
                    </FormHelperText>
                </Stack>
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
                        margin="dense"
                        sx={{
                            color: 'primary.main',
                            top: '100%',
                            position: 'absolute',
                        }}
                    >
                        {errors?.confirmPassword &&
                            errors?.confirmPassword.message}
                    </FormHelperText>
                </Stack>
            </Stack>
            <Stack spacing={2} mt={2}>
                <Button
                    sx={{
                        bgcolor: 'primary.main',
                        color: grey[50],
                        transition: 'all 0.3s',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            opacity: 0.9,
                        },
                    }}
                    fullWidth
                    size="medium"
                    type="submit"
                    disabled={isLoading}
                >
                    Đăng ký
                </Button>
                <Stack
                    alignItems={'center'}
                    justifyContent={'center'}
                    position={'relative'}
                >
                    <Box
                        height={'0.5px'}
                        position={'absolute'}
                        width={'100%'}
                        sx={{
                            bgcolor: grey[500],
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />
                    <Typography
                        px={2}
                        sx={{ bgcolor: grey[50], color: grey[500] }}
                        position={'relative'}
                        variant="body2"
                    >
                        HOẶC
                    </Typography>
                </Stack>
                <Stack>
                    <Button
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        fullWidth
                        size="medium"
                    >
                        Đăng ký với Google
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default SignupForm;
