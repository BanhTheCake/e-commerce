import { FC } from 'react';
import {
    Typography,
    Stack,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Link,
    Box,
    FormHelperText,
} from '@mui/material';
import { grey, indigo } from '@mui/material/colors';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
            <Typography variant="h5">Đăng nhập</Typography>
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
            </Stack>
            <Stack spacing={1}>
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
                    Đăng nhập
                </Button>
                <Link href="/forgot" component={NextLink} underline="none">
                    <Typography variant="body2" sx={{ color: indigo[600] }}>
                        Quên mật khẩu?
                    </Typography>
                </Link>
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
                        sx={{ mt: 1 }}
                    >
                        Đăng nhập với Google
                    </Button>
                </Stack>
            </Stack>
            <Typography
                variant="body2"
                textAlign={'center'}
                sx={{ color: grey[600] }}
                pb={2}
            >
                Bạn mới biết đến banhTheEcommerce?{' '}
                <Link component={NextLink} href="/signup" underline="none">
                    Đăng ký
                </Link>
            </Typography>
        </Stack>
    );
};

export default page;
