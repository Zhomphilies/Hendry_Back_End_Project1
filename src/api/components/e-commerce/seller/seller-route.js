const express = require('express');

const authenticationMiddleware = require('../../../middlewares/authentication-middleware');
const celebrate = require('../../../../core/celebrate-wrappers');
const sellerControllers = require('./seller-controller');
const sellerValidator = require('./seller-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/seller', route);

  // Get list of seller
  route.get('/', authenticationMiddleware, sellerControllers.getSeller);

  // Create seller
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(sellerValidator.createSeller),
    sellerControllers.createSeller
  );

  // Get seller detail
  route.get(
    '/:id',
    authenticationMiddleware,
    sellerControllers.getSellerDetail
  );

  // Update seller
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(sellerValidator.updateSeller),
    sellerControllers.updateSeller
  );

  // Delete seller
  route.delete(
    '/:id',
    authenticationMiddleware,
    sellerControllers.deleteSeller
  );

  // Change seller password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(sellerValidator.changeSellerPassword),
    sellerControllers.changeSellerPassword
  );
};
