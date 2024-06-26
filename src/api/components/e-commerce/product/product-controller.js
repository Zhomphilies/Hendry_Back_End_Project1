const productService = require('./product-service');
const { errorResponder, errorTypes } = require('../../../../core/errors');
const { solveToken } = require('../../../../utils/session-token');

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await productService.getProduct();

    if (!product) {
      throw errorResponder(errorTypes.VALIDATION, 'Invalid query');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

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
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

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
    const productStock = request.body.productStock;

    //Chechking email and token. If the email is same with the token then the email owner can acces the function
    const token = request.headers.authorization.split(' ')[1];

    //Checking if there is seller
    const found = await productService.getSellerByEmail(sellerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Seller email not found'
      );
    }

    //Checking the token and email
    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== sellerEmail) {
      throw errorResponder(
        errorTypes.PARSE_TOKEN,
        'Token and email is not compatible'
      );
    }

    //Try to make product
    const success = await productService.createProduct(
      sellerEmail,
      productName,
      productPrice,
      productStock
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response
      .status(200)
      .json({ sellerEmail, productName, productPrice, productStock });
  } catch (error) {
    return next(error);
  }
}

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
    const sellerEmail = request.body.sellerEmail;
    const productName = request.body.productName;
    const productPrice = request.body.productPrice;
    const productStock = request.body.productStock;

    //Chechking email and token. If the email is same with the token then the email owner can acces the function
    const token = request.headers.authorization.split(' ')[1];

    //Checking if there is seller
    const found = await productService.getSellerByEmail(sellerEmail);
    if (!found) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Seller email not found');
    }

    //Checking the token and email
    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== sellerEmail) {
      throw errorResponder(
        errorTypes.PARSE_TOKEN,
        'Token and email is not compatible'
      );
    }

    //Try to update product
    const success = await productService.updateProduct(
      id,
      sellerEmail,
      productName,
      productPrice,
      productStock
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

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
    const sellerEmail = request.body.sellerEmail;

    //Chechking email and token. If the email is same with the token then the email owner can acces the function
    const token = request.headers.authorization.split(' ')[1];

    //Checking if there is seller
    const found = await productService.getSellerByEmail(sellerEmail);
    if (!found) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Seller email not found');
    }

    //Checking the token and email
    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== sellerEmail) {
      throw errorResponder(
        errorTypes.PARSE_TOKEN,
        'Token and email is not compatible'
      );
    }

    //Try to delete product
    const success = await productService.deleteProduct(id, sellerEmail);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

//====================================================================================================

module.exports = {
  getProduct,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};
