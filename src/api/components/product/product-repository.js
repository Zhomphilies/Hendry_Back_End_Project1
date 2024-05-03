const { User, Product } = require('../../../models');

/**
 * Get products
 * @param {string} sellerEmail - User email
 * @returns {Promise}
 */
async function getEmail(sellerEmail) {
  return User.findOne({ sellerEmail });
}

//====================================================================================================

/**
 * Get products
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct() {
  return Product.find({});
}

//====================================================================================================

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProductDetail(id) {
  return Product.findById(id);
}

//====================================================================================================

/**
 * Create new product
 * @param {string} sellerEmail - Seller email
 * @param {string} productName - Product name
 * @param {string} productPrice - Product price
 * @returns {Promise}
 */
async function createProduct(sellerEmail, productName, productPrice) {
  return Product.create({
    sellerEmail,
    productName,
    productPrice,
  });
}

//====================================================================================================

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} productName - Product name
 * @param {string} productPrice - Product price
 * @returns {Promise}
 */
async function updateProduct(id, productName, productPrice) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        productName,
        productPrice,
      },
    }
  );
}

//====================================================================================================

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

//====================================================================================================

module.exports = {
  getEmail,
  getProduct,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};
