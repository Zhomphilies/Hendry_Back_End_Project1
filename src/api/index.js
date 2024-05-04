const express = require('express');

const sellerAuthentication = require('./components/e-commerce/seller-authentication/seller-authentication-route');
const seller = require('./components/e-commerce/seller/seller-route');
const product = require('./components/e-commerce/product/product-route');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');

module.exports = () => {
  const app = express.Router();

  sellerAuthentication(app);
  seller(app);
  product(app);
  authentication(app);
  users(app);

  return app;
};
