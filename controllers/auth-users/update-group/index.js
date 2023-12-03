// Imports
const User = require("../../../models/User");
const Group = require("../../../models/Group");
const UserGroup = require("../../../models/UserGroup");
const GroupSetting = require("../../../models/GroupSetting");
const { USER_PROFILE_IMAGE_PREFIX } = require("../../../config/index");

const profile = async (req, res, next) => {
  const { id } = req.user; // Get user ID from JWT
  const updates = req.body; // User update data
  const { group_id } = req.params;
  const userGroup = await UserGroup.findOne({ user_id: id, group_id });
  if (!userGroup || ["user"].includes(userGroup.role)) {
    return res
      .status(404)
      .json({ error: "Group not found or you do not have admin access" });
  }

  const group = await Group.findById(group_id);
  const groupSetting = await GroupSetting.findOne({ group_id });
  delete updates.ref_id;
  delete updates.role;

  // return res.status(200).json({ groupSetting });
  // const file = req.file;
  // if (file) {
  //   const profileImagePath = `${USER_PROFILE_IMAGE_PREFIX}${id}/${file.filename}`;
  //   updates.profile_pic = profileImagePath;
  // }

  const user = await User.findByIdAndUpdate(id, updates);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ user });
};

module.exports = profile;
