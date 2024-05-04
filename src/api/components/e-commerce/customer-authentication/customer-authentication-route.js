const express = require('express');

const customerAuthenticationControllers = require('./customer-authentication-controller');
const customerAuthenticationValidators = require('./customer-authentication-validator');
const celebrate = require('../../../../core/celebrate-wrappers');

const route = express.Router();

module.exports = (app) => {
  app.use('/customer-authentication', route);

  route.post(
    '/customer-login',
    celebrate(customerAuthenticationValidators.login),
    customerAuthenticationControllers.login
  );
};
