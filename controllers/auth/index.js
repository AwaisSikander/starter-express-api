const passport = require("passport");
const register = require("./register");
const login = require("./login");

const userRegister = (userRequest, res, file) =>
  register(userRequest, res, file);

const userLogin = (userRequest, res) => login(userRequest, res);

const userAuth = passport.authenticate("jwt", { session: false });

/**
 * Checks if the provided user role is included in the roles list
 * @param {Array} roles - list of accepted roles.
 * @const checkRole
 */
const checkRole = (roles) => (req, res, next) => {
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();
};

/**
 * returns json of user data.
 * @const serializeUser
 */
const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  userAuth,
  userLogin,
  userRegister,
  checkRole,
  serializeUser,
};
