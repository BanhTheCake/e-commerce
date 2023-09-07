interface IPaginationFn {
  limit: number;
  page: number;
  total: number;
}

export const paginationFn = (data: IPaginationFn) => {
  const { limit, page, total } = data;
  const pages = Math.ceil(total / limit);
  const hasNextPage = page < pages;
  const hasPrevPage = page > 1;
  return {
    limit,
    page,
    pages,
    total,
    hasNextPage,
    hasPrevPage,
  };
};
