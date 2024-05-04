const customerRepository = require('./customer-repository');
const { hashPassword, passwordMatched } = require('../../../../utils/password');

/**
 * Get list of customers
 * @param {string} id - Customer ID
 * @returns {Object}
 */
async function getCustomer() {
  const customers = await customerRepository.getCustomer();

  const results = [];
  for (let i = 0; i < customers.length; i += 1) {
    const customer = customers[i];
    results.push({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    });
  }

  return results;
}

//====================================================================================================

/**
 * Get customer detail
 * @param {string} id - Customer ID
 * @returns {Object}
 */
async function getCustomerDetail(id) {
  const customer = await customerRepository.getCustomerDetail(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
  };
}

//====================================================================================================

/**
 * Create new customer
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createCustomer(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await customerRepository.createCustomer(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Update existing customer
 * @param {string} id - Customer ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateCustomer(id, name, email) {
  const customer = await customerRepository.getCustomerDetail(id);

  // Customer not found
  if (!customer) {
    return null;
  }

  try {
    await customerRepository.updateCustomer(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

//====================================================================================================

/**
 * Delete customer
 * @param {string} id - Customer ID
 * @returns {boolean}
 */
async function deleteCustomer(id) {
  const customer = await customerRepository.getCustomerDetail(id);

  // customer not found
  if (!customer) {
    return null;
  }

  try {
    await customerRepository.deleteCustomer(id);
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
  const customer = await customerRepository.getCustomerByEmail(email);

  if (customer) {
    return true;
  }

  return false;
}

//====================================================================================================

/**
 * Check whether the password is correct
 * @param {string} customerId - Customer ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkCustomerPassword(customerId, password) {
  const customer = await customerRepository.getCustomer(customerId);
  return passwordMatched(password, customer.password);
}

//====================================================================================================

/**
 * Change customer password
 * @param {string} customerId - Customer ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changeCustomerPassword(customerId, password) {
  const customer = await customerRepository.getCustomer(customerId);

  // Check if customer not found
  if (!customer) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await customerRepository.changeCustomerPassword(
    customerId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

//====================================================================================================

module.exports = {
  getCustomer,
  getCustomerDetail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  emailIsRegistered,
  checkCustomerPassword,
  changeCustomerPassword,
};
