// add to cart route
export const ADD_TO_CART_ROUTE = {
  SUCCESS: 'Add to cart successfully',
  PRODUCT_NOT_FOUND: 'Product not found',
  OUT_OF_STOCK: 'Product is out of stock',
};

// update cart route
export const UPDATE_CART_ROUTE = {
  PRODUCT_NOT_FOUND: (id: string) => {
    return `Product with id ${id} not found in your cart`;
  },
  OUT_OF_STOCK: (id: string) => {
    return `Product with id ${id} is out of stock`;
  },
  SUCCESS: 'Update cart successfully',
};

// delete cart item route
export const DELETE_CART_ITEM_ROUTE = {
  SUCCESS: 'Delete successfully',
};

// get cart item route
export const GET_CART_ITEM_ROUTE = {
  SUCCESS: 'Get cart item successfully',
};

// payment route
export const PAYMENT_ROUTE = {
  PRODUCT_NOT_FOUND: (id: string) => {
    return `Product with id ${id} not found in your cart`;
  },
  OUT_OF_STOCK: (id: string) => {
    return `Product with id ${id} is out of stock`;
  },
  SUCCESS: 'Payment successfully',
};
