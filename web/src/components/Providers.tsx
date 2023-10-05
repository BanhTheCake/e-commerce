'use client';

import { store } from '@/redux/store';
import { FC } from 'react';
import { Provider } from 'react-redux';
import Theme from './Theme';

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <Theme>{children}</Theme>
        </Provider>
    );
};

export default Providers;
