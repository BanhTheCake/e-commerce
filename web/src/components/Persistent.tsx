'use client';

import { getCurrentUserQuery } from '@/ky/auth.ky';
import { setCurrentUser } from '@/redux/features/user/userSlice';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface PersistentProps {
    children: React.ReactNode;
}

const Persistent: FC<PersistentProps> = ({ children }) => {
    const dispatch = useDispatch();
    const { data: result } = useQuery({
        queryKey: ['me'],
        queryFn: getCurrentUserQuery,
        retry: 0,
    });

    useEffect(() => {
        if (result) {
            dispatch(setCurrentUser(result));
        }
    }, [result, dispatch]);

    return <>{children}</>;
};

export default Persistent;
