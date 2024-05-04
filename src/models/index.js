const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const customerSchema = require('./customer-schema');
const sellerSchema = require('./seller-schema');
const productSchema = require('./product-schema');
const customerAuthenticationSchema = require('./customer-authentication-schema');
const sellerAuthenticationSchema = require('./seller-authentication-schema');

const usersSchema = require('./users-schema');
const authenticationSchema = require('./authentication-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const Customer = mongoose.model('customer', mongoose.Schema(customerSchema));
const Seller = mongoose.model('seller', mongoose.Schema(sellerSchema));
const Product = mongoose.model('product', mongoose.Schema(productSchema));
const CustomerAuthenticationSchema = mongoose.model(
  'customer authentication',
  mongoose.Schema(customerAuthenticationSchema)
);
const SellerAuthentication = mongoose.model(
  'seller authentication',
  mongoose.Schema(sellerAuthenticationSchema)
);

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Authentication = mongoose.model(
  'authentication',
  mongoose.Schema(authenticationSchema)
);

module.exports = {
  CustomerAuthenticationSchema,
  Customer,
  SellerAuthentication,
  Seller,
  Product,

  mongoose,
  User,
  Authentication,
};
