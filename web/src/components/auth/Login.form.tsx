'use client';

import { FC } from 'react';
import {
    Stack,
    TextField,
    FormHelperText,
    Button,
    Link,
    Typography,
    Box,
} from '@mui/material';
import TextFieldPassword from '../Password';
import NextLink from 'next/link';
import { grey, indigo } from '@mui/material/colors';
import GoogleIcon from '@mui/icons-material/Google';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TLoginValidate, loginSchema } from '@/validate/login.validate';

interface formProps {}

const LoginForm: FC<formProps> = ({}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TLoginValidate>({
        resolver: zodResolver(loginSchema),
        reValidateMode: 'onSubmit',
    });

    const onSubmit: SubmitHandler<TLoginValidate> = (data) => {
        console.log(data);
    };

    return (
        <Stack
            component={'form'}
            spacing={3.5}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Stack spacing={3.5}>
                <Stack position={'relative'}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="medium"
                        placeholder="Email/Tên đăng nhập"
                        {...register('usernameOrEmail')}
                    />
                    <FormHelperText
                        sx={{
                            color: 'primary.main',
                            top: '100%',
                            position: 'absolute',
                        }}
                    >
                        {errors?.usernameOrEmail &&
                            errors?.usernameOrEmail.message}
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
            </Stack>
            <Stack spacing={1}>
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
                >
                    Đăng nhập
                </Button>
                <Link href="/forgot" component={NextLink} underline="none">
                    <Typography variant="body2" sx={{ color: indigo[600] }}>
                        Quên mật khẩu?
                    </Typography>
                </Link>
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
                        sx={{ mt: 1 }}
                    >
                        Đăng nhập với Google
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default LoginForm;
