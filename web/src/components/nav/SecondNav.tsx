'use client';

import { FC } from 'react';
import { Box, Stack, Button, InputBase, useMediaQuery } from '@mui/material';
import { grey } from '@mui/material/colors';
import Logo from '@/components/nav/Logo';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

interface SecondNavProps {}

const SecondNav: FC<SecondNavProps> = ({}) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <Stack direction="row" py={1} pb={2} spacing={4} alignItems={'center'}>
            {!isMobile ? (
                <Box>
                    <Logo />
                </Box>
            ) : null}
            <InputBase
                fullWidth
                size="small"
                placeholder="Search ..."
                endAdornment={
                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                opacity: 0.9,
                            },
                        }}
                    >
                        <SearchIcon />
                    </Button>
                }
                sx={{
                    bgcolor: grey[50],
                    p: 0.5,
                    pl: 2,
                    borderRadius: '4px',
                    '& input': {
                        p: 0,
                    },
                }}
            />
            <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                sx={{
                    width: {
                        xs: 'auto',
                        sm: '100px',
                    },
                }}
            >
                <Box position="relative" display={'flex'}>
                    <ShoppingCartOutlinedIcon fontSize="large" />
                    <Box
                        position="absolute"
                        top={-2}
                        right={-2}
                        bgcolor={grey[50]}
                        color={'primary.main'}
                        borderRadius={'1000px'}
                        width={'22px'}
                        fontSize={'10px'}
                        sx={{
                            fontWeight: 'bold',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            display: 'flex',
                            justifyContent: 'center',
                            userSelect: 'none',
                        }}
                    >
                        1
                    </Box>
                </Box>
            </Stack>
        </Stack>
    );
};

export default SecondNav;
