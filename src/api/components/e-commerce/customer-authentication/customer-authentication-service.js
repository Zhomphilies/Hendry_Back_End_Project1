const customerAuthenticationRepository = require('./customer-authentication-repository');
const { errorResponder, errorTypes } = require('../../../../core/errors');
const { generateToken } = require('../../../../utils/session-token');
const { passwordMatched } = require('../../../../utils/password');
const moment = require('moment');

// We define default customer password here as '<RANDOM_PASSWORD_FILTER>'
// to handle the case when the customer login is invalid. We still want to
// check the password anyway, so that it prevents the attacker in
// guessing login credentials by looking at the processing time.

// Because we always check the password (see above comment), we define the
// login attempt as successful when the `customer` is found (by email) and
// the password matches.

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const customer =
    await customerAuthenticationRepository.getCustomerByEmail(email);

  if (!customer) {
    return false;
  }

  let attempt = 0;
  let counterLimit = 0;
  const currLoginTime = moment(
    await customerAuthenticationRepository.getLoginTime(email)
  ).toDate();
  let timeLogin = moment().toDate();

  const customerPassword = customer
    ? customer.password
    : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, customerPassword);
  const currAttempt =
    await customerAuthenticationRepository.getLoginAttempt(email);

  if (currAttempt >= 5) {
    const waitingTime = moment(currLoginTime).add(30, 'm').toDate();
    if (waitingTime - timeLogin > 0) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Forbidden: Too many failed login attempts'
      );
    } else {
      attempt = 0;
      await customerAuthenticationRepository.setLoginAttempt(
        email,
        attempt,
        timeLogin
      );
      return 'bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0';
    }
  }

  if (customer && passwordChecked) {
    counterLimit = 0;
    const createAuthentication =
      customerAuthenticationRepository.createAuthenticationByEmail(
        email,
        counterLimit
      );
    await customerAuthenticationRepository.setLoginAttempt(
      email,
      counterLimit,
      timeLogin
    );

    return {
      email: customer.email,
      name: customer.name,
      customer_id: customer.id,
      token: generateToken(customer.email, customer.id),
    };
  } else {
    attempt = 1;
    counterLimit = currAttempt + attempt;
    const createAuthentication =
      customerAuthenticationRepository.createAuthenticationByEmail(
        email,
        counterLimit
      );
    await customerAuthenticationRepository.setLoginAttempt(
      email,
      counterLimit,
      timeLogin
    );
    return `${timeLogin} Customer ${email} gagal login. Attempt = ${counterLimit}`;
  }
}

module.exports = {
  checkLoginCredentials,
};
