const express = require('express');

const seller = require('./components/seller/seller-route');
const product = require('./components/product/product-route');
const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');

module.exports = () => {
  const app = express.Router();

  seller(app);
  product(app);
  authentication(app);
  users(app);

  return app;
};
