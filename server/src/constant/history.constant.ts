// Get All histories route
export const GET_ALL_HISTORY_ROUTE = {
  SUCCESS: 'Get all histories success',
};

// Get History by id route
export const GET_BY_ID_HISTORY_ROUTE = {
  SUCCESS: 'Get history success',
  NOT_FOUND: (id: string) => {
    return `History with id ${id} not found`;
  },
};
