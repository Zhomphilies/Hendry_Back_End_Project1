const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      sellerEmail: joi.string().email().required().label('Email'),
      productName: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Product name'),
      productPrice: joi.number().required().label('Product price'),
    },
  },

  updateProduct: {
    body: {
      sellerEmail: joi.string().email().required().label('Email'),
      productName: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Product name'),
      productPrice: joi.number().required().label('Product price'),
    },
  },
};
