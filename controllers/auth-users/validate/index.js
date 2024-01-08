const User = require("../../../models/User");
const Group = require("../../../models/Group");
const Joi = require("joi");

/**
 * Check if user account exist by email.
 * @async
 * @function validateEmail
 * @param {string} email - The email of the user.
 * @return {boolean} If the user has an account.
 */
const validateGroupUrlSlug = async (url_slug) => {
  let query = {
    url_slug,
  };
  if (!url_slug) {
    query = { url_slug };
  }
  let group = await Group.findOne(query);
  return group ? group : false;
};

/**
 * Sets a validation schema for signup request body.
 * @const updateGroupSchema
 */
const updateGroupSchema = Joi.object({
  title: Joi.string().min(3),
  url_slug: Joi.string().min(3),
  description: Joi.string(),
  about: Joi.string(),
  days_to_count: Joi.string(),
  min_user_for_rating: Joi.number().min(3),
  can_give_rating_to_admin: Joi.boolean(),
  min_users: Joi.number().min(3),
  max_users: Joi.number().min(3),
});

module.exports = {
  updateGroupSchema,
  validateGroupUrlSlug,
};
