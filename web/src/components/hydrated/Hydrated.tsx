import { ComponentType, FC } from 'react';
import { dehydrate, FetchQueryOptions, Hydrate } from '@tanstack/react-query';
import getQueryClient from '@/utils/getQueryClient';

interface IHydrated {
    children: React.ReactNode;
    queryKey: string[];
    options: FetchQueryOptions;
}

const Hydrated: FC<IHydrated> = async ({ children, queryKey, options }) => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(queryKey, options);
    const dehydratedState = dehydrate(queryClient);
    return <Hydrate state={dehydratedState}>{children}</Hydrate>;
};

export default Hydrated;
