'use client';

import { FC } from 'react';
import { Box, ToggleButton, Stack, IconButton, Button } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { grey, yellow } from '@mui/material/colors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggle } from '@/redux/features/mode/modeSlice';

interface ToggleModeBtnProps {}

const ToggleModeBtn: FC<ToggleModeBtnProps> = ({}) => {
    const mode = useSelector<RootState, 'light' | 'dark'>(
        (state) => state.mode.mode
    );

    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(toggle());
    };

    return (
        <Stack direction={'row'} spacing={0}>
            <IconButton
                size="small"
                sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        opacity: 0.9,
                    },
                }}
                onClick={onClick}
            >
                <LightModeIcon
                    sx={{
                        color: yellow[700],
                        transition: 'all 0.2s ease-in-out',
                        ...(mode === 'light'
                            ? {
                                  opacity: 1,
                                  visibility: 'visible',
                                  position: 'static',
                              }
                            : {
                                  opacity: 0,
                                  visibility: 'hidden',
                                  position: 'absolute',
                              }),
                    }}
                />
                <NightlightIcon
                    sx={{
                        color: yellow[700],
                        transition: 'all 0.2s ease-in-out',
                        ...(mode === 'dark'
                            ? {
                                  opacity: 1,
                                  visibility: 'visible',
                                  position: 'static',
                              }
                            : {
                                  opacity: 0,
                                  visibility: 'hidden',
                                  position: 'absolute',
                              }),
                    }}
                />
            </IconButton>
        </Stack>
    );
};

export default ToggleModeBtn;
