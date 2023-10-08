'use client';

import { FC, useState, forwardRef } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    TextFieldProps,
} from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VisibilityOn from '@mui/icons-material/Visibility';

const TextFieldPassword = forwardRef<
    HTMLInputElement,
    Omit<TextFieldProps, 'InputProps' | 'type'>
>((props, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <TextField
            ref={ref}
            {...props}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
                endAdornment: (
                    <InputAdornment
                        position="end"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <IconButton aria-label="toggle password visibility">
                            {showPassword ? (
                                <VisibilityOn />
                            ) : (
                                <VisibilityOff />
                            )}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
});

TextFieldPassword.displayName = 'TextFieldPassword';

export default TextFieldPassword;
