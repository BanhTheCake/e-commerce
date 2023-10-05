'use client';

import { FC, useState } from 'react';
import {
    Link,
    Stack,
    Avatar,
    Typography,
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import NextLink from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/features/user/userSlice';

interface AuthUserProps {}

const AuthUser: FC<AuthUserProps> = ({}) => {
    const user = useSelector<RootState, UserState>((state) => state.user);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            {user ? (
                <>
                    <Stack
                        component={Box}
                        direction={'row'}
                        spacing={1}
                        alignItems={'center'}
                        onClick={handleClick}
                        id="basic-button"
                        sx={{ cursor: 'pointer' }}
                    >
                        <Avatar
                            alt="BanhTheCake"
                            src="https://picsum.photos/200"
                            sx={{ width: 24, height: 24 }}
                        >
                            B
                        </Avatar>
                        <Typography variant="body2">BanhTheCake</Typography>
                    </Stack>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        onClose={handleClose}
                        sx={{
                            marginTop: 1,
                            '& .MuiMenu-paper': {
                                boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
                                width: '160px',
                            },
                        }}
                    >
                        <MenuItem>Tài khoản của tôi</MenuItem>
                        <MenuItem>Đơn mua</MenuItem>
                        <MenuItem>Đăng xuất</MenuItem>
                    </Menu>
                </>
            ) : (
                <Stack direction={'row'} spacing={2}>
                    <Link
                        component={NextLink}
                        href={'/login'}
                        underline="none"
                        color={'inherit'}
                    >
                        Đăng nhập
                    </Link>
                    <Link
                        component={NextLink}
                        href={'/signup'}
                        underline="none"
                        color={'inherit'}
                    >
                        Đăng ký
                    </Link>
                </Stack>
            )}
        </>
    );
};

export default AuthUser;
