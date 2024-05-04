const sellerAuthenticationRepository = require('./seller-authentication-repository');
const { errorResponder, errorTypes } = require('../../../../core/errors');
const { generateToken } = require('../../../../utils/session-token');
const { passwordMatched } = require('../../../../utils/password');
const moment = require('moment');

// We define default seller password here as '<RANDOM_PASSWORD_FILTER>'
// to handle the case when the seller login is invalid. We still want to
// check the password anyway, so that it prevents the attacker in
// guessing login credentials by looking at the processing time.

// Because we always check the password (see above comment), we define the
// login attempt as successful when the `seller` is found (by email) and
// the password matches.

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const seller = await sellerAuthenticationRepository.getSellerByEmail(email);

  if (!seller) {
    return false;
  }

  let attempt = 0;
  let counterLimit = 0;
  const currLoginTime = moment(
    await sellerAuthenticationRepository.getLoginTime(email)
  ).toDate();
  let timeLogin = moment().toDate();

  const sellerPassword = seller ? seller.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, sellerPassword);
  const currAttempt =
    await sellerAuthenticationRepository.getLoginAttempt(email);

  if (currAttempt >= 5) {
    const waitingTime = moment(currLoginTime).add(30, 'm').toDate();
    if (waitingTime - timeLogin > 0) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Forbidden: Too many failed login attempts'
      );
    } else {
      attempt = 0;
      await sellerAuthenticationRepository.setLoginAttempt(
        email,
        attempt,
        timeLogin
      );
      return 'bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0';
    }
  }

  if (seller && passwordChecked) {
    counterLimit = 0;
    const createAuthentication =
      sellerAuthenticationRepository.createAuthenticationByEmail(
        email,
        counterLimit
      );
    await sellerAuthenticationRepository.setLoginAttempt(
      email,
      counterLimit,
      timeLogin
    );

    return {
      email: seller.email,
      name: seller.name,
      seller_id: seller.id,
      token: generateToken(seller.email, seller.id),
    };
  } else {
    attempt = 1;
    counterLimit = currAttempt + attempt;
    const createAuthentication =
      sellerAuthenticationRepository.createAuthenticationByEmail(
        email,
        counterLimit
      );
    await sellerAuthenticationRepository.setLoginAttempt(
      email,
      counterLimit,
      timeLogin
    );
    return `${timeLogin} Seller ${email} gagal login. Attempt = ${counterLimit}`;
  }
}

module.exports = {
  checkLoginCredentials,
};
