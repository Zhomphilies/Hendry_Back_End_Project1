const { Customer, Product } = require('../../../../models');

//====================================================================================================

/**
 * Get a list of customers
 * @param {string} sort - sorting type
 * @returns {Promise}
 */
async function getCustomer() {
  return Customer.find({});
}

//====================================================================================================

/**
 * Get customer detail
 * @param {string} id - Customer ID
 * @returns {Promise}
 */
async function getCustomerDetail(id) {
  return Customer.findById(id);
}

//====================================================================================================

/**
 * Create new customer
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createCustomer(name, email, password) {
  return Customer.create({
    name,
    email,
    password,
  });
}

//====================================================================================================

/**
 * Update existing customer
 * @param {string} id - Customer ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateCustomer(id, name, email) {
  return Customer.updateOne(
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
 * Delete a customer
 * @param {string} id - Customer ID
 * @returns {Promise}
 */
async function deleteCustomer(id) {
  return Customer.deleteOne({ _id: id });
}

//====================================================================================================

/**
 * Get customer by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getCustomerByEmail(email) {
  return Customer.findOne({ email });
}

//====================================================================================================

/**
 * Update customer password
 * @param {string} id - Customer ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changeCustomerPassword(id, password) {
  return Customer.updateOne({ _id: id }, { $set: { password } });
}

//====================================================================================================

/**
 * Add item to the cart
 * @param {string} id - Product Id
 * @returns {Promise}
 */
async function getProduct(id) {
  return;
}

/**
 * Add item to the cart
 * @param {string} id - Customer Id
 * @returns {Promise}
 */
async function addItemToCart(id, product) {
  return Customer.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        cart: product,
      },
    }
  );
}

/**
 * Delete item in the cart
 * @param {string} id - Product Id
 * @returns {Promise}
 */
async function deleteItemFromCart(id, productId) {
  return Customer.deleteOne(
    {
      _id: id,
    },
    {
      $pull: {
        cart: {
          _id: productId,
        },
      },
    }
  );
}

module.exports = {
  getCustomer,
  getCustomerDetail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByEmail,
  changeCustomerPassword,

  addItemToCart,
  deleteItemFromCart,
};
