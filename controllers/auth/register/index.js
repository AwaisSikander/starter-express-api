// Modules
const bcrypt = require("bcryptjs");
const { success, error } = require("consola");

// Imports
const {
  validateEmail,
  validateGroupRefIdAndUrlSlug,
  validateUsername,
  signupSchema,
} = require("../validate");
const User = require("../../../models/User");
const Group = require("../../../models/Group");
const GroupSetting = require("../../../models/GroupSetting");
const UserGroup = require("../../../models/UserGroup");
const { USER_PROFILE_IMAGE_PREFIX } = require("../../../config/index");
const { ROLE } = require("../../../config/roles");

/**
 * Contains messages returned by the server when exceptions are catched.
 * @const MSG
 */
const MSG = {
  usernameExists: "Username is already taken.",
  emailExists: "Email is already registered.",
  signupSuccess: "You are successfully signed up.",
  signupError: "Unable to create your account.",
  refIdOrUrlSlug: "Ref id or url is already taken.",
};

/**
 * Creates a new user.
 * @async
 * @function register
 * @param {Object} userRequest - The data of the user ().
 * @param {string} role - The role of the user {admin, user, superadmin}.
 * @return {Object} contains 2 attributes {error/success message : string, success : boolean}.
 */
const register = async (userRequest, role, res, file) => {
  try {
    userRequest.role = role;
    const signupRequest = await signupSchema.validateAsync(userRequest);

    // validate the email
    let emailNotRegistered = await validateEmail(signupRequest.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: MSG.emailExists,
        success: false,
      });
    }

    if ([ROLE.admin, ROLE.promoter].includes(role)) {
      let validateGroup = await validateGroupRefIdAndUrlSlug(
        signupRequest.ref_id,
        signupRequest.url_slug
      );
      if (!validateGroup) {
        return res.status(400).json({
          message: MSG.refIdOrUrlSlug,
          success: false,
        });
      }
    }

    // Get the hashed password
    const password = await bcrypt.hash(signupRequest.password, 12);
    // create a new user
    const newUser = new User({
      ...signupRequest,
      password,
      role,
    });
    await newUser.save();

    /* CREATE GROUP FOR BOTH PROMOTER & ADMIN */
    if ([ROLE.admin, ROLE.promoter].includes(role)) {
      const user_id = newUser._id;
      const status = "active";
      const { title, ref_id, url_slug } = signupRequest;
      const newGroup = new Group({ user_id, status, title, ref_id, url_slug });
      await newGroup.save();
      newUser.group_id = newGroup._id;
      if (newUser.group_ref_ids) newUser.group_ref_ids.push(ref_id);
      await newUser.save();
      const newGroupSettings = new GroupSetting({ group_id: newGroup._id });
      await newGroupSettings.save();
      const newUserGroups = new UserGroup({
        user_id: newUser._id,
        group_id: newGroup._id,
      });
      newUserGroups.save();
    }
    if (file) {
      const profileImagePath = `${USER_PROFILE_IMAGE_PREFIX}${newUser._id}/${file.filename}`;
      newUser.profile_pic = profileImagePath;
      await newUser.save();
    }
    return res.status(201).json({
      message: MSG.signupSuccess,
      success: true,
    });
  } catch (err) {
    let errorMsg = MSG.signupError;
    if (err.isJoi === true) {
      err.status = 403;
      errorMsg = err.message;
    }
    return res.status(500).json({
      message: errorMsg,
      success: false,
    });
  }
};

module.exports = register;
