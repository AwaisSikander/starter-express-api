const profile = require("./profile");
const catchAsync = require("../../utils/CatchAsync");

/**
 * profile of a user.
 * @async
 * @function profile
 * @param {Object} userRequest - The data of the user {username, password} where username can be an email.
 * @param {string} role - The role of the user {admin, user, superadmin}.
 * @return {Object} contains 3 attributes {error/success message : string, success : boolean, reason: string}.
 */
const userProfile = async (req, res) => catchAsync(profile(req, req.user, res));

module.exports = {
  userProfile,
};
