import { FC } from 'react';
import { Container, Box, Stack, Link } from '@mui/material';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import ToggleModeBtn from '@/components/nav/ToggleModeBtn';
import AuthUser from '@/components/nav/AuthUser';
import { headers } from 'next/headers';
import Footer from '@/components/Footer';
import SecondNav from '@/components/nav/SecondNav';

interface layoutProps {
    children: React.ReactNode;
    modal: React.ReactNode;
}

const Layout: FC<layoutProps> = ({ children, modal }) => {
    const headerList = headers();
    const pathname = headerList.get('x-pathname');
    const isShowSecondNav = pathname !== '/helps';
    return (
        <>
            <Box
                width={'100%'}
                bgcolor={'primary.main'}
                color={grey[50]}
                fontSize={'14px'}
                position={'fixed'}
                zIndex={30}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        spacing={2}
                        py={0.5}
                        height={'42px'}
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
                                display={{ xs: 'none', sm: 'block' }}
                                width={'1px'}
                                height={'18px'}
                                bgcolor={grey[300]}
                                sx={{ opacity: 0.8 }}
                            />
                            <Link
                                display={{ xs: 'none', sm: 'block' }}
                                component={NextLink}
                                href="/"
                                color={'inherit'}
                                underline="none"
                            >
                                Facebook
                            </Link>
                            <Box
                                display={{ xs: 'none', sm: 'block' }}
                                width={'1px'}
                                height={'18px'}
                                bgcolor={grey[300]}
                                sx={{ opacity: 0.8 }}
                            />
                            <Link
                                display={{ xs: 'none', sm: 'block' }}
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
                    {isShowSecondNav && (
                        <Box height={'65px'}>
                            <SecondNav />
                        </Box>
                    )}
                </Container>
            </Box>
            <Box
                bgcolor={grey[100]}
                pt={isShowSecondNav ? '107px' : '42px'}
                minHeight={'100vh'}
            >
                <Container maxWidth={'lg'}>{children}</Container>
            </Box>
            {/* {modal} */}
            <Footer color="white" />
        </>
    );
};

export default Layout;
