'use client';

import LoginForm from '@/components/auth/Login.form';
import { fadeIn } from '@/utils/animate';
import { Box, Link, Paper, Portal, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FC } from 'react';

interface pageProps {}

const LoginModal: FC<pageProps> = ({}) => {
    const router = useRouter();
    const query = useSearchParams();
    const onBack = () => {
        router.back();
    };
    return (
        <Portal>
            <Stack
                alignItems={'center'}
                justifyContent={'center'}
                position={'fixed'}
                zIndex={99}
                sx={{ top: 0, left: 0, right: 0, bottom: 0 }}
                p={2}
            >
                <Box
                    bgcolor={'rgba(0, 0, 0, 0.1)'}
                    position={'absolute'}
                    sx={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        cursor: 'pointer',
                    }}
                    onClick={onBack}
                />
                <Box
                    component={Paper}
                    elevation={2}
                    borderRadius={'6px'}
                    bgcolor={'white'}
                    width={'400px'}
                    maxWidth={'100%'}
                    position={'relative'}
                    sx={{
                        animation: `${fadeIn} 0.1s ease-in-out`,
                    }}
                >
                    <Typography
                        p={2}
                        variant={'h5'}
                        textAlign={'center'}
                        borderBottom={'1px solid #eee'}
                    >
                        Đăng nhập
                    </Typography>
                    <Stack p={4} spacing={2}>
                        <LoginForm />
                        <Typography
                            variant="body2"
                            textAlign={'center'}
                            sx={{ color: grey[600] }}
                            pb={2}
                        >
                            Bạn mới biết đến banhTheEcommerce?{' '}
                            <Link
                                component={NextLink}
                                href={{
                                    pathname: '/signup',
                                }}
                                underline="none"
                            >
                                Đăng ký
                            </Link>
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Portal>
    );
};

export default LoginModal;
