import { FC } from 'react';
import {
    Typography,
    Stack,
    TextField,
    Button,
    Link,
    Box,
    FormHelperText,
} from '@mui/material';
import { grey, indigo } from '@mui/material/colors';
import NextLink from 'next/link';
import GoogleIcon from '@mui/icons-material/Google';
import TextFieldPassword from '@/components/Password';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    return (
        <Stack
            component={'form'}
            p={2}
            px={3}
            spacing={3.5}
            sx={{
                bgcolor: grey[50],
                borderRadius: '6px',
                width: '400px',
                maxWidth: '100%',
                boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
            }}
        >
            <Typography variant="h5">Đăng ký</Typography>
            <Stack spacing={3.5}>
                <Stack position={'relative'}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="medium"
                        placeholder="Email/Tên đăng nhập"
                    />
                    <FormHelperText
                        sx={{
                            color: 'primary.main',
                            top: '100%',
                            position: 'absolute',
                        }}
                    >
                        Tên đăng nhập sai rồi bạn ơi!
                    </FormHelperText>
                </Stack>
                <Stack position={'relative'}>
                    <TextFieldPassword
                        variant="outlined"
                        fullWidth
                        size="medium"
                        placeholder="Mật khẩu"
                    />
                    <FormHelperText
                        sx={{
                            color: 'primary.main',
                            top: '100%',
                            position: 'absolute',
                        }}
                    >
                        Tên đăng nhập sai rồi bạn ơi!
                    </FormHelperText>
                </Stack>
                <Stack position={'relative'}>
                    <TextFieldPassword
                        variant="outlined"
                        fullWidth
                        size="medium"
                        placeholder="Nhập lại mật khẩu"
                    />
                    <FormHelperText
                        margin="dense"
                        sx={{
                            color: 'primary.main',
                            top: '100%',
                            position: 'absolute',
                        }}
                    >
                        Tên đăng nhập sai rồi bạn ơi!
                    </FormHelperText>
                </Stack>
            </Stack>
            <Stack spacing={2} mt={2}>
                <Button
                    sx={{
                        bgcolor: 'primary.main',
                        color: grey[50],
                        transition: 'all 0.3s',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            opacity: 0.9,
                        },
                    }}
                    fullWidth
                    size="medium"
                >
                    Đăng ký
                </Button>
                <Stack
                    alignItems={'center'}
                    justifyContent={'center'}
                    position={'relative'}
                >
                    <Box
                        height={'0.5px'}
                        position={'absolute'}
                        width={'100%'}
                        sx={{
                            bgcolor: grey[500],
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />
                    <Typography
                        px={2}
                        sx={{ bgcolor: grey[50], color: grey[500] }}
                        position={'relative'}
                        variant="body2"
                    >
                        HOẶC
                    </Typography>
                </Stack>
                <Stack>
                    <Button
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        fullWidth
                        size="medium"
                    >
                        Đăng ký với Google
                    </Button>
                </Stack>
            </Stack>
            <Typography
                variant="body2"
                textAlign={'center'}
                sx={{ color: grey[600] }}
                pb={2}
            >
                Bạn đã có tài khoản?{' '}
                <Link component={NextLink} href="/login" underline="none">
                    Đăng nhập
                </Link>
            </Typography>
        </Stack>
    );
};

export default page;
