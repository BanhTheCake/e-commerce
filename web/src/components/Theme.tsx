'use client';

import { FC, Ref, forwardRef, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
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
                }
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
