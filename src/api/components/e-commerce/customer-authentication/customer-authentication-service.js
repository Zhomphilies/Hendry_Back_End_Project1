const customerAuthenticationRepository = require('./customer-authentication-repository');
const { errorResponder, errorTypes } = require('../../../../core/errors');
const { generateToken } = require('../../../../utils/session-token');
const { passwordMatched } = require('../../../../utils/password');
const moment = require('moment');

// We define default customer password here as '<RANDOM_PASSWORD_FILTER>'
// to handle the case when the customer login is invalid. We still want to
// check the password anyway, so that it prevents the attacker in
// guessing login credentials by looking at the processing time.

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

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `customer` is found (by email) and
  // the password matches.
  const customerPassword = customer
    ? customer.password
    : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, customerPassword);
  const currAttempt =
    await customerAuthenticationRepository.getLoginAttempt(email);

  //Make the consdition to make limit for keeping login to much
  if (currAttempt >= 5) {
    //Adding 30 minutes
    const waitingTime = moment(currLoginTime).add(30, 'm').toDate();
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
      await customerAuthenticationRepository.setLoginAttempt(
        email,
        attempt,
        timeLogin
      );
      return 'bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0';
    }
  }

  //Condition there is customer and the password is true
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
  }
  //Condition where there is no customer and the password is false
  else {
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
