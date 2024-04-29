const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const moment = require('moment');

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
  let counterLimit = 0;
  let timeLogin = await time();

  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);
  const currAttempt = await authenticationRepository.getLoginAttempt(email);

  if (currAttempt >= 5) {
    const waitingTime = moment(timeLogin).add(30, 'm');
    if (waitingTime - time() !== 0) {
      return null;
    }
    return null;
  }

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
    };
  } else {
    attempt = 1;
    counterLimit = currAttempt + attempt;
    const createAuthentication =
      authenticationRepository.createAuthenticationByEmail(email, counterLimit);
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

async function time() {
  return moment().toDate();
}

module.exports = {
  checkLoginCredentials,
};
