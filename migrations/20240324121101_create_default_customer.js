const logger = require('../src/core/logger')('api');
const { Customer } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';

logger.info('Creating default customer');

(async () => {
  try {
    const numCustomer = await Customer.countDocuments({
      name,
      email,
    });

    if (numCustomer > 0) {
      throw new Error(`Customer ${email} already exists`);
    }

    const hashedPassword = await hashPassword(password);
    await Customer.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
