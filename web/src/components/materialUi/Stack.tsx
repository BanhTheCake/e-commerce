'use client';
import { Stack as MUIStack, StackTypeMap } from '@mui/material';
import React, { forwardRef } from 'react';

const Stack = forwardRef<HTMLDivElement, StackTypeMap['props']>(
    (props, ref) => {
        return <MUIStack ref={ref} {...props} />;
    }
);

Stack.displayName = 'Stack';

export default Stack;
