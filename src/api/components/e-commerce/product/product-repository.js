const { Seller, Product } = require('../../../../models');

/**
 * Get products
 * @param {string} email - seller email
 * @returns {Promise}
 */
async function getSellerByEmail(sellerEmail) {
  return Seller.findOne({ email: sellerEmail });
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
async function updateProduct(id, sellerEmail, productName, productPrice) {
  return Product.updateOne(
    {
      _id: id,
      sellerEmail: sellerEmail,
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
async function deleteProduct(id, sellerEmail) {
  return Product.deleteOne({ _id: id, sellerEmail: sellerEmail });
}

//====================================================================================================

module.exports = {
  getSellerByEmail,
  getProduct,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};
