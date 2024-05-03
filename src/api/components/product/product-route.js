const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productControllers = require('./product-controller');
const productValidator = require('./product-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/product', route);

  // Get list of product
  route.get('/', authenticationMiddleware, productControllers.getProducts);

  // Create product
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productValidator.createProduct),
    productControllers.createProduct
  );

  // Get product detail
  route.get(
    '/:id',
    authenticationMiddleware,
    productControllers.getProductById
  );

  // Update product
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productValidator.updateProduct),
    productControllers.updateProduct
  );

  // Delete product
  route.delete(
    '/:id',
    authenticationMiddleware,
    productControllers.deleteProduct
  );
};
