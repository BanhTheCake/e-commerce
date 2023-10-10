import { redirect } from 'next/navigation';
import { FC } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import ResetPassword from '@/components/auth/ResetPassword';

interface pageProps {
    searchParams: {
        token?: string;
        id?: string;
    };
}

const ResetPasswordPage: FC<pageProps> = ({ searchParams }) => {
    const token = searchParams?.token;
    const id = searchParams?.id;
    if (!token || !id) {
        return redirect('/');
    }
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
                <Typography variant="h5" textAlign={'center'}>
                    Đặt lại mật khẩu
                </Typography>
                <ResetPassword token={token} id={id} />
            </Box>
        </Stack>
    );
};

export default ResetPasswordPage;
