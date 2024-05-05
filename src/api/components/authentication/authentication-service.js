const authenticationRepository = require('./authentication-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const moment = require('moment');

// We define default user password here as '<RANDOM_PASSWORD_FILTER>'
// to handle the case when the user login is invalid. We still want to
// check the password anyway, so that it prevents the attacker in
// guessing login credentials by looking at the processing time.

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  if (!user) {
    return false;
  }

  let attempt = 0;
  let counterLimit = 0;
  const currLoginTime = moment(
    await authenticationRepository.getLoginTime(email)
  ).toDate();
  let timeLogin = moment().toDate();

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);
  const currAttempt = await authenticationRepository.getLoginAttempt(email);

  //Make the consdition to make limit for keeping login to much
  if (currAttempt >= 5) {
    //Adding 30 minutes
    const waitingTime = moment(currLoginTime).add(30, 'm  ').toDate();
    //After 30 minutes customer can try rto login again
    if (waitingTime - timeLogin > 0) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Forbidden: Too many failed login attempts'
      );
    }
    //Condition where waiting time is already 0 or even smaller then 0, reseting attempt
    else {
      attempt = 0;
      await authenticationRepository.setLoginAttempt(email, attempt, timeLogin);
      return 'bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0';
    }
  }

  //Condition there is customer and the password is true
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
  }
  //Condition where there is no customer and the password is false
  else {
    attempt = 1;
    counterLimit = currAttempt + attempt;
    const createAuthentication =
      authenticationRepository.createAuthenticationByEmail(email, counterLimit);
    await authenticationRepository.setLoginAttempt(
      email,
      counterLimit,
      timeLogin
    );
    return `[${moment(timeLogin).format('YYYY-MM-DD HH:mm:ss')}] User ${email} gagal login. Attempt = ${counterLimit}`;
  }
}

module.exports = {
  checkLoginCredentials,
};
