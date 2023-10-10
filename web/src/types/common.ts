export interface IResponse<T> {
    data: T;
    errCode: number;
    message: string;
}
