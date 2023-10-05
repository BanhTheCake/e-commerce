'use client';

import { FC, useState } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    TextFieldProps,
} from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VisibilityOn from '@mui/icons-material/Visibility';

const TextFieldPassword: FC<Omit<TextFieldProps, 'InputProps' | 'type'>> = (
    props
) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <TextField
            {...props}
            type={showPassword ? 'password' : 'text'}
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
};

export default TextFieldPassword;
