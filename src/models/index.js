const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const sellerAuthenticationSchema = require('./seller-authentication-schema');
const sellerSchema = require('./seller-schema');
const productSchema = require('./product-schema');

const usersSchema = require('./users-schema');
const authenticationSchema = require('./authentication-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const SellerAuthentication = mongoose.model(
  'seller authentication',
  mongoose.Schema(sellerAuthenticationSchema)
);
const Seller = mongoose.model('seller', mongoose.Schema(sellerSchema));
const Product = mongoose.model('product', mongoose.Schema(productSchema));
const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Authentication = mongoose.model(
  'authentication',
  mongoose.Schema(authenticationSchema)
);

module.exports = {
  SellerAuthentication,
  Seller,
  mongoose,
  User,
  Authentication,
  Product,
};
