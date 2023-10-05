import { FC } from 'react';
import { Box, Container, Stack, Button, InputBase } from '@mui/material';
import { grey } from '@mui/material/colors';
import Logo from '@/components/nav/Logo';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Footer from '@/components/Footer';

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
                height={'65px'}
                top={'42px'}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction="row"
                        py={1}
                        pb={2}
                        spacing={4}
                        alignItems={'center'}
                    >
                        <Box>
                            <Logo />
                        </Box>
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
                                width: '100px',
                            }}
                        >
                            <Box position="relative">
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
                </Container>
            </Box>
            <Box bgcolor={grey[100]} pt={'107px'} minHeight={'100vh'}>
                <Container maxWidth={'lg'}>{children}</Container>
            </Box>
            <Footer color="white" />
        </>
    );
};

export default layout;
