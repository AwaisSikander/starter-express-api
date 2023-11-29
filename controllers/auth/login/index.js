// Modules
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Imports
const { SECRET, TOKEN_EXPIRATION } = require("../../../config");
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");
const { loginSchema } = require("../validate");

/**
 * Contains messages returned by the server when exceptions are catched.
 * @const MSG
 */
const MSG = {
  usernameNotExist: "Email is not found. Invalid login credentials.",
  wrongRole: "Please make sure this is your identity.",
  loginSuccess: "You are successfully logged in.",
  wrongPassword: "Incorrect password.",
  loginError: "Oops! Something went wrong.",
};

/**
 * login a user.
 * @async
 * @function login
 * @param {Object} userRequest - The data of the user {username, password} where username can be an email.
 * @param {string} role - The role of the user {admin, user, superadmin}.
 * @return {Object} contains 3 attributes {error/success message : string, success : boolean, reason: string}.
 */
const login = async (userRequest, res) => {
  try {
    const loginRequest = await loginSchema.validateAsync(userRequest);
    let { email, password } = loginRequest;
    // First Check if the username or email is in the database

    let user;
    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        reason: "email",
        message: MSG.usernameNotExist,
        success: false,
      });
    }

    // // We will check the role
    // if (user.role !== role) {
    //   return res.status(403).json({
    //     reason: "role",
    //     message: MSG.wrongRole,
    //     success: false,
    //   });
    // }
    // That means user is existing and trying to signin from the right portal
    // Now check for the password
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Sign in the token and issue it to the user

      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          email: user.email,
          group_ref_ids: user.group_ref_ids,
          group_id: user.group_id,
        },
        SECRET,
        { expiresIn: "7 days" }
      );
      const userMatch = {
        user_id: user._id,
      };
      if (user.group_id) {
        userMatch.group_id = user.group_id;
      }
      let userGroups = await UserGroup.aggregate([
        {
          $match: {
            $and: [
              {
                user_id: user._id,
              },
              { default_selected: true },
            ],
          },
        },
        {
          $lookup: {
            from: "groups",
            localField: "group_id",
            foreignField: "_id",
            as: "group",
          },
        },
        {
          $unwind: "$group",
          $unwind: {
            path: "$group",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: "$group._id",
            ref_id: "$group.ref_id",
            title: "$group.title",
            url_slug: "$group.url_slug",
            status: "$group.status",
            role: 1,
          },
        },
      ]);

      if (userGroups.length) {
        userGroups = userGroups[0];
      } else {
        userGroups = null;
      }

      let result = {
        user_id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        country: user.country,
        profile_pic: user.profile_pic,
        role: userGroups ? userGroups.role : undefined,
        user_role: user.role,
        email: user.email,
        group_ref_ids: user.group_ref_ids,
        group_id: user.group_id,
        user_group: userGroups ? userGroups : undefined,
        token: `Bearer ${token}`,
        expiresIn: TOKEN_EXPIRATION,
      };

      return res.status(200).json({
        ...result,
        message: MSG.loginSuccess,
        success: true,
      });
    } else {
      return res.status(403).json({
        reason: "password",
        message: MSG.wrongPassword,
        success: false,
      });
    }
  } catch (err) {
    let errorMsg = MSG.loginError;
    if (err.isJoi === true) {
      err.status = 403;
      errorMsg = err.message;
    }
    return res.status(500).json({
      reason: "server",
      message: errorMsg,
      success: false,
    });
  }
};

function isEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = login;
