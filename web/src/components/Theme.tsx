'use client';

import { FC, useMemo } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ThemeProps {
    children: React.ReactNode;
}

const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: ['300', '400', '500', '700'],
});
const Theme: FC<ThemeProps> = ({ children }) => {
    const mode = useSelector<RootState, 'light' | 'dark'>(
        (state) => state.mode.mode
    );
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
                ...(mode === 'light'
                    ? {
                          primary: {
                              main: '#f43e2c',
                          },
                      }
                    : {
                          primary: {
                              main: '#f43e2c',
                          },
                      }),
            },
            typography: {
                fontFamily: roboto.style.fontFamily,
            },
            components: {
                MuiContainer: {
                    defaultProps: {
                        sx: {
                            mx: 'auto',
                        },
                    },
                },
                MuiTextField: {
                    variants: [
                        {
                            props: {
                                size: 'medium',
                            },
                            style: {
                                '& input': {
                                    padding: '12px 16px',
                                },
                            },
                        },
                    ],
                    defaultProps: {
                        sx: {
                            '& .MuiInputBase-input': {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        },
                    },
                },
                MuiOutlinedInput: {
                    variants: [
                        {
                            props: {
                                size: 'medium',
                            },
                            style: {
                                '& input': {
                                    padding: '12px 16px',
                                },
                            },
                        },
                    ],
                },
            },
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 600,
                    md: 900,
                    lg: 1200,
                    xl: 1536,
                },
            },
        });
    }, [mode]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default Theme;
