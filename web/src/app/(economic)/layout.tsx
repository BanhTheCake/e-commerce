import { FC } from 'react';
import { Container, Box, Stack, Link, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import ToggleModeBtn from '@/components/nav/ToggleModeBtn';
import AuthUser from '@/components/nav/AuthUser';

interface layoutProps {
    children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
    return (
        <>
            <Box
                width={'100%'}
                bgcolor={'primary.main'}
                color={grey[50]}
                fontSize={'14px'}
                position={'fixed'}
                height={'42px'}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        spacing={2}
                        py={0.5}
                    >
                        <Stack
                            direction={'row'}
                            alignItems="center"
                            spacing={1}
                        >
                            <Link
                                component={NextLink}
                                href="/"
                                color={'inherit'}
                                underline="none"
                            >
                                Kênh người bán
                            </Link>
                            <Box
                                width={'1px'}
                                height={'18px'}
                                bgcolor={grey[300]}
                                sx={{ opacity: 0.8 }}
                            />
                            <Link
                                component={NextLink}
                                href="/"
                                color={'inherit'}
                                underline="none"
                            >
                                Facebook
                            </Link>
                            <Box
                                width={'1px'}
                                height={'18px'}
                                bgcolor={grey[300]}
                                sx={{ opacity: 0.8 }}
                            />
                            <Link
                                component={NextLink}
                                href="/"
                                color={'inherit'}
                                underline="none"
                            >
                                Instagram
                            </Link>
                        </Stack>
                        <Stack
                            direction={'row'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            spacing={2}
                        >
                            <ToggleModeBtn />
                            <AuthUser />
                        </Stack>
                    </Stack>
                </Container>
            </Box>
            {children}
        </>
    );
};

export default layout;
