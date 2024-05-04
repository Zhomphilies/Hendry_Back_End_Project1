const express = require('express');

const authenticationMiddleware = require('../../../middlewares/authentication-middleware');
const celebrate = require('../../../../core/celebrate-wrappers');
const customerControllers = require('./customer-controller');
const customerValidator = require('./customer-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/customer', route);

  // Get list of customer
  route.get('/', authenticationMiddleware, customerControllers.getCustomer);

  // Create customer
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(customerValidator.createCustomer),
    customerControllers.createCustomer
  );

  // Get customer detail
  route.get(
    '/:id',
    authenticationMiddleware,
    customerControllers.getCustomerDetail
  );

  // Update customer
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(customerValidator.updateCustomer),
    customerControllers.updateCustomer
  );

  // Delete customer
  route.delete(
    '/:id',
    authenticationMiddleware,
    customerControllers.deleteCustomer
  );

  // Change customer password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(customerValidator.changeCustomerPassword),
    customerControllers.changeCustomerPassword
  );
};
