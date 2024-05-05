const sellerService = require('./seller-service');
const { errorResponder, errorTypes } = require('../../../../core/errors');
const { solveToken } = require('../../../../utils/session-token');

/**
 * Handle get list of seller request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getSeller(request, response, next) {
  try {
    const seller = await sellerService.getSeller();

    if (!seller) {
      throw errorResponder(errorTypes.VALIDATION, 'Invalid query');
    }

    return response.status(200).json(seller);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get seller detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getSellerDetail(request, response, next) {
  try {
    const seller = await sellersService.getSellerDetail(request.params.id);

    if (!seller) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown seller');
    }

    return response.status(200).json(seller);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create seller request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createSeller(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await sellerService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await sellerService.createSeller(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create seller'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update seller request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateSeller(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    //Chechking email and token. If the email is same with the token then the email owner can acces the function
    const token = request.headers.authorization.split(' ')[1];

    //Checking if there is seller
    const seller = await sellerService.getSellerDetail(id);
    console.log(seller);
    if (!seller) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no seller with that ID'
      );
    }

    //Chechking email by using ID
    const sellerEmail = await sellerService.getSellerEmailById(seller, id);

    //Checking if the email is registered
    const found = await sellerService.emailIsRegistered(sellerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Email is not registered'
      );
    }

    //Checking the token and email
    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== sellerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Token and email is not compatible'
      );
    }

    // Email must be unique
    const emailIsRegistered = await sellerService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await sellerService.updateSeller(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update seller'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete seller request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteSeller(request, response, next) {
  try {
    const id = request.params.id;

    //Chechking email and token. If the email is same with the token then the email owner can acces the function
    const token = request.headers.authorization.split(' ')[1];

    //Checking if there is seller
    const seller = await sellerService.getSellerDetail(id);
    if (!seller) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no seller with that ID'
      );
    }

    //Chechking email by using ID
    const sellerEmail = await sellerService.getSellerEmailById(seller, id);

    //Checking if the email is registered
    const found = await sellerService.emailIsRegistered(sellerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Email is not registered'
      );
    }

    //Checking the token and email
    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== sellerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Token and email is not compatible'
      );
    }

    const success = await sellerService.deleteSeller(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete seller'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change seller password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changeSellerPassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await sellerService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await sellerService.changeSellerPassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getSeller,
  getSellerDetail,
  createSeller,
  updateSeller,
  deleteSeller,
  changeSellerPassword,
};
