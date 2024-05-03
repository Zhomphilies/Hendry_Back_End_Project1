const logger = require('../src/core/logger')('api');
const { Seller } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';

logger.info('Creating default seller');

(async () => {
  try {
    const numSeller = await Seller.countDocuments({
      name,
      email,
    });

    if (numSeller > 0) {
      throw new Error(`Seller ${email} already exists`);
    }

    const hashedPassword = await hashPassword(password);
    await Seller.create({
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
