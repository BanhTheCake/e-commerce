import ActiveAccount from '@/components/auth/ActiveAccount';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { redirect } from 'next/navigation';
import { FC } from 'react';

interface IActivePage {
    searchParams: {
        token?: string;
    };
}

const ActivePage: FC<IActivePage> = ({ searchParams }) => {
    const token = searchParams?.token;
    if (!token) {
        return redirect('/signup');
    }
    return (
        <Stack alignItems={'center'} justifyContent={'center'}>
            <Box
                component={Paper}
                elevation={3}
                p={4}
                bgcolor={'white'}
                borderRadius={'6px'}
                width="fit-content"
            >
                <ActiveAccount token={token} />
            </Box>
        </Stack>
    );
};

export default ActivePage;
