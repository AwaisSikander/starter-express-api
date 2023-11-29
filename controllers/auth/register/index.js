// Modules
const bcrypt = require("bcryptjs");
const { success, error } = require("consola");

// Imports
const {
  validateEmail,
  validateGroupRefIdAndUrlSlug,
  getGroupByRefId,
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
  emailOrPhoneExists: "Email or phone number is already registered.",
  signupSuccess: "You are successfully signed up.",
  signupError: "Unable to create your account.",
  refIdOrUrlSlug: "Ref id or url is already taken.",
  refIdNotFound: "Ref id not found.",
  invalidRole: "Invalid role",
};

/**
 * Creates a new user.
 * @async
 * @function register
 * @param {Object} userRequest - The data of the user ().
 * @param {string} role - The role of the user {admin, user, superadmin}.
 * @return {Object} contains 2 attributes {error/success message : string, success : boolean}.
 * if admin need url_slug & new ref id  & if user only need ref_id
 */
const register = async (userRequest, res, file) => {
  try {
    const role = userRequest.role;
    let group;
    const signupRequest = await signupSchema.validateAsync(userRequest);
    if (![ROLE.admin, ROLE.promoter, ROLE.user].includes(role)) {
      return res.status(400).json({
        message: MSG.invalidRole,
        success: false,
      });
    }
    // validate the email
    let emailNotRegistered = await validateEmail(
      signupRequest.email,
      signupRequest.phone_number
    );
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: MSG.emailOrPhoneExists,
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
    } else if (ROLE.user == role) {
      group = await getGroupByRefId(signupRequest.ref_id);
      if (!group) {
        return res.status(400).json({
          message: MSG.refIdNotFound,
          success: false,
        });
      }
    }

    // console.log(group);
    // return group;

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
        group_ref_id: signupRequest.ref_id,
        role,
        default_selected: true,
      });
      newUserGroups.save();
    } else if (role == ROLE.user) {
      if (newUser.group_ref_ids)
        newUser.group_ref_ids.push(signupRequest.ref_id);
      await newUser.save();
      const newUserGroups = new UserGroup({
        user_id: newUser._id,
        group_id: group._id,
        group_ref_id: signupRequest.ref_id,
        role,
        default_selected: true,
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
