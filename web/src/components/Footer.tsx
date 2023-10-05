import { FC } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Logo from './nav/Logo';

interface FooterProps {
    color?: string;
}

const Footer: FC<FooterProps> = ({ color = grey[100] }) => {
    return (
        <Box sx={{ bgcolor: color }}>
            <Container maxWidth={'lg'}>
                <Stack
                    direction="row"
                    width={'100%'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    py={2}
                    spacing={2}
                    sx={{ color: 'primary.main' }}
                >
                    <Logo />
                    <Typography>Make by banhTheCake with love</Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
