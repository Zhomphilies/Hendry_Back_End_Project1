const customerService = require('./customer-service');
const { errorResponder, errorTypes } = require('../../../../core/errors');
const { solveToken } = require('../../../../utils/session-token');

/**
 * Handle get list of customer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getCustomer(request, response, next) {
  try {
    const customer = await customerService.getCustomer();

    if (!customer) {
      throw errorResponder(errorTypes.VALIDATION, 'Invalid query');
    }

    return response.status(200).json(customer);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get customer detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getCustomerDetail(request, response, next) {
  try {
    const customer = await customerService.getCustomerDetail(request.params.id);

    if (!customer) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown customer');
    }

    return response.status(200).json(customer);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create customer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createCustomer(request, response, next) {
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
    const emailIsRegistered = await customerService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await customerService.createCustomer(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create customer'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update customer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateCustomer(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const token = request.headers.authorization.split(' ')[1];

    const customer = await customerService.getCustomerDetail(id);
    console.log(customer);
    if (!customer) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no customer with that ID'
      );
    }

    const customerEmail = await customerService.getCustomerEmailById(
      customer,
      id
    );

    const found = await customerService.emailIsRegistered(customerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Email is not registered'
      );
    }

    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== customerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Token and email is not compatiblev'
      );
    }

    // Email must be unique
    const emailIsRegistered = await customerService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await customerService.updateCustomer(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update customer'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete customer request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteCustomer(request, response, next) {
  try {
    const id = request.params.id;
    const token = request.headers.authorization.split(' ')[1];

    const customer = await customerService.getCustomerDetail(id);
    console.log(customer);
    if (!customer) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no customer with that ID'
      );
    }

    const customerEmail = await customerService.getCustomerEmailById(
      customer,
      id
    );

    const found = await customerService.emailIsRegistered(customerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== customerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create produc'
      );
    }

    const success = await customerService.deleteCustomer(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete customer'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change customer password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changeCustomerPassword(request, response, next) {
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
      !(await customerService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await customerService.changeCustomerPassword(
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

/**
 * Handle change customer password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function addItemToCart(request, response, next) {
  try {
    const id = request.params.id;
    const productId = request.body.product_Id;

    const token = request.headers.authorization.split(' ')[1];

    const customer = await customerService.getCustomerDetail(id);
    console.log(customer);
    if (!customer) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no customer with that ID'
      );
    }

    const customerEmail = await customerService.getCustomerEmailById(
      customer,
      id
    );

    const found = await customerService.emailIsRegistered(customerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== customerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create produc'
      );
    }

    const addItem = await customerService.addItemToCart(id, productId);

    if (!addItem) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Failed to add item');
    }

    await customerService.totalPaid(id, productId);

    return response.status(200).json({ productId });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change customer password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteItemFromCart(request, response, next) {
  try {
    const id = request.params.id;
    const productId = request.body.product_Id;

    const token = request.headers.authorization.split(' ')[1];

    const customer = await customerService.getCustomerDetail(id);
    console.log(customer);
    if (!customer) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no customer with that ID'
      );
    }

    const customerEmail = await customerService.getCustomerEmailById(
      customer,
      id
    );

    const found = await customerService.emailIsRegistered(customerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== customerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create produc'
      );
    }

    const deleteItem = await customerService.deleteItemFromCart(id, productId);
    console.log(deleteItem);
    if (!deleteItem) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Failed to delete item'
      );
    }
    return response.status(200).json({ productId });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change customer password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function topUp(request, response, next) {
  try {
    const id = request.params.id;
    const wallet = request.body.wallet;

    const token = request.headers.authorization.split(' ')[1];

    const customer = await customerService.getCustomerDetail(id);
    console.log(customer);
    if (!customer) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no customer with that ID'
      );
    }

    const customerEmail = await customerService.getCustomerEmailById(
      customer,
      id
    );

    const found = await customerService.emailIsRegistered(customerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== customerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create produc'
      );
    }

    const topUp = await customerService.topUp(id, wallet);

    console.log(topUp);
    if (!topUp) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Failed to delete item'
      );
    }
    return response.status(200).json({ id, wallet });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change customer password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function purchaseItemInCart(request, response, next) {
  try {
    const id = request.params.id;

    const token = request.headers.authorization.split(' ')[1];

    const customer = await customerService.getCustomerDetail(id);
    console.log(customer);
    if (!customer) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'no customer with that ID'
      );
    }

    const customerEmail = await customerService.getCustomerEmailById(
      customer,
      id
    );

    const found = await customerService.emailIsRegistered(customerEmail);
    if (!found) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to purchase'
      );
    }

    const tokenCheck = await solveToken(token);
    if (tokenCheck.email !== customerEmail) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create produc'
      );
    }

    const purchase = await customerService.purchaseItemInCart(id);
    if (!purchase) {
      throw errorResponden(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to purchase'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCustomer,
  getCustomerDetail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  changeCustomerPassword,

  purchaseItemInCart,
  addItemToCart,
  deleteItemFromCart,
  topUp,
};
