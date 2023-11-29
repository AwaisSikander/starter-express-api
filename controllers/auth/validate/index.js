const User = require("../../../models/User");
const Group = require("../../../models/Group");
const Joi = require("joi");

/**
 * Check if user account exist by username.
 * @async
 * @function validateUsername
 * @param {string} username - The username of the user.
 * @return {boolean} If the user has an account.
 */
const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * Check if user account exist by email.
 * @async
 * @function validateEmail
 * @param {string} email - The email of the user.
 * @return {boolean} If the user has an account.
 */
const validateEmail = async (email, phone_number) => {
  let query = {
    $or: [{ email }, { phone_number }],
  };
  let user = await User.findOne(query);
  return user ? false : true;
};

/**
 * Check if user account exist by email.
 * @async
 * @function validateEmail
 * @param {string} email - The email of the user.
 * @return {boolean} If the user has an account.
 */
const validateGroupRefIdAndUrlSlug = async (ref_id, url_slug) => {
  let query = {
    $or: [{ ref_id }, { url_slug }],
  };
  if (!url_slug) {
    query = { url_slug };
  }
  let group = await Group.findOne(query);
  return group ? false : true;
};

const getGroupByRefId = async (ref_id) => {
  let query = { ref_id };
  let group = await Group.findOne(query);
  return group ? group : null;
};

/**
 * Sets a validation schema for signup request body.
 * @const signupSchema
 */
const signupSchema = Joi.object({
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  phone_number: Joi.string().min(10).required(),
  country: Joi.string().min(3).required(),
  role: Joi.string().min(3).optional(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),

  ref_id: Joi.string()
    .length(10)
    .pattern(/^\d+$/)
    .messages({
      "string.pattern.base": `ref_id must be integer and have 10 digits.`,
    })
    .required(),
  title: Joi.when("role", {
    is: Joi.string().valid("admin"),
    then: Joi.string().min(3).required(),
    otherwise: Joi.string().min(3).optional(),
  }),
  url_slug: Joi.when("role", {
    is: Joi.string().valid("admin"),
    then: Joi.string().min(3).required(),
    otherwise: Joi.string().optional(),
  }),
});

/**
 * Sets a validation schema for login request body.
 * @const loginSchema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),
});

module.exports = {
  validateEmail,
  validateUsername,
  validateGroupRefIdAndUrlSlug,
  getGroupByRefId,
  signupSchema,
  loginSchema,
};
