import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import LunchDiningIcon from '@mui/icons-material/LunchDining';

interface LogoProps {}

const Logo: FC<LogoProps> = ({}) => {
    return (
        <Stack
            direction="row"
            alignItems={'center'}
            justifyContent={'center'}
            spacing={1}
        >
            <LunchDiningIcon fontSize="large" />
            <Typography variant="h5">Banhify</Typography>
        </Stack>
    );
};

export default Logo;
