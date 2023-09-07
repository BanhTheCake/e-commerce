export interface IPagination<T> {
  limit: number;
  page: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: T;
}
