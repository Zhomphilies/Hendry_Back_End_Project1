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

async function getAuthenticationByEmail(email) {
  return CustomerAuthenticationSchema.findOne({ email });
}

async function createAuthenticationByEmail(email, attempt) {
  const createAuthentication = await getAuthenticationByEmail(email);
  if (!createAuthentication) {
    if (attempt === 0) {
      return CustomerAuthenticationSchema.create({
        email,
        attempt: 0,
      });
    } else {
      return CustomerAuthenticationSchema.create({
        email,
        attempt: 1,
      });
    }
  }
}

async function getLoginAttempt(email) {
  const get = await CustomerAuthenticationSchema.findOne({ email });
  if (get) {
    return get.attempt;
  } else {
    return 0;
  }
}

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
