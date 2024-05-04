const { attempt } = require('joi');
const { Seller, SellerAuthentication } = require('../../../../models');
const { create } = require('lodash');

/**
 * Get seller by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getSellerByEmail(email) {
  return Seller.findOne({ email });
}

async function getAuthenticationByEmail(email) {
  return SellerAuthentication.findOne({ email });
}

async function createAuthenticationByEmail(email, attempt) {
  const createAuthentication = await getAuthenticationByEmail(email);
  if (!createAuthentication) {
    if (attempt === 0) {
      return SellerAuthentication.create({
        email,
        attempt: 0,
      });
    } else {
      return SellerAuthentication.create({
        email,
        attempt: 1,
      });
    }
  }
}

async function getLoginAttempt(email) {
  const get = await SellerAuthentication.findOne({ email });
  if (get) {
    return get.attempt;
  } else {
    return 0;
  }
}

async function setLoginAttempt(email, attempt, timeLogin) {
  return SellerAuthentication.updateOne(
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
  const get = await SellerAuthentication.findOne({ email });
  if (get) {
    return get.timeLogin;
  } else {
    return 0;
  }
}

module.exports = {
  getSellerByEmail,
  getAuthenticationByEmail,
  createAuthenticationByEmail,
  getLoginAttempt,
  setLoginAttempt,
  getLoginTime,
};
