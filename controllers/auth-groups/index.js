const profile = require("./group-users");
const updateUser = require("./update-user");
const updateGroup = require("./update-group");
const catchAsync = require("../../utils/CatchAsync");

/**
 * profile of a user.
 * @async
 * @function profile
 * @param {Object} userRequest - The data of the user {username, password} where username can be an email.
 * @param {string} role - The role of the user {admin, user, superadmin}.
 * @return {Object} contains 3 attributes {error/success message : string, success : boolean, reason: string}.
 */
const groupUsers = catchAsync(async (req, res, next) =>
  profile(req, req.user, res, next)
);

const updateUserById = catchAsync(async (req, res, next) =>
  updateUser(req, res, next)
);

const updateUserGroup = catchAsync(async (req, res, next) =>
  updateGroup(req, res, next)
);

module.exports = {
  groupUsers,
  updateUserById,
  updateUserGroup,
};
