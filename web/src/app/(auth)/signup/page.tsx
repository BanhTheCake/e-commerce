import { FC } from 'react';
import { Typography, Stack, Link } from '@mui/material';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import SignupForm from '@/components/auth/Signup.form';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    return (
        <Stack
            direction={'row-reverse'}
            alignItems={'center'}
            height={'100%'}
            maxWidth={'95%'}
            py={4}
        >
            <Stack
                p={2}
                px={3}
                spacing={3.5}
                sx={{
                    bgcolor: grey[50],
                    borderRadius: '6px',
                    width: '400px',
                    maxWidth: '100%',
                    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
                }}
            >
                <Typography variant="h5">Đăng ký</Typography>
                <SignupForm />
                <Typography
                    variant="body2"
                    textAlign={'center'}
                    sx={{ color: grey[600] }}
                    pb={2}
                >
                    Bạn đã có tài khoản?{' '}
                    <Link
                        component={NextLink}
                        href="/login"
                        shallow
                        underline="none"
                    >
                        Đăng nhập
                    </Link>
                </Typography>
            </Stack>
        </Stack>
    );
};

export default page;
