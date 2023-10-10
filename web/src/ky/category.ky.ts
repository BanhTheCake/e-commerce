import { ICategory, IResponse } from '@/types/common';
import { api } from '@/utils/ky.config';
import { HTTPError } from 'ky';

export const getCategoriesQuery = async (q: string = '') => {
    try {
        const query = new URLSearchParams({
            q,
        });
        const response = await api
            .get('categories', {
                searchParams: q ? query : undefined,
            })
            .json<IResponse<ICategory[]>>();
        if (response.errCode !== 0) {
            return Promise.reject(response.message);
        }
        return response;
    } catch (error) {
        const isHttpError = error instanceof HTTPError;
        if (!isHttpError) {
            return Promise.reject('Something went wrong');
        }
        const errJson = await error.response.json();
        return Promise.reject(errJson.message);
    }
};
