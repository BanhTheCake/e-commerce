import ky, { type NormalizedOptions } from 'ky';

const handleResponse = async (
    req: Request,
    options: NormalizedOptions,
    res: Response
) => {
    if (res.status === 403) {
        // Get a fresh token
        const token = await ky('https://example.com/token').text();

        // Retry with the token
        req.headers.set('Authorization', `token ${token}`);

        return ky(req);
    }
};

export const api = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    credentials: 'include',
});

export const apiPrivate = api.extend({
    hooks: {
        afterResponse: [handleResponse],
    },
});
