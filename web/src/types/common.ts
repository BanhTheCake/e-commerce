export interface IResponse<T> {
    data: T;
    errCode: number;
    message: string;
}

export interface IImage {
    id: string;
    url: string;
    publicKey?: string;
    created_at: string;
    updated_at: string;
}

export interface ICategory {
    id: string;
    label: string;
    slug: string;
    created_at: string;
    updated_at: string;
    image: IImage;
}
