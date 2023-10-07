'use client';

import { FC, useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
    IconButton,
    Drawer,
    Box,
    Stack,
    Button,
    Link,
    useMediaQuery,
} from '@mui/material';
import Logo from './Logo';
import NextLink from 'next/link';
import { blue, grey } from '@mui/material/colors';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

interface MenuMobileProps {}

const MenuMobile: FC<MenuMobileProps> = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isMobile) return;
        setIsOpen(false);
    }, [isMobile]);

    return (
        <>
            <IconButton
                aria-label="menu"
                sx={{
                    display: {
                        sx: 'block',
                        sm: 'none',
                    },
                    color: 'inherit',
                }}
                size="small"
                onClick={toggleMenu}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="top"
                variant="temporary"
                open={isOpen}
                onClose={toggleMenu}
            >
                <Stack spacing={2} p={2} pb={4}>
                    <Stack
                        sx={{ color: 'primary.main' }}
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Logo onClick={toggleMenu} />
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems={'center'}
                        >
                            <Link
                                component={NextLink}
                                href="#"
                                underline="none"
                            >
                                <IconButton
                                    aria-label="facebook"
                                    size="medium"
                                    sx={{
                                        color: blue[500],
                                    }}
                                >
                                    <FacebookIcon fontSize="large" />
                                </IconButton>
                            </Link>
                            <Box
                                width={'2px'}
                                height={'24px'}
                                bgcolor={grey[300]}
                                sx={{ opacity: 0.8, flexShrink: 0 }}
                            />
                            <Link
                                component={NextLink}
                                href="#"
                                underline="none"
                            >
                                <IconButton
                                    aria-label="facebook"
                                    size="medium"
                                    sx={{
                                        color: 'primary.main',
                                    }}
                                >
                                    <InstagramIcon fontSize="large" />
                                </IconButton>
                            </Link>
                        </Stack>
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <Link
                            component={NextLink}
                            href="/login"
                            underline="none"
                            width={'100%'}
                        >
                            <Button variant="contained" sx={{ width: '100%' }}>
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link
                            component={NextLink}
                            href="/signup"
                            underline="none"
                            width={'100%'}
                        >
                            <Button variant="contained" sx={{ width: '100%' }}>
                                Đăng ký
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Drawer>
        </>
    );
};

export default MenuMobile;
