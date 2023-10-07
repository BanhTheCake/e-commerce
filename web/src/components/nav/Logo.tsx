import { Stack, Typography, Link } from '@mui/material';
import { FC } from 'react';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import NextLink from 'next/link';

interface LogoProps {
    onClick?: () => void;
}

const Logo: FC<LogoProps> = ({ onClick }) => {
    return (
        <Link
            component={NextLink}
            href={'/'}
            underline="none"
            color={'inherit'}
            onClick={onClick}
        >
            <Stack
                direction="row"
                alignItems={'center'}
                justifyContent={'center'}
                spacing={1}
            >
                <LunchDiningIcon fontSize="large" />
                <Typography variant="h5">Banhify</Typography>
            </Stack>
        </Link>
    );
};

export default Logo;
