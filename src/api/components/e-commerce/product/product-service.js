const productRepository = require('./product-repository');

/**
 * Create new product
 * @param {string} sellerEmail - Seller email
 * @param {string} productName - Product name
 * @param {Number} productPrice - Product price
 * @returns {boolean}
 */
async function getSellerByEmail(sellerEmail) {
  const email = await productRepository.getSellerByEmail(sellerEmail);

  if (email) {
    return true;
  }

  return false;
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
      sellerEmail: product.sellerEmail,
      productName: product.productName,
      productPrice: product.productPrice,
      productStock: product.productStock,
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
    sellerEmail: product.sellerEmail,
    productName: product.productName,
    productPrice: product.productPrice,
    productStock: product.productStock,
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
async function createProduct(
  sellerEmail,
  productName,
  productPrice,
  productStock
) {
  try {
    await productRepository.createProduct(
      sellerEmail,
      productName,
      productPrice,
      productStock
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

async function updateProduct(
  id,
  sellerEmail,
  productName,
  productPrice,
  productStock
) {
  const product = await productRepository.getProductDetail(id);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productRepository.updateProduct(
      id,
      sellerEmail,
      productName,
      productPrice,
      productStock
    );
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
async function deleteProduct(id, sellerEmail) {
  const product = await productRepository.getProductDetail(id);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await productRepository.deleteProduct(id, sellerEmail);
  } catch (err) {
    return null;
  }

  return true;
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
