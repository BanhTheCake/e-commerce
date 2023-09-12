// Create Route

export const CREATE_PRODUCT_ROUTE = {
  SUCCESS: 'Create new product success',
  EXIST_LABEL: 'Please try another label!',
};

// Get product

export const GET_PRODUCT_ROUTE = {
  SUCCESS: (id: string) => `Get product with id ${id} success!`,
};

// Delete product

export const DELETE_PRODUCT_ROUTE = {
  NOT_FOUND: 'Product not found!',
  SUCCESS: (id: string) => 'Delete product with id ' + id + ' success!',
};

// update product

export const UPDATE_PRODUCT_ROUTE = {
  NOTHING: 'Nothing to update',
  NOT_FOUND: 'Product not found!',
  SUCCESS: (id: string) => `Update product with id ${id} successfully!`,
};

// Suggest query

export const SUGGEST_ROUTE = {
  SUCCESS: 'Get auto suggest success!',
};
