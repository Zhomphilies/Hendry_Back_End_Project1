const { Seller } = require('../../../../models');

//====================================================================================================

/**
 * Get a list of sellers
 * @param {string} sort - sorting type
 * @returns {Promise}
 */
async function getSeller() {
  return Seller.find({});
}

//====================================================================================================

/**
 * Get seller detail
 * @param {string} id - Seller ID
 * @returns {Promise}
 */
async function getSellerDetail(id) {
  return Seller.findById(id);
}

//====================================================================================================

/**
 * Create new seller
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createSeller(name, email, password) {
  return Seller.create({
    name,
    email,
    password,
  });
}

//====================================================================================================

/**
 * Update existing seller
 * @param {string} id - Seller ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateSeller(id, name, email) {
  return Seller.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

//====================================================================================================

/**
 * Delete a seller
 * @param {string} id - Seller ID
 * @returns {Promise}
 */
async function deleteSeller(id) {
  return Seller.deleteOne({ _id: id });
}

//====================================================================================================

/**
 * Get seller by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getSellerByEmail(email) {
  return Seller.findOne({ email });
}

//====================================================================================================

/**
 * Update seller password
 * @param {string} id - Seller ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changeSellerPassword(id, password) {
  return Seller.updateOne({ _id: id }, { $set: { password } });
}

//====================================================================================================

module.exports = {
  getSeller,
  getSellerDetail,
  createSeller,
  updateSeller,
  deleteSeller,
  getSellerByEmail,
  changeSellerPassword,
};
