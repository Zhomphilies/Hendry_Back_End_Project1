const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { addItemToCart, deleteItemFromCart } = require('./customer-repository');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createCustomer: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },

  updateCustomer: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changeCustomerPassword: {
    body: {
      password_old: joi.string().required().label('Old password'),
      password_new: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('New password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },

  addItemToCart: {
    body: {
      product_Id: joi.string().required().label('Product ID'),
    },
  },

  deleteItemFromCart: {
    body: {
      product_Id: joi.string().required().label('Product ID'),
    },
  },

  topUp: {
    body: {
      wallet: joi.number().required().label('wallet'),
    },
  },
};
