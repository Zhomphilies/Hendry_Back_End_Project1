const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { Authentication } = require('../../../models');
const { set } = require('lodash');
const { timeLogin } = require('../../../models/authentication-schema');

// We define default user password here as '<RANDOM_PASSWORD_FILTER>'
// to handle the case when the user login is invalid. We still want to
// check the password anyway, so that it prevents the attacker in
// guessing login credentials by looking at the processing time.

// Because we always check the password (see above comment), we define the
// login attempt as successful when the `user` is found (by email) and
// the password matches.

// /**
//  * Check username and password for login.
//  * @param {string} email - Email
//  * @param {string} password - Password
//  * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
//  */
// async function checkLoginCredentials(email, password) {
//   const user = await authenticationRepository.getUserByEmail(email);
//   const createAuthentication =
//     await authenticationRepository.createAuthenticationByEmail(email);

//   const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
//   const passwordChecked = await passwordMatched(password, userPassword);

//   if (user && passwordChecked) {
//     let totalAttempt = 0;
//     authenticationRepository.setLimit(email, totalAttempt);
//     return {
//       email: user.email,
//       name: user.name,
//       user_id: user.id,
//       token: generateToken(user.email, user.id),
//       attempt: totalAttempt,
//     };
//   } else {
//     let attempt = await authenticationRepository.getLimit(email);
//     let totalAttempt = attempt + 1;
//     authenticationRepository.setLimit(email, totalAttempt);
//     return {
//       email: user.email,
//       attempt: totalAttempt,
//     };
//   }
// }

// module.exports = {
//   checkLoginCredentials,
// };

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);
  let attempt = 0;
  let counterLimit;
  let timeLogin = await time();

  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  if (user && passwordChecked) {
    counterLimit = 0;
    const createAuthentication =
      authenticationRepository.createAuthenticationByEmail(email, counterLimit);
    await authenticationRepository.setLoginAttempt(
      email,
      counterLimit,
      timeLogin
    );

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
      attempt: counterLimit,
      timeLogin: timeLogin,
    };
  } else {
    const currAttempt = await authenticationRepository.getLoginAttempt(email);

    attempt = 1;
    const createAuthentication =
      authenticationRepository.createAuthenticationByEmail(email, counterLimit);
    counterLimit = currAttempt + attempt;
    await authenticationRepository.setLoginAttempt(
      email,
      counterLimit,
      timeLogin
    );
    return {
      email: email,
      attempt: counterLimit,
      timeLogin: timeLogin,
    };
  }
}

async function setTime(attempt, timeLogin) {
  if (currAttempt > 5) {
    const waitingTime = time().getMinutes() + 30;

    if (timeLogin - waitingTime) {
    }
  }
}

async function time() {
  const currTime = new Date();
  const year = currTime.getFullYear();
  const month = ('0' + (currTime.getMonth() + 1)).slice(-2);
  const day = ('0' + currTime.getDate()).slice(-2);
  const hour = ('0' + currTime.getHours()).slice(-2);
  const minute = ('0' + currTime.getMinutes()).slice(-2);
  const second = ('0' + currTime.getSeconds()).slice(-2);
  const time = `[${year}-${month}-${day} ${hour}:${minute}:${second}]`;
  return time;
}

module.exports = {
  checkLoginCredentials,
};
