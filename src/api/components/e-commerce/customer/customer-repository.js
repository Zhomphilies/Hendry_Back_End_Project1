const { Customer, Product } = require('../../../../models');

//====================================================================================================

/**
 * Get a list of customers
 * @returns {Promise}
 */
async function getCustomer() {
  return Customer.find({});
}

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
 * Create new customer by make the total payment and wallet is empty
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
    totalPayment: 0,
    wallet: 0,
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
 * @param {string} id - Customer Id
 * @param {obbject} product- Product object
 * @returns {Promise}
 */
async function addItemToCart(id, product) {
  return Customer.updateOne(
    {
      _id: id,
    },
    {
      $push: {
        cart: product,
      },
    }
  );
}

/**
 * Delete item in the cart
 * @param {string} id - Customer ID
 * @param {string} productId - Product Id
 * @returns {Promise}
 */
async function deleteItemFromCart(id, productId) {
  return Customer.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        cart: {
          id: productId,
        },
      },
    }
  );
}

/**
 * Update the total payment that need to pay by customer
 * @param {string} id - Product Id
 * @param {string} totalPayment - tottal payment
 * @returns {Promise}
 */
async function totalPaid(id, totalPayment) {
  return Customer.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        totalPayment,
      },
    }
  );
}

/**
 * Top up customer wallet
 * @param {string} id - Product Id
 * @param {string} wallet -  Customer wallet
 * @returns {Promise}
 */
async function topUp(id, wallet) {
  return Customer.updateOne(
    {
      _id: id,
    },
    {
      $inc: {
        wallet,
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
  totalPaid,
  topUp,
};
