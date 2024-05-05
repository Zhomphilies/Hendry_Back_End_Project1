const { attempt } = require('joi');
const {
  Customer,
  CustomerAuthenticationSchema,
} = require('../../../../models');
const { create } = require('lodash');

/**
 * Get customer by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getCustomerByEmail(email) {
  return Customer.findOne({ email });
}

/**
 * Get customer by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getAuthenticationByEmail(email) {
  return CustomerAuthenticationSchema.findOne({ email });
}

/**
 * Creating customer login attempt
 * @param {string} email - Email
 * @param {string} attemp - Login attempt
 * @returns {Promise}
 */
async function createAuthenticationByEmail(email, attempt) {
  const createAuthentication = await getAuthenticationByEmail(email);
  if (!createAuthentication) {
    //Condition where attempt is 0
    if (attempt === 0) {
      return CustomerAuthenticationSchema.create({
        email,
        attempt: 0,
      });
    }
    //Condition where attempt is 1
    else {
      return CustomerAuthenticationSchema.create({
        email,
        attempt: 1,
      });
    }
  }
}

/**
 * Get email attempt
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getLoginAttempt(email) {
  const get = await CustomerAuthenticationSchema.findOne({ email });
  if (get) {
    return get.attempt;
  } else {
    return 0;
  }
}

/**
 * set attempt and time login by email
 * @param {string} email - Email
 * @param {string} attemp - Login attempt
 * @param {string} timeLogin - time login
 * @returns {Promise}
 */
async function setLoginAttempt(email, attempt, timeLogin) {
  return CustomerAuthenticationSchema.updateOne(
    {
      email: email,
    },
    {
      $set: {
        attempt,
        timeLogin,
      },
    }
  );
}

/**
 * Get login time by email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getLoginTime(email) {
  const get = await CustomerAuthenticationSchema.findOne({ email });
  if (get) {
    return get.timeLogin;
  } else {
    return 0;
  }
}

module.exports = {
  getCustomerByEmail,
  getAuthenticationByEmail,
  createAuthenticationByEmail,
  getLoginAttempt,
  setLoginAttempt,
  getLoginTime,
};
