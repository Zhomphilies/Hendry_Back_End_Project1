const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users by using pagination methods, search, and also sort
 * @param {Number} pageNum - Page number
 * @param {Number} pageSize - Amount of data in one page
 * @param {String} Search - Search name or email
 * @param {String} Sort - Sort by nname or email
 * @returns {Object}
 */
async function getUsers(pageNum, pageSize, search, sort) {
  const users = await usersRepository.getUsersBySearch(search);

  //Input every data inside the array
  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  //Calling getUsersBySearch function and getUsersByPage function
  const searchedData = await getUsersBySearch(results, search);
  const sortedData = await usersRepository.getUserBySort(searchedData, sort);
  const pagination = await getUsersByPage(sortedData, pageNum, pageSize);

  return pagination;
}

/**
 * Make pagination by using page number and page size
 * @param {Array} data - array dari sebelumnya
 * @param {Number} pageNum - Halaman
 * @param {Number} pageSize - Ukuran dari sebuah halaman
 * @returns {Array}
 */
async function getUsersByPage(data, pageNum, pageSize) {
  let temp = [];

  //Assumption if there is no page size
  if (pageSize === null) {
    pageSize = data.length;
  }

  //Getting total page by using ceil to round the number
  const totalPage = Math.ceil(data.length / pageSize);

  let count;
  let prevPage;
  let nextPage;

  //Check all condition that possibilty that will happen
  if (!Number.isInteger(pageNum) && pageNum !== null) {
    return null;
  }
  if (!Number.isInteger(pageSize)) {
    return null;
  }
  if (pageNum <= 0 && pageNum !== null) {
    return null;
  }
  if (pageSize <= 0) {
    return null;
  }
  if (pageNum > totalPage) {
    return null;
  }

  //Showing data if the page number is null
  if (pageNum === null) {
    const result = [];
    for (let j = 1; j <= totalPage; j++) {
      temp = [];
      for (let i = (j - 1) * pageSize; i < j * pageSize; i++) {
        if (i >= data.length) {
          break;
        }
        temp.push(data[i]);
      }
      count = temp.length;
      if (totalPage === 1) {
        nextPage = false;
        prevPage = false;
      } else if (totalPage !== 1 && j === 1) {
        nextPage = true;
        prevPage = false;
      } else if (totalPage !== 1 && totalPage - j === 0) {
        nextPage = false;
        prevPage = true;
      } else if (
        totalPage !== 1 &&
        totalPage - j !== 1 &&
        totalPage - j !== 0
      ) {
        nextPage = true;
        prevPage = true;
      }

      result.push({
        page_number: j,
        page_size: pageSize,
        count: count,
        total_page: totalPage,
        has_previous_page: prevPage,
        has_next_page: nextPage,
        data: temp,
      });
    }

    return result;
  }

  //Showing data if the page number is not null
  else {
    for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
      if (i >= data.length) {
        break;
      }
      temp.push(data[i]);
    }
  }

  if (totalPage === 1) {
    nextPage = false;
    prevPage = false;
  } else if (totalPage !== 1 && pageNum === 1) {
    nextPage = true;
    prevPage = false;
  } else if (totalPage !== 1 && totalPage - pageNum === 0) {
    nextPage = false;
    prevPage = true;
  } else if (
    totalPage !== 1 &&
    totalPage - pageNum !== 1 &&
    totalPage - pageNum !== 0
  ) {
    nextPage = true;
    prevPage = true;
  }

  count = temp.length;

  return {
    page_number: pageNum,
    page_size: pageSize,
    count: count,
    total_page: totalPage,
    has_previous_page: prevPage,
    has_next_page: nextPage,
    data: temp,
  };
}

async function getUsersBySearch(data, search) {
  const temp = [];

  //Checking if the "search" is null or not null
  if (search != null) {
    const [fieldName, searchKey] = search.split(':');

    //Checking the condition if there is field name and search key
    if (fieldName != null && searchKey != null) {
      //Check the field name is email or name
      if (fieldName === 'email' || fieldName === 'name') {
        //The condition where field name is email
        if (fieldName === 'email') {
          for (let i = 0; i < data.length; i++) {
            if (data[i].email.includes(searchKey)) {
              temp.push(data[i]);
            }
          }
        }
        //The condition where field name is name
        else if (fieldName === 'name') {
          for (let i = 0; i < data.length; i++) {
            if (data[i].name.includes(searchKey)) {
              temp.push(data[i]);
            }
          }
        }
      }
      //The consition where field name is not name anda email
      else {
        for (let i = 0; i < data.length; i++) {
          temp.push(data[i]);
        }
      }
    }
  }
  //The default condition if there is no query
  else {
    for (let i = 0; i < data.length; i++) {
      temp.push(data[i]);
    }
  }

  return temp;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
