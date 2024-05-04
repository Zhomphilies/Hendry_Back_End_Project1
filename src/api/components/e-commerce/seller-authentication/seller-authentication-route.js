const express = require('express');

const sellerAuthenticationControllers = require('./seller-authentication-controller');
const sellerAuthenticationValidators = require('./seller-authentication-validator');
const celebrate = require('../../../../core/celebrate-wrappers');

const route = express.Router();

module.exports = (app) => {
  app.use('/seller-authentication', route);

  route.post(
    '/seller-login',
    celebrate(sellerAuthenticationValidators.login),
    sellerAuthenticationControllers.login
  );
};
