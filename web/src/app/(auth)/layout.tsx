import { FC } from 'react';
import { Box, Container, Stack, Typography, Link } from '@mui/material';
import NextLink from 'next/link';
import { red } from '@mui/material/colors';
import Footer from '@/components/Footer';
import Logo from '@/components/nav/Logo';

interface layoutProps {
    children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
    return (
        <Box>
            <Container maxWidth={'lg'}>
                <Stack
                    direction="row"
                    spacing={1.5}
                    py={3}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <Box fontSize={'20px'} color={'primary.main'}>
                        <Logo />
                    </Box>
                    <Link
                        component={NextLink}
                        href={'/helps'}
                        underline="none"
                        color={'tomato'}
                    >
                        Bạn cần giúp đỡ?
                    </Link>
                </Stack>
            </Container>
            <Box sx={{ bgcolor: 'rgb(208, 1, 27)' }}>
                <Container
                    maxWidth={'lg'}
                    sx={{
                        backgroundImage:
                            'url(https://down-vn.img.susercontent.com/file/sg-11134004-7rbl1-llop4bp9djo0e4)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                    }}
                >
                    <Stack
                        sx={{ minHeight: '600px' }}
                        justifyContent={'center'}
                    >
                        {children}
                    </Stack>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default layout;
