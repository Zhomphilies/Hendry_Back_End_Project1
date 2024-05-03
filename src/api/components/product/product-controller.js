const productService = require('./product-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    const product = await usersService.getProducts();

    if (!product) {
      throw errorResponder(errorTypes.VALIDATION, 'Invalid query');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

//====================================================================================================

/**
 * Handle get product detail request by using ID
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProductDetail(request, response, next) {
  try {
    const id = request.param.id;

    const product = await productService.getProductDetail(id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

//====================================================================================================

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const sellerEmail = request.body.sellerEmail;
    const productName = request.body.productName;
    const productPrice = request.body.productPrice;

    const user = await productService.getEmail(sellerEmail);
    if (user === null) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    const success = await productService.createProduct(
      sellerEmail,
      productName,
      productPrice
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response
      .status(200)
      .json({ sellerEmail, productName, productPrice });
  } catch (error) {
    return next(error);
  }
}

//====================================================================================================

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;

    const productName = request.body.productName;
    const productPrice = request.body.productPrice;

    const success = await usersService.updateUser(
      id,
      productName,
      productPrice
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

//====================================================================================================

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

//====================================================================================================

module.exports = {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};
