'use client';

import { store } from '@/redux/store';
import { FC, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Theme from './Theme';
import Toaster from './Toaster';
import Persistent from './Persistent';

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnReconnect: false,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
                logger: {
                    error(...args) {},
                    log(...args) {},
                    warn(...args) {},
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <Theme>
                    <Persistent>
                        {children}
                        <Toaster />
                    </Persistent>
                </Theme>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default Providers;
