export interface IPagination<T> {
  limit: number;
  page: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: T;
}

export interface ICursor<T> {
  limit: number;
  total: number;
  next: number;
  data: T;
}
