require("dotenv").config();

module.exports = {
  DB: process.env.DB,
  SECRET: process.env.SECRET,
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
  USER_PROFILE_IMAGE_DESTINATION: "./public/uploads/users/images",
  USER_PROFILE_IMAGE_PREFIX: "/uploads/users/images",
  USER_WINNER_IMAGE_DESTINATION: "./public/uploads/groups/images",
  USER_WINNER_IMAGE_PREFIX: "/uploads/groups/images",
};
