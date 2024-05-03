const { User } = require('../../../models');

//====================================================================================================

/**
 * Get a list of users
 * @param {string} sort - sorting type
 * @returns {Promise}
 */
async function getUsers(sort) {
  let sorting = {};
  let sorts;

  // Bagian ini digunakan untuk memisahkan "filedName" dan "sortOrder"
  const [fieldName, sortOrder] = sort.split(':');

  // Bagian ini digunakan untuk menyorting data berdasarkan email secara "desc" ataupun "asc"
  if (fieldName === 'email') {
    if (sortOrder === 'desc') {
      sorting['email'] = -1;
      sorts = User.find({}).sort(sorting);
    } else {
      sorting['email'] = 1;
      sorts = User.find({}).sort(sorting);
    }
  }
  // Bagian ini digunakan untuk menyorting data berdasarkan name secara "desc" ataupun "asc"
  else if (fieldName === 'name') {
    if (sortOrder === 'desc') {
      sorting['name'] = -1;
      sorts = User.find({}).sort(sorting);
    } else {
      sorting['name'] = 1;
      sorts = User.find({}).sort(sorting);
    }
  } else {
    // Bagian ini digunakan unutk membuat default sort ketika sort tidak ditentukan
    sorting['email'] = 1;
    sorts = User.find({}).sort(sorting);
  }

  return sorts;
}

//====================================================================================================

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

//====================================================================================================

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

//====================================================================================================

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

//====================================================================================================

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

//====================================================================================================

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

//====================================================================================================

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

//====================================================================================================

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
