const { attempt } = require('joi');
const { User, Authentication } = require('../../../models');
const { create } = require('lodash');
const { timeLogin } = require('../../../models/authentication-schema');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getAuthenticationByEmail(email) {
  return Authentication.findOne({ email });
}

async function createAuthenticationByEmail(email, attempt) {
  const createAuthentication = await getAuthenticationByEmail(email);
  if (!createAuthentication) {
    if (attempt === 0) {
      return Authentication.create({
        email,
        attempt: 0,
      });
    } else {
      return Authentication.create({
        email,
        attempt: 1,
      });
    }
  }
}

async function getLoginAttempt(email) {
  const get = await Authentication.findOne({ email });
  if (get) {
    return get.attempt;
  } else {
    return 0;
  }
}

async function setLoginAttempt(email, attempt, timeLogin) {
  return Authentication.updateOne(
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
  const get = await Authentication.findOne({ email });
  if (get) {
    return get.timeLogin;
  } else {
    return 0;
  }
}

module.exports = {
  getUserByEmail,
  getAuthenticationByEmail,
  createAuthenticationByEmail,
  getLoginAttempt,
  setLoginAttempt,
  getLoginTime,
};
