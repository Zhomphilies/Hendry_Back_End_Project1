const productRepository = require('./product-repository');

/**
 * Create new product
 * @param {string} sellerEmail - Seller email
 * @param {string} productName - Product name
 * @param {Number} productPrice - Product price
 * @returns {boolean}
 */
async function getEmail(sellerEmail) {
  const SellerEmail = productRepository.getEmail(sellerEmail);

  if (!SellerEmail) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Get list of products
 * @returns {Array}
 */
async function getProduct() {
  const products = await productRepository.getProduct();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      productName: product.productName,
      productPrice: product.productPrice,
    });
  }

  return results;
}

//====================================================================================================

/**
 * Get Product detail
 * @param {string} id - Product ID
 * @returns {Object}
 */
async function getProductDetail(id) {
  const product = await productRepository.getProductDetail(id);

  // product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    productName: product.productName,
    productPrice: product.productPrice,
  };
}

//====================================================================================================

/**
 * Create new product
 * @param {string} sellerEmail - Seller email
 * @param {string} productName - Product name
 * @param {Number} productPrice - Product price
 * @returns {boolean}
 */
async function createProduct(sellerEmail, productName, productPrice) {
  try {
    await productRepository.createProduct(
      sellerEmail,
      productName,
      productPrice
    );
  } catch (err) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} sellerEmail - Seller email
 * @param {string} productName - Product name
 * @param {Number} productPrice - Product price
 * @returns {boolean}
 */

async function updateProduct(id, productName, productPrice) {
  const product = await productRepository.getProductDetail(id);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productRepository.updateProduct(id, productName, productPrice);
  } catch (err) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Delete product
 * @param {string} id - Product ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await productRepository.getProductDetail(id);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
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
