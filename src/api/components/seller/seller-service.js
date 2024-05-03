const sellerRepository = require('./seller-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of sellers
 * @param {string} id - Seller ID
 * @returns {Object}
 */
async function getSeller() {
  const sellers = await sellerRepository.getSeller();

  const results = [];
  for (let i = 0; i < sellers.length; i += 1) {
    const seller = sellers[i];
    results.push({
      id: seller.id,
      name: seller.name,
      email: seller.email,
    });
  }

  return results;
}

//====================================================================================================

/**
 * Get seller detail
 * @param {string} id - Seller ID
 * @returns {Object}
 */
async function getSellerDetail(id) {
  const seller = await sellerRepository.getSellerDetail(id);

  // Seller not found
  if (!seller) {
    return null;
  }

  return {
    id: seller.id,
    name: seller.name,
    email: seller.email,
  };
}

//====================================================================================================

/**
 * Create new seller
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createSeller(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await sellerRepository.createSeller(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Update existing seller
 * @param {string} id - Seller ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateSeller(id, name, email) {
  const seller = await sellerRepository.getSellerDetail(id);

  // Seller not found
  if (!seller) {
    return null;
  }

  try {
    await sellerRepository.updateSeller(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Delete seller
 * @param {string} id - Seller ID
 * @returns {boolean}
 */
async function deleteSeller(id) {
  const seller = await sellerRepository.getSellerDetail(id);

  // seller not found
  if (!seller) {
    return null;
  }

  try {
    await sellerRepository.deleteSeller(id);
  } catch (err) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const seller = await sellerRepository.getSellerByEmail(email);

  if (seller) {
    return true;
  }

  return false;
}

//====================================================================================================

/**
 * Check whether the password is correct
 * @param {string} sellerId - Seller ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkSellerPassword(sellerId, password) {
  const seller = await sellerRepository.getSeller(sellerId);
  return passwordMatched(password, seller.password);
}

//====================================================================================================

/**
 * Change seller password
 * @param {string} sellerId - Seller ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changeSellerPassword(sellerId, password) {
  const seller = await sellerRepository.getSeller(sellerId);

  // Check if seller not found
  if (!seller) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await sellerRepository.changeSellerPassword(
    sellerId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

//====================================================================================================

module.exports = {
  getSeller,
  getSellerDetail,
  createSeller,
  updateSeller,
  deleteSeller,
  emailIsRegistered,
  checkSellerPassword,
  changeSellerPassword,
};
