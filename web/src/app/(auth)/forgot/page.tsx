'use client';

import { FC } from 'react';
import {
    Stack,
    Box,
    Typography,
    TextField,
    FormHelperText,
    Button,
    Paper,
    IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TForgotValidate, forgotSchema } from '@/validate/forgot.validate';

interface ForgotPageProps {}

const ForgotPage: FC<ForgotPageProps> = ({}) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TForgotValidate>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit: SubmitHandler<TForgotValidate> = (data) => {
        console.log(data);
    };

    const onBack = () => {
        router.back();
    };

    return (
        <Stack px={1} alignItems={'center'} justifyContent={'center'}>
            <Box
                component={Paper}
                bgcolor={'white'}
                borderRadius={'4px'}
                width={'500px'}
                maxWidth={'100%'}
                p={2}
                elevation={3}
                position={'relative'}
            >
                <IconButton
                    size="medium"
                    sx={{
                        color: 'primary.main',
                        position: 'absolute',
                        top: 10,
                        left: 10,
                    }}
                    onClick={onBack}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h5" textAlign={'center'}>
                    Đặt lại mật khẩu
                </Typography>
                <Stack
                    component={'form'}
                    spacing={4}
                    p={3}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Stack position={'relative'}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            size="medium"
                            placeholder="Email"
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
                    <Button
                        sx={{ textTransform: 'uppercase' }}
                        variant="contained"
                        type="submit"
                    >
                        Tiếp theo
                    </Button>
                </Stack>
            </Box>
        </Stack>
    );
};

export default ForgotPage;
