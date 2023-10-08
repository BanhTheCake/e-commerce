'use client';

import { store } from '@/redux/store';
import { FC, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Theme from './Theme';

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <Theme>{children}</Theme>
            </Provider>
        </QueryClientProvider>
    );
};

export default Providers;
