// Imports
const User = require("../../../models/User");
const UserGroup = require("../../../models/UserGroup");
const { USER_PROFILE_IMAGE_PREFIX } = require("../../../config/index");

const profile = async (req, res, next) => {
  const { id } = req.user; // Get user ID from JWT
  const updates = req.body; // User update data

  delete updates.group_id;
  delete updates.ref_id;
  delete updates.email;
  delete updates.phone_number;
  delete updates.role;
  delete updates.profile_pic;
  delete updates.password;

  const file = req.file;
  if (file) {
    const profileImagePath = `${USER_PROFILE_IMAGE_PREFIX}${id}/${file.filename}`;
    updates.profile_pic = profileImagePath;
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ user });
};

module.exports = profile;
