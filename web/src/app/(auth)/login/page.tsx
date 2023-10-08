import { Typography, Stack, Link } from '@mui/material';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import LoginForm from '@/components/auth/Login.form';

const loginPage = () => {
    return (
        <Stack
            direction={'row-reverse'}
            alignItems={'center'}
            height={'100%'}
            maxWidth={'95%'}
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
                <Typography variant="h5">Đăng nhập</Typography>
                <LoginForm />
                <Typography
                    variant="body2"
                    textAlign={'center'}
                    sx={{ color: grey[600] }}
                    pb={2}
                >
                    Bạn mới biết đến banhTheEcommerce?{' '}
                    <Link component={NextLink} href="/signup" underline="none">
                        Đăng ký
                    </Link>
                </Typography>
            </Stack>
        </Stack>
    );
};

export default loginPage;
