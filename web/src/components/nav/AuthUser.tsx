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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserState, resetUser } from '@/redux/features/user/userSlice';
import MenuMobile from './MenuMobile';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logoutMutation } from '@/ky/auth.ky';
import { useQueryClient } from '@tanstack/react-query';

interface AuthUserProps {}

const AuthUser: FC<AuthUserProps> = ({}) => {
    const user = useSelector<RootState, UserState>((state) => state.user);
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: logoutMutation,
    });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        mutate(undefined, {
            onSettled() {
                dispatch(resetUser());
                // Remove all queries (can be skip)
                queryClient.removeQueries({
                    queryKey: ['me'],
                    exact: true,
                });
                router.push('/login');
            },
        });
    };

    return (
        <>
            {user.id ? (
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
                            alt={user.username}
                            src={user.avatar ?? 'https://picsum.photos/200'}
                            sx={{ width: 24, height: 24 }}
                        >
                            {user.username?.charAt(0)}
                        </Avatar>
                        <Typography
                            variant="body2"
                            textTransform={'capitalize'}
                        >
                            {user.username}
                        </Typography>
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
                        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                    </Menu>
                </>
            ) : (
                <>
                    <Stack
                        direction={'row'}
                        spacing={2}
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'flex',
                            },
                        }}
                    >
                        <Link
                            component={NextLink}
                            href={'/login?redirect=' + pathname}
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
                    <MenuMobile />
                </>
            )}
        </>
    );
};

export default AuthUser;
