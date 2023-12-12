const profile = require("./group-users");
const createRating = require("./create-ratings");
const catchAsync = require("../../utils/CatchAsync");
const allRatingsOfGroup = require("./get-rating-events/all");
const getRatingById = require("./get-rating-events/index");
const getRatingByDate = require("./get-rating-events/by-date");
const getRatingByUrlSlugAndRef = require("./get-rating-events/bg-url-or-ref");
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

const createRatingsForUsers = catchAsync(async (req, res, next) =>
  createRating(req, req.user, res, next)
);

const getGroupRatings = catchAsync(async (req, res, next) =>
  allRatingsOfGroup(req, req.user, res, next)
);

const getGroupEventById = catchAsync(async (req, res, next) =>
  getRatingById(req, req.user, res, next)
);

const getGroupEventByDate = catchAsync(async (req, res, next) =>
  getRatingByDate(req, req.user, res, next)
);
const publicRating = catchAsync(async (req, res, next) =>
  getRatingByUrlSlugAndRef(req, req.user, res, next)
);

module.exports = {
  groupUsers,
  createRatingsForUsers,
  getGroupRatings,
  getGroupEventById,
  getGroupEventByDate,
  publicRating,
};
